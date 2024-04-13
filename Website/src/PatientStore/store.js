// store.js

import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './patientSlice';

const store = configureStore({
  reducer: {
    patient: patientReducer,
    // Add other reducers as needed
  },
});

export default store;
