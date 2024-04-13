// patientSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  patientData: null,
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    fetchPatientDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPatientDataSuccess(state, action) {
      state.loading = false;
      state.patientData = action.payload;
    },
    fetchPatientDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchPatientDataStart, fetchPatientDataSuccess, fetchPatientDataFailure } = patientSlice.actions;

export default patientSlice.reducer;
