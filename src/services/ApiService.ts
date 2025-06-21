import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_HOST,
})

export default {
  login(creds: Object) {
    return apiClient.post('auth/login', creds, { withCredentials: true })
  },
  getAuthenticationState() {
    return apiClient.get('auth/me', { withCredentials: true })
  },
  getSecondaryVideos() {
    return apiClient.get('video/secondary')
  },
}
