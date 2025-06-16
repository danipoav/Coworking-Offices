import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Empresa } from '../interfaces/Empresa'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { app } from '../firebaseConfig'

interface EmpresasState {
    data: Empresa[]
    loading: boolean
    error: string | null
}

const initialState: EmpresasState = {
    data: [],
    loading: false,
    error: null,
}

export const fetchEmpresas = createAsyncThunk('empresas/fetch', async () => {
    const db = getFirestore(app)
    const querySnapshot = await getDocs(collection(db, 'EmpresasList'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Empresa[]
})

const empresasSlice = createSlice({
    name: 'empresas',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchEmpresas.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchEmpresas.fulfilled, (state, action) => {
                state.data = action.payload
                state.loading = false
            })
            .addCase(fetchEmpresas.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Error al cargar'
            })
    },
})

export default empresasSlice.reducer