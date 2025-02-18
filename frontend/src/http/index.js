import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json'
  }
})

// List of all endpoints
export const sendOtp = (data) => api.post("/api/send-otp", data)

export const verifyOtp = (data) => api.post("/api/verify-otp", data)

export const activate = (data) => api.post("/api/activate", data)

export const logout = () => api.get("/api/logout")

export const createRoom = (data) => api.post("/api/rooms", data);

export const getAllRooms = () => api.get("/api/rooms")

export const getRoom = (roomId) => api.get(`/api/rooms/${roomId}`)

export const deleteRoom = (roomId) => api.delete(`/api/rooms/${roomId}`);

export const getProfile = () => api.get("/api/profile")

export const encryptData = (data) => api.post("/api/encrypt", data)

// export const decryptData = (data) => api.post(`/encrypted/${data}`)

// Interceptors
api.interceptors.response.use(
  (config) => {
  return config
}, 
async (error) => {
  const originalRequest = error.config;
  if(error.response.status === 401 && error.config && !error.config._isRetry){
    originalRequest.isRetry = true;

    try{
      await axios.get(`${import.meta.env.VITE_API_URL}/api/refresh`, {
        withCredentials: true
      })

      return api.request(originalRequest)
    } catch(err){
      console.log(err.message)
    }
  }

  throw error
})

export default api;