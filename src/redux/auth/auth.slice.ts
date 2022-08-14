import { AuthState, Session, AuthStatus, LoginResponse, UserRefreshTokenResponse } from './auth.type';
import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { ThunkAction } from 'types';
import { checkDateIsValid } from 'utils/date';
import { getCurrentUser, getIsAdmin } from './auth.selectors';
import * as authService from 'services/auth.service';
import * as storage from 'utils/storage';

const SESSION_STORAGE_KEY = 'user-info';

export const storedUser = storage.getItem(SESSION_STORAGE_KEY) as null | Session;

const initialState: AuthState = storedUser
  ? {
      status: 'Loading',
      currentUser: storedUser,
      isAdmin: false,
    }
  : {
      status: 'Guest',
      currentUser: null,
      isAdmin: false,
    };

export const storeSession = createAction('auth/storeSession', function prepare(details: LoginResponse) {
  const expireDate = new Date();
  expireDate.setSeconds(expireDate.getSeconds() + details.expiresIn);
  const permissions = details.permissions;
  const accessToken = details.accessToken;

  return {
    payload: {
      expiresAt: expireDate.toISOString(),
      accessToken,
      refreshToken: details.refreshToken,
      permissions: permissions,
      username: details.username && details.username.trim(),
    },
  };
});

const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<LoginResponse>) => {
      const expireDate = new Date();
      expireDate.setSeconds(expireDate.getSeconds() + action.payload.expiresIn);
      const accessToken = action.payload.accessToken;
      state.currentUser = {
        expiresAt: expireDate.toISOString(),
        accessToken,
        username: action.payload.username && action.payload.username.trim(),
      };
      storage.saveItem(SESSION_STORAGE_KEY, state.currentUser);
    },
    removeSession: (state, action: PayloadAction<{ isAdmin: boolean }>) => {
      state.status = 'Guest';
      state.isAdmin = action.payload.isAdmin;
      state.currentUser = null;
    },
    setStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(storeSession, (state, action) => {
      state.status = 'Authenticated';
      state.currentUser = action.payload;
    });
  },
});

export const authReducer = authSlice.reducer;
export const { setUserInfo } = authSlice.actions;

const getCurrentSession = (): ThunkAction<Promise<Session | null>> => (dispatch, getState) => {
  const state = getState();
  //@ts-ignore
  const currentUser = getCurrentUser(state);
  if (!currentUser) {
    return Promise.resolve(null);
  }

  if (checkDateIsValid(new Date(currentUser.expiresAt), undefined, 5)) {
    return Promise.resolve(currentUser);
  }
  dispatch(authActions.logout());
  return Promise.reject(new Error('Something is wrong.'));
};

export const refreshToken = (): ThunkAction<Promise<Session>> => (dispatch, getState) => {
  const state = getState();
  //@ts-ignore
  const currentUser = getCurrentUser(state);
  if (!currentUser) {
    dispatch(authActions.logout());
    return Promise.reject(new Error('Something is wrong.'));
  }
  const request = authService.getNewToken(currentUser.refreshToken as string);
  request
    .then((res) => {
      if (res) {
        dispatch(setUserInfo({ ...currentUser, ...res }));
      }
    })
    .catch((err) => {
      dispatch(authActions.logout());
    });

  return (request as Promise<UserRefreshTokenResponse>).then((res) => {
    const { payload } = dispatch(
      storeSession({ ...currentUser, accessToken: res.refresh_token, expiresIn: res.expiresIn }),
    );
    storage.saveItem(SESSION_STORAGE_KEY, payload);
    return payload;
  });
};
const logout = (): ThunkAction<void> => (dispatch, getState) => {
  dispatch(
    authSlice.actions.removeSession({
      //@ts-ignore
      isAdmin: getIsAdmin(getState()),
    }),
  );
  storage.clearItem(SESSION_STORAGE_KEY);
};

export const authActions = {
  initState: (): ThunkAction<Promise<unknown>> => (dispatch) =>
    dispatch(getCurrentSession()).then((session) =>
      dispatch(authSlice.actions.setStatus(session ? 'Authenticated' : 'Guest')),
    ),
  logout,
};
