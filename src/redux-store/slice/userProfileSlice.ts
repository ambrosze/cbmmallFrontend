import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfileQueryParams {
  include?: string;
  append?: string;
}

interface UserProfileState {
  queryParams: UserProfileQueryParams;
}

const initialState: UserProfileState = {
  queryParams: {
    include: "wallet,referralCode",
    append: "is_admin",
  },
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setQueryParams: (state, action: PayloadAction<UserProfileQueryParams>) => {
      state.queryParams = { ...state.queryParams, ...action.payload };
    },
    setInclude: (state, action: PayloadAction<string>) => {
      state.queryParams.include = action.payload;
    },
    setAppend: (state, action: PayloadAction<string>) => {
      state.queryParams.append = action.payload;
    },
    resetQueryParams: (state) => {
      state.queryParams = initialState.queryParams;
    },
  },
});

export const { setQueryParams, setInclude, setAppend, resetQueryParams } = userProfileSlice.actions;
export default userProfileSlice.reducer;
