import { postDataNoInterceptor, getData, clientApi, extractErrors } from 'utils/api';
import { UserRefreshTokenResponse } from 'redux/auth/auth.type';
import jwt_decode from 'jwt-decode';
import { configs } from 'constant';
import { AxiosError } from 'axios';
interface LoginData {
  data: {
    accessToken: string;
  };
}

interface accessTokenType {
  email: string;
  fullName: string;
  sub: string;
  iat: number;
  exp: number;
}
export const login = async (username: string, password: string) => {
  const params = {
    email: username,
    password: password,
  };

  const res = await postDataNoInterceptor<LoginData>(`${configs.authUrl}`, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let loginResponse;
  if (res) {
    const decodeValue = jwt_decode(res.data.accessToken) as accessTokenType;
    loginResponse = {
      accessToken: res.data.accessToken,
      expiresIn: decodeValue.iat,
      username: decodeValue.fullName,
    };
  }
  return loginResponse;
};

export const getNewToken = (refreshToken: string) => {
  return getData<UserRefreshTokenResponse>('get_new_token/', {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  }).then((res) => res);
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<any> => {
  return clientApi
    .patch(`${configs.apiBaseUrl}/change-password`, {
      ...{ currentPassword: currentPassword, newPassword: newPassword },
    })
    .then((res) => {
      if (res.data) {
        return res.data;
      }
      return {} as any;
    })
    .catch((error: AxiosError) => extractErrors(error));
};
