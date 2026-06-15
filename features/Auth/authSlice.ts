import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user";
import { AuthState } from "@/types/auth";
// const user: User = {
//   id: "user-1",
//   username: "codingwmalik",
//   email: "codingwithmalik@gmail.com",
// //   image: "./icon.jpg",
//   createdAt: "2026-08-15T10:30:00.000Z",
// };
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
