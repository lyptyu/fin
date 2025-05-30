import request from '@/utils/request'

export interface LoginData {
  phone: string
  code: string
  agentId?: string
}

export interface LoginRes {
  token: string
}

export interface UserState {
  uid?: number
  name?: string
  avatar?: string
  phone?: string
  idCard?: string
  agentId?: string
}

export function login(data: LoginData): Promise<any> {
  return request.post<LoginRes>('/v1/auth/login', data)
}

export function loginStatus(): Promise<any> {
  return request.post<LoginRes>('/v1/auth/loginStatus')
}

export function logout() {
  return request.post('/user/logout')
}

export function getUserInfo() {
  return request<UserState>('/user/me')
}

export function getEmailCode(): Promise<any> {
  return request.get('/user/email-code')
}

export function resetPassword(): Promise<any> {
  return request.post('/user/reset-password')
}

export function register(): Promise<any> {
  return request.post('/user/register')
}

export function selectSimpleLoanOverdue(agentId?: string): Promise<any> {
  return request.post('/credit/selectSimpleLoanOverdue', {}, {
    headers: {
      'Agent-Id': agentId || '',
    },
  })
}

export function selectDetailedLoanOverdue(agentId?: string): Promise<any> {
  return request.post('/credit/selectDetailedLoanOverdue', {}, {
    headers: {
      'Agent-Id': agentId || '',
    },
  })
}
