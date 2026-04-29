import { createContext } from 'react'

export const AuthContext = createContext({
  authLoading: true,
  submitting: false,
  avatarSubmitting: false,
  isAuthenticated: false,
  accessToken: null,
  profile: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
  saveProfile: async () => {},
  saveAvatar: async () => {},
})
