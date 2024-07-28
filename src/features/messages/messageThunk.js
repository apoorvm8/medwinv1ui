import {createAsyncThunk} from "@reduxjs/toolkit";
import messageService from "./messageService";


/**
* @desc Get the customers
* @param data  
*/
export const getCustomerMessages$ = createAsyncThunk('customers/getMessages$', async (data, thunkAPI) => {
    try {
        return await messageService.getCustomerMessages$(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})


/**
* @desc Function to mark messages as seen in bulk
* @param data  
*/
export const markSelectedMessages = createAsyncThunk('customers/markSelectedMessages', async (data, thunkAPI) => {
    try {
        return await messageService.markSelectedMessages(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

