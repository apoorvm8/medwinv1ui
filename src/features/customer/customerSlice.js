import { createSlice } from '@reduxjs/toolkit';
import {bulkDeleteCustomerRegisters, customerAction$, getCustomerBackupAccess$, getCustomerDashboardDetails$, getCustomerEinvoices$, getCustomerStockAccess$, getCustomerWhatsapps$, getCustomers$} from './customerThunk';

// Our state for this reducer
const initialState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}


export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder.
        addCase(getCustomers$.pending, (state) => {
            state.isLoading = true;
            state.loadingMsg = "Fetching customers...";
        })
        .addCase(getCustomers$.fulfilled, (state) => {
            state.loadingMsg = "";
            state.isLoading = false;
            state.isSuccess = true;

        })
        .addCase(getCustomers$.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(customerAction$.pending, (state) => {
            state.isLoading = true;
            state.loadingMsg = "Fetching customers...";
        })
        .addCase(customerAction$.fulfilled, (state) => {
            state.loadingMsg = "";
            state.isLoading = false;
            state.isSuccess = true;

        })
        .addCase(customerAction$.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getCustomerEinvoices$.pending, (state) => {
            state.isLoading = true;
            state.loadingMsg = "Fetching customers...";
        })
        .addCase(getCustomerEinvoices$.fulfilled, (state) => {
            state.loadingMsg = "";
            state.isLoading = false;
            state.isSuccess = true;

        })
        .addCase(getCustomerEinvoices$.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getCustomerStockAccess$.pending, (state) => {
            state.isLoading = true;
            state.loadingMsg = "Fetching customers...";
        })
        .addCase(getCustomerStockAccess$.fulfilled, (state) => {
            state.loadingMsg = "";
            state.isLoading = false;
            state.isSuccess = true;

        })
        .addCase(getCustomerStockAccess$.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getCustomerBackupAccess$.pending, (state) => {
            state.isLoading = true;
            state.loadingMsg = "Fetching customers...";
        })
        .addCase(getCustomerBackupAccess$.fulfilled, (state) => {
            state.loadingMsg = "";
            state.isLoading = false;
            state.isSuccess = true;

        })
        .addCase(getCustomerBackupAccess$.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(bulkDeleteCustomerRegisters.pending, (state) => {
            state.isLoading = true;
            state.loadingMsg = "Deleting selected records...";
        })
        .addCase(bulkDeleteCustomerRegisters.fulfilled, (state) => {
            state.loadingMsg = "";
            state.isLoading = false;
            state.isSuccess = true;

        })
        .addCase(bulkDeleteCustomerRegisters.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getCustomerWhatsapps$.pending, (state) => {
            state.isLoading = true;
            state.loadingMsg = "Fetching customer whatsapps...";
        })
        .addCase(getCustomerWhatsapps$.fulfilled, (state) => {
            state.loadingMsg = "";
            state.isLoading = false;
            state.isSuccess = true;

        })
        .addCase(getCustomerWhatsapps$.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getCustomerDashboardDetails$.pending, (state) => {
            state.isLoading = true;
            state.loadingMsg = "Fetching customer dashboard details...";
        })
        .addCase(getCustomerDashboardDetails$.fulfilled, (state) => {
            state.loadingMsg = "";
            state.isLoading = false;
            state.isSuccess = true;

        })
        .addCase(getCustomerDashboardDetails$.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
})

export const {reset}  = customerSlice.actions;
export default customerSlice.reducer