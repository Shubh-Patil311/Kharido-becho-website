import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  sellerId: null,
  sellerProfile: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      const { token, sellerId, sellerProfile } = action.payload || {};
      if (typeof token !== 'undefined') state.token = token;
      if (typeof sellerId !== 'undefined') state.sellerId = sellerId;
      if (typeof sellerProfile !== 'undefined') state.sellerProfile = sellerProfile;
    },
    setSellerId: (state, action) => {
      state.sellerId = action.payload;
    },
    setSellerProfile: (state, action) => {
      state.sellerProfile = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.sellerId = null;
      state.sellerProfile = null;
    },
  },
});

export const { setAuthState, setSellerId, setSellerProfile, setToken, clearAuth } = authSlice.actions;

export const selectSellerId = (state) => state.auth?.sellerId ?? null;
export const selectSellerProfile = (state) => state.auth?.sellerProfile ?? null;
export const selectAuthToken = (state) => state.auth?.token ?? null;

export default authSlice.reducer;

