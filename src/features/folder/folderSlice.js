import { createSlice } from '@reduxjs/toolkit';
import {createFolder, uploadFiles$, updateProgressBar, deleteFolder, getFolderInfo$, getUserFolderPermissions$, updateUserFolderPermissions$, editFolder} from './folderThunk';

// Our state for this reducer (the folder browser keeps its listing itself; this tracks the folder dialogs)
const initialState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    fileUploadProgress: 0,
    loadingMsg: '',
}

export const folderSlice = createSlice({
    name: 'folder',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
            state.fileUploadProgress = 0;
            state.loadingMsg = '';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(createFolder.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createFolder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.msg;
        })
        .addCase(createFolder.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(editFolder.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(editFolder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.msg;
        })
        .addCase(editFolder.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(deleteFolder.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteFolder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.msg;
        })
        .addCase(deleteFolder.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(uploadFiles$.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(uploadFiles$.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.msg;
        })
        .addCase(uploadFiles$.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(updateProgressBar.pending, (state) => {
            state.fileUploadProgress = 0;
        })
        .addCase(updateProgressBar.fulfilled, (state, action) => {
            state.fileUploadProgress = action.payload;
        })
        .addCase(updateProgressBar.rejected, (state) => {
            state.fileUploadProgress = 0;
        })
        .addCase(getFolderInfo$.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getFolderInfo$.fulfilled, (state, action) => {
            state.loadingMsg = "";
            state.isLoading = false;
            state.isSuccess = true;
        })
        .addCase(getFolderInfo$.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getUserFolderPermissions$.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getUserFolderPermissions$.fulfilled, (state) => {
            state.loadingMsg = "";
            state.isLoading = false;
            state.isSuccess = true;
        })
        .addCase(getUserFolderPermissions$.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(updateUserFolderPermissions$.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateUserFolderPermissions$.fulfilled, (state) => {
            state.loadingMsg = "";
            state.isLoading = false;
            state.isSuccess = true;
        })
        .addCase(updateUserFolderPermissions$.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
})

export const {reset}  = folderSlice.actions;
export default folderSlice.reducer