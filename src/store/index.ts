import { configureStore } from '@reduxjs/toolkit'
import empresasReducer from './empresasSlice'

export const store = configureStore({
    reducer: {
        empresas: empresasReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch