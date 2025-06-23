import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Empresa } from '../interfaces/Empresa'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { app } from '../firebaseConfig'

interface EmpresasState {
    empresas: Empresa[]
    inactivas: Empresa[]
    empresaSeleccionada: Empresa | null
    loading: boolean
    error: string | null
}

const initialState: EmpresasState = {
    empresas: [],
    inactivas: [],
    empresaSeleccionada: null,
    loading: false,
    error: null,
}

export const fetchEmpresas = createAsyncThunk('empresas/fetch', async () => {
    const db = getFirestore(app)
    const querySnapshot = await getDocs(collection(db, 'EmpresaList'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Empresa[]
})

export const fetchEmpresasInactivas = createAsyncThunk('empresasInactivas/fetch', async () => {
    const db = getFirestore(app)
    const querySnapshot = await getDocs(collection(db, 'BajasList'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Empresa[]
})

const empresasSlice = createSlice({
    name: 'empresas',
    initialState,
    reducers: {
        setEmpresaSeleccionada(state, action: PayloadAction<Empresa>) {
            state.empresaSeleccionada = action.payload
        },
        limpiarEmpresaSeleccionada(state) {
            state.empresaSeleccionada = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchEmpresas.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchEmpresas.fulfilled, (state, action) => {
                state.empresas = action.payload
                state.loading = false
            })
            .addCase(fetchEmpresas.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Error al cargar'
            })
            .addCase(fetchEmpresasInactivas.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchEmpresasInactivas.fulfilled, (state, action) => {
                state.inactivas = action.payload
                state.loading = false
            })
            .addCase(fetchEmpresasInactivas.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Error al cargar'
            })
    },
})

export const { setEmpresaSeleccionada, limpiarEmpresaSeleccionada } = empresasSlice.actions
export default empresasSlice.reducer
