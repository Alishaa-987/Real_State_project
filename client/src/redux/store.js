import { configureStore } from '@reduxjs/toolkit'
import { useReducer } from 'react'
import userReducer from './user/userSlice'

export const store = configureStore({
  reducer: {user: userReducer},
  middleware:(getDefaultMiddleware)=> getDefaultMiddleware({
    serializableCheck:false,
  }),
})