import { AnyAction } from 'redux';
import { ThunkAction as OriginThunkAction, ThunkDispatch as OriginThunkDispatch } from 'redux-thunk';
import { AuthState } from '../redux/auth/auth.type';

export type ThunkAction<Result> = OriginThunkAction<Result, RootState, void, AnyAction>;
export type AppDispatch = OriginThunkDispatch<RootState, undefined, AnyAction>;
export type RootState = {
  auth: AuthState;
};
