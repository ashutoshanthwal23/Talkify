import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  user: null,
  otp: {
    email: '',
    phone: '',
    hash: ''
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      if(action.payload.user){
        state.isAuth = true;
      }
      else state.isAuth = false;
      
      state.user = action.payload.user
    },

    setOtp: (state, action) => {
      const { phone, hash, email } = action.payload;
      state.otp.phone = phone;
      state.otp.hash = hash;
      state.otp.email = email
    }
  }
})

export const { setAuth, setOtp } = authSlice.actions

export default authSlice.reducer