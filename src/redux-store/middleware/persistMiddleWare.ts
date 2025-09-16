import {AppState} from '../store'
import {Middleware} from '@reduxjs/toolkit'

export const persistMiddleware: Middleware = store => next => action => {
  const result = next(action)

  if (typeof window !== 'undefined') {
    const state = store.getState() as AppState
    localStorage.setItem('auth', JSON.stringify(state.auth))
   
  }

  return result
}
