import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user";
import { AuthState } from "@/types/auth";
import { RootState } from "@/store/store";
// const user:;
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

    // add to authSlice.ts reducers, alongside setUser/logout/setLoading

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) return;
      Object.assign(state.user, action.payload);
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

export const { setUser, logout, setLoading ,updateUser} = authSlice.actions;
export const selectUsernameById = (state: RootState, userId: string) => {
  const user = state.auth.user;
  if (user && user.id === userId) {
    return user.username;
  }
  return "Unknown User";
};
export const selectCurrentUsername = (state: RootState) => {
  const user = state.auth.user;
  return user ? user.username : "Unknown User";
};
export const selectisAuthenticated = (state:RootState)=> state.auth.isAuthenticated
export default authSlice.reducer;
