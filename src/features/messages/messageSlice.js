import { createSlice } from '@reduxjs/toolkit';
import {getCustomerMessages$} from './messageThunk';

// Our state for this reducer
const initialState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    totalMessages: 0,
    unreadMessages: 0
}


export const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
        unreadMsgCnt: (state, action) => {
            state.unreadMessages = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCustomerMessages$.pending, (state) => {
            state.isLoading = true;
            state.loadingMsg = "Fetching customer messages...";
        })
        .addCase(getCustomerMessages$.fulfilled, (state, action) => {
            state.loadingMsg = "";
            state.isLoading = false;
            state.isSuccess = true;
            state.unreadMessages = action.payload.data.customerMsgs.unread;

        })
        .addCase(getCustomerMessages$.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
})

export const {reset, unreadMsgCnt}  = messageSlice.actions;
export default messageSlice.reducer