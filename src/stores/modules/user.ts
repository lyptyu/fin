import { defineStore } from 'pinia'
import type { LoginData, UserState } from '@/api/user'
import { clearToken, setToken } from '@/utils/auth'

import {
  getEmailCode,
  getUserInfo,
  resetPassword,
  login as userLogin,
  logout as userLogout,
  register as userRegister,
} from '@/api/user'

const InitUserInfo = {
  uid: 0,
  nickname: '',
  avatar: '',
  name: '',
  phone: '',
  idCard: '',
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserState>({ ...InitUserInfo })

  // Set user's information
  const setInfo = (partial: Partial<UserState>) => {
    userInfo.value = { ...partial }
  }

  // Set user's phone number
  const setPhone = (phone: string) => {
    userInfo.value.phone = phone
  }

  // Set user's name
  const setName = (name: string) => {
    userInfo.value.name = name
  }

  // Set user's ID card
  const setIdCard = (idCard: string) => {
    userInfo.value.idCard = idCard
  }

  // Get user's phone number
  const getPhone = (): string | undefined => {
    return userInfo.value.phone
  }

  // Get user's name
  const getName = (): string | undefined => {
    return userInfo.value.name
  }

  // Get user's ID card
  const getIdCard = (): string | undefined => {
    return userInfo.value.idCard
  }

  const login = async (loginForm: LoginData) => {
    try {
      const { code, msg } = await userLogin(loginForm)
      if (code !== 0) {
        throw msg
      }
      setToken(loginForm.username)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }

  const info = async () => {
    try {
      const { data } = await getUserInfo()
      setInfo(data)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }

  const logout = async () => {
    try {
      await userLogout()
    }
    finally {
      clearToken()
      setInfo({ ...InitUserInfo })
    }
  }

  const getCode = async () => {
    try {
      const data = await getEmailCode()
      return data
    }
    catch {}
  }

  const reset = async () => {
    try {
      const data = await resetPassword()
      return data
    }
    catch {}
  }

  const register = async () => {
    try {
      const data = await userRegister()
      return data
    }
    catch {}
  }

  return {
    userInfo,
    info,
    login,
    logout,
    getCode,
    reset,
    register,
    setPhone,
    setName,
    setIdCard,
    getPhone,
    getName,
    getIdCard,
  }
}, {
  persist: true,
})

export default useUserStore
