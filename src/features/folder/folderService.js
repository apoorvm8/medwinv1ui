
import { authInstance } from './../../interceptor/auth-interceptor';
import {updateProgressBar} from './folderThunk';

// Get the folder children from the API
const getChildren = async (data) => {
    let response = await authInstance.get(`/folders?filters=${JSON.stringify(data)}`);
    let {folders} = response.data.data;
    return {selectedFolderId: data.parent_id, folderChildren: folders};
}

// Create a folder
const createFolder = async (data) => {
    let response = await authInstance.post(`/folders`, data);
    return response.data;
}

// Edit a folder
const editFolder = async (data) => {
    data["_method"] = "PUT";
    let response = await authInstance.post(`/folders/${data.id}`, data);
    return response.data;
}

// Delete folder
const deleteFolder = async(data) => {
    let response = await authInstance.post(`/folders/${data.id}`, {_method: 'DELETE', shouldDeleteFolder: data.shouldDeleteFolder});
    return response.data;
}

// Upload multiple files
const uploadFiles$ = async(data, thunkAPI) => {
    const formData = new FormData();

    for (let i = 0; i < Object.keys(data.fileLst).length; i++) {
        formData.append('folderFiles[]', data.fileLst[i]);
    }

    // formData.append('folderFiles[]', 'adsdasd');
    formData.append('id', data.id);

    let response = await authInstance.post(`/folders/upload-files`, formData, {
        onUploadProgress: (progressEvent) => {
            const progress = Math.round((100 * progressEvent.loaded) / progressEvent.total);
            thunkAPI.dispatch(updateProgressBar(progress));
            return progress;
        },
    });
    return response.data;
}

const getFolderInfo$ = async(data) => {
    let response = await authInstance.get(`/folders/folder-info/${data.id}`);
    return response.data;
}

const getUserFolderPermissions$ = async(data) => {
    let response = await authInstance.get(`/folders/folder-permission-users/${data.id}?fromadd=${data.fromAdd}`);
    return response.data;
}

const updateUserFolderPermissions$ = async(data) => {
    data['_method'] = 'PUT';
    let response = await authInstance.post(`/folders/folder-permission-users/${data.id}`, data);
    return response.data;
}



const folderService = {
    getChildren,
    createFolder,
    editFolder,
    deleteFolder,
    uploadFiles$,
    getFolderInfo$,
    getUserFolderPermissions$,
    updateUserFolderPermissions$
}


export default folderService;