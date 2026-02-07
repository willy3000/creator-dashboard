import { createSlice } from '@reduxjs/toolkit';

// Create a slice for managing user information
const assetsSlice = createSlice({
  name: 'assets',
  initialState: {
    assets: [], // Or initialize with default user data
  },
  reducers: {
    setAssets: (state, action) => {
      state.assets = action.payload; // Set user information
    },
  },
});

// Export actions and reducer
export const { setAssets } = assetsSlice.actions;
export default assetsSlice.reducer;