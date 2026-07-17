// features/Profile/accountSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export interface PersonalInfo {
  gender: string | null;
  dateOfBirth: string | null; // ISO date string
  country: string | null;
}

interface AccountState {
  personalInfo: PersonalInfo;
  isSaving: boolean;
  error: string | null;
}

const initialState: AccountState = {
  personalInfo: { gender: null, dateOfBirth: null, country: null },
  isSaving: false,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    // ── Personal info ──
    // Called only after the API confirms success — see confirm-then-commit note above.
    setPersonalInfo(state, action: PayloadAction<Partial<PersonalInfo>>) {
      Object.assign(state.personalInfo, action.payload);
    },

    // ── Save/error state for the edit forms ──
    setAccountSaving(state, action: PayloadAction<boolean>) {
      state.isSaving = action.payload;
    },

    setAccountError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setPersonalInfo, setAccountSaving, setAccountError } =
  accountSlice.actions;

export const selectPersonalInfo = (state: RootState) =>
  state.account.personalInfo;

export const selectIsAccountSaving = (state: RootState) =>
  state.account.isSaving;

export const selectAccountError = (state: RootState) => state.account.error;

export default accountSlice.reducer;
