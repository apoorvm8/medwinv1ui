import {createAsyncThunk} from "@reduxjs/toolkit";
import customerService from "./customerService";


/**
* @desc Get the customers
* @param data  
*/
export const getCustomers$ = createAsyncThunk('customers/getCustomers$', async (data, thunkAPI) => {
    try {
        return await customerService.getCustomers$(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})


/**
* @desc Update the customer action
* @param data  
*/
export const customerAction$ = createAsyncThunk('customers/customerAction$', async (data, thunkAPI) => {
    try {
        return await customerService.customerAction$(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
* @desc Get the parent customer backup folder
* @param data  
*/
export const getCustomerBackupParentFolder = createAsyncThunk('customers/getCustomerBackupParentFolder', async (data, thunkAPI) => {
    try {
        return await customerService.getCustomerBackupParentFolder(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})


/**
* @desc Get the customers
* @param data  
*/
export const getCustomerEinvoices$ = createAsyncThunk('customers/getCustomerEinvoices$', async (data, thunkAPI) => {
    try {
        return await customerService.getCustomerEinvoices$(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
* @desc Get the customers stock access
* @param data  
*/
export const getCustomerStockAccess$ = createAsyncThunk('customers/getCustomerStockAccess$', async (data, thunkAPI) => {
    try {
        return await customerService.getCustomerStockAccess$(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
* @desc Get the customers backup access
* @param data  
*/
export const getCustomerBackupAccess$ = createAsyncThunk('customers/getCustomerBackupAccess$', async (data, thunkAPI) => {
    try {
        return await customerService.getCustomerBackupAccess$(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
* @desc Get the customers backup access
* @param data  
*/
export const getCustomerRegisters$ = createAsyncThunk('customers/getCustomerRegisters$', async (data, thunkAPI) => {
    try {
        return await customerService.getCustomerRegisters$(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
* @desc Function to bulk delete customer registers
* @param data  
*/
export const bulkDeleteCustomerRegisters = createAsyncThunk('customers/bulkDeleteCustomerRegisters', async (data, thunkAPI) => {
    try {
        return await customerService.bulkDeleteCustomerRegisters(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
* @desc Get the customers
* @param data  
*/
export const getCustomerWhatsapps$ = createAsyncThunk('customers/getCustomerWhatsapps$', async (data, thunkAPI) => {
    try {
        return await customerService.getCustomerWhatsapps$(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
* @desc Get the customer dashboard details
* @param data  
*/
export const getCustomerDashboardDetails$ = createAsyncThunk('customers/getCustomerDashboardDetails$', async (data, thunkAPI) => {
    try {
        return await customerService.getCustomerDashboardDetails$(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

