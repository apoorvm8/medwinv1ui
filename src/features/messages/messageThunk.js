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
export const messagesBulkActions = createAsyncThunk('customers/messagesBulkActions', async (data, thunkAPI) => {
    try {
        let methodType = 'PUT';
        if (data.actionType === 'deletemsgs') {
            methodType = 'DELETE';
        }
        if (data.actionType === 'markmsgs') {
            methodType = 'PUT';
        }
        return await messageService.messagesBulkActions(data, methodType);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

