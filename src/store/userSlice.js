import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  timeoutDuration: 10,
  soundEnabled: true,
  darkMode: false,
  language: 'English',
  warningMessage: 'Your session will expire due to inactivity',
  loginStatus: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTimeoutDuration: (state, action) =>{
      state.timeoutDuration = action.payload;
    },


    toggleSound : (state)=>{
      state.soundEnabled = !state.soundEnabled;
    },


    toggleDarkMode: (state)=>{
      state.darkMode = !state.darkMode;
    },

    setLoginStatus: (state, action)=>{
      state.loginStatus = action.payload
    },


    setLanguage: (state, action)=>{
      state.language = action.payload;
    },
    setWarningMessage: (state, action)=>{
      state.warningMessage = action.payload;
    },

  },
});

export const {
  setTimeoutDuration,
  toggleSound,
  toggleDarkMode,
  setLanguage,
  setWarningMessage,
  setLoginStatus,
} = userSlice.actions;

export default userSlice.reducer;