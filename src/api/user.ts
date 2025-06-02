import request from '@/utils/request'
import type {ApiResponse} from '@/api/utils'

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
  // If agentId is provided, store it in localStorage before making the request
  if (agentId) localStorage.setItem('userAgentId', agentId)
  return request.post('/credit/selectSimpleLoanOverdue', {})
}

export function selectDetailedLoanOverdue(agentId?: string): Promise<any> {
  // If agentId is provided, store it in localStorage before making the request
  if (agentId) localStorage.setItem('userAgentId', agentId)
  return request.post('/credit/selectDetailedLoanOverdue', {})
}

export function saveAndExecutionRules(agentId?: string, data: any): Promise<ApiResponse> {
  // If agentId is provided, store it in localStorage before making the request
  if (agentId) localStorage.setItem('userAgentId', agentId)
  return request.post(`/credit/saveAndExecutionRules`, data)
}

export function updateFinalReview(agentId?: string, data: any): Promise<ApiResponse> {
  // If agentId is provided, store it in localStorage before making the request
  if (agentId) localStorage.setItem('userAgentId', agentId || '19955310021-01')
  return request.post(`/credit/updateFinalReview`, data)
}

export function selectFinalReview(agentId?: string): Promise<ApiResponse> {
  // If agentId is provided, store it in localStorage before making the request
  if (agentId) localStorage.setItem('userAgentId', agentId || '19955310021-01')
  return request.post(`/credit/selectFinalReview`, {})
}
