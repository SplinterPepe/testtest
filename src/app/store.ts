import { configureStore } from '@reduxjs/toolkit'
import usersReducer from '../features/users/usersSlice'
import modalsReducer from '../features/modals/modalsSlice'

export const store = configureStore({
  reducer: {
    usersList: usersReducer,
    modalState: modalsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch