import api from './axios.config'

import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
} from '../types/Auth'

export const registerUser = async (payload: RegisterRequest): Promise<UserResponse> => {
  const { data } = await api.post<UserResponse>('/auth/register', payload)
  return data
}

export const loginUser = async (payload: LoginRequest): Promise<TokenResponse> => {
  const { data } = await api.post<TokenResponse>('/auth/login', payload)
  return data
}
