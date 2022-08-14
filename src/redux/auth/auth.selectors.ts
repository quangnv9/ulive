import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'redux/rootReducers';

const getAuthState = (state: RootState) => state.auth;
export const getAuthStatus = createSelector(getAuthState, (authState) => authState.status);
export const getCurrentUser = (state: RootState) => getAuthState(state).currentUser;
export const getIsAdmin = (state: RootState) => getAuthState(state).isAdmin;
