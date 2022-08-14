import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './auth/auth.slice';
import { categoryReducer } from './category/category.slice';

const rootReducers = combineReducers({
  auth: authReducer,
  category: categoryReducer,
});

export type RootState = ReturnType<typeof rootReducers>;

export default rootReducers;
