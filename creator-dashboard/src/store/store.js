import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import assetsReducer from "./slices/assetsSlice";

// Create the Redux store
const store = configureStore({
  reducer: {
    user: userReducer,
    assets: assetsReducer,
  },
});

export default store;
