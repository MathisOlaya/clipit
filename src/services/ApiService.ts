import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_HOST,
})

export default {
  getAuthenticationState() {
    return apiClient.get('auth/me')
  },
  getSecondaryVideos() {
    return apiClient.get('video/secondary')
  },
}
