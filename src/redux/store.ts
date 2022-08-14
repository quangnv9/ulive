import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import rootReducers from 'redux/rootReducers';

export const store = configureStore({
  reducer: rootReducers,
});

export type AppDispatch = typeof store.dispatch;
export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
