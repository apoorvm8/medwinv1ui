
import { authInstance } from './../../interceptor/auth-interceptor';
import {updateProgressBar} from './folderThunk';

// List a folder, or search everything below it, for the folder browser
const browse = async (params) => {
    let response = await authInstance.get(`/folders/browse`, {params});
    return response.data.data;
}

// Download a file, or a whole folder as a ZIP
const download = async (item) => {
    let response;
    try {
        response = await authInstance.get(`/folders/download-file/${item.id}`, {responseType: 'blob'});
    } catch (error) {
        // Errors come back as a blob too, so read the server's message out of it.
        const message = await error.response?.data?.text().then((body) => JSON.parse(body).message).catch(() => null);
        throw new Error(message || `Could not download ${item.name}.`);
    }
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', item.resource_type === 'folder' ? item.name + '.zip' : item.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
    browse,
    download,
    createFolder,
    editFolder,
    deleteFolder,
    uploadFiles$,
    getFolderInfo$,
    getUserFolderPermissions$,
    updateUserFolderPermissions$
}


export default folderService;