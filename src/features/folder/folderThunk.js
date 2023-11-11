import {createAsyncThunk} from "@reduxjs/toolkit";
import folderService from './folderService';


/**
* @desc Get the child folders
* @param data  
*/
export const getChildren = createAsyncThunk('folder/getchildren', async (data, thunkAPI) => {
    try {
        return await folderService.getChildren(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
* @desc Following function handles the removal of child folders when a folder is closed
* @param data 
*/
export const collapseFolder = createAsyncThunk('folder/collapseFolder', async (data, thunkAPI) => {
    try {
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
* @desc Following function handles the removal of child folders when a folder is closed
* @param data 
*/
export const createFolder = createAsyncThunk('folder/createFolder', async (data, thunkAPI) => {
    try {
        return await folderService.createFolder(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
* @desc Following function handles the removal of child folders when a folder is closed
* @param data 
*/
export const editFolder = createAsyncThunk('folder/editFolder', async (data, thunkAPI) => {
    try {
        return await folderService.editFolder(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
 * @desc Following function handles the deletion of a folder
 * @param int id
 */
export const deleteFolder = createAsyncThunk('folder/deleteFolder', async (data, thunkAPI) => {
    try {
        return await folderService.deleteFolder(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
 * @desc Following function handle multi file upload
 * @param {} data
 */
export const uploadFiles$ = createAsyncThunk('folder/uploadFiles$', async (data, thunkAPI) => {
    try {
        return await folderService.uploadFiles$(data, thunkAPI);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
 * @desc Following function handle multi file upload
 * @param {} data
 */
export const updateProgressBar = createAsyncThunk('folder/updateProgressBar', async (data, thunkAPI) => {
    try {
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
 * @desc Following function handle downloading of resource
 * @param {} data
 */
export const downloadResource = createAsyncThunk('folder/downloadResource', async (data, thunkAPI) => {
    try {
        return await folderService.downloadResource(data);
    } catch (error) {
        let responseObj = await error.response.data.text();
        const message = JSON.parse(responseObj).message;
        // const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
 * @desc Following function handle downloading of resource
 * @param {} data
 */
export const getFolderInfo$ = createAsyncThunk('folder/getFolderInfo$', async (data, thunkAPI) => {
    try {
        return await folderService.getFolderInfo$(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
 * @desc Following function retrieves the user's permissions for this folder 
 * @param data
 */
export const getUserFolderPermissions$ = createAsyncThunk('folder/getUserFolderPermissions$', async (data, thunkAPI) => {
    try {
        return await folderService.getUserFolderPermissions$(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

/**
 * @desc Following function retrieves the user's permissions for this folder 
 * @param data
 */
export const updateUserFolderPermissions$ = createAsyncThunk('folder/updateUserFolderPermissions$', async (data, thunkAPI) => {
    try {
        return await folderService.updateUserFolderPermissions$(data);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})

