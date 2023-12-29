import { createSlice } from '@reduxjs/toolkit';
import {createFolder, collapseFolder, getChildren, uploadFiles$, updateProgressBar, deleteFolder, downloadResource, getFolderInfo$, getUserFolderPermissions$, updateUserFolderPermissions$, editFolder} from './folderThunk';

// Our state for this reducer
const initialState = {
    // Here currently I am hardcoding the root object to avoid uneccessary complication of fetching this from server
    folders: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    fileUploadProgress: 0,
    loadingMsg: '',
}


let tempFolders = [];

// The actual recursive function that goes through the tree and removes the children (bottom up)
const removeChildren = (folderId) => {
    // Extract the folder from the temp array
    let folder = tempFolders.filter(el => el.id === folderId)[0];
    // first fetch the child of the folder to be collapsed
    let children = tempFolders.filter(el => el.parent_id === folder.id);

    // if it has children then 
    if(children.length > 0) {

      // loop through each child
      children.forEach(child => {
        // recursively call until you reach the leaf i.e end of tree
        removeChildren(child.id);
        // remove the child from the folders array
        tempFolders = tempFolders.filter(el => el.id !== child.id);
      });
    }
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
        .addCase(getChildren.pending, (state) => {
            state.isLoading = true;
            state.loadingMsg = "Fetching Folders...";
        })
        .addCase(getChildren.fulfilled, (state, action) => {
            state.loadingMsg = "";
            state.isLoading = false;
            state.isSuccess = true;
            let selectedFolderId = action.payload.selectedFolderId;
            let folderChildren = action.payload.folderChildren;
            if(selectedFolderId) {
                let index = state.folders.findIndex((folder) => folder.id === selectedFolderId);
    
                // From the current folder's clicked index + 1, insert these children using splice, other will shift accordingly.
                state.folders.splice(index + 1, 0, ...folderChildren);
    
                // Now find the folder that was clicked and change its open status
                state.folders = state.folders.map(el => {
                    if(el.id === selectedFolderId) {
                        el.is_open = true;
                    }
    
                    return el;
                });   
            } else {
                state.folders = folderChildren;
            }
        })
        .addCase(getChildren.rejected, (state, action) => {
            state.isLoading = false;
            state.folders = [];
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(collapseFolder.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(collapseFolder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            
            // Since I don't want to manipulate state outside this reducer, assign this to temporary folders array which is global
            tempFolders = [...state.folders];
            
            // Call the remove children method on the folder that was clicked to be closed from UI
            removeChildren(action.payload);
            
            // After recusrion is done on the temp folders, assign this to the current folder state
            state.folders = [...tempFolders];
           
            // Map through to toggle the is_open to false for the clicked folder
            state.folders = state.folders.map(el => {
                if(el.id === action.payload) {
                    el.is_open = false;
                }
                return el;
            });
           
            // Make the tempfolders empty again
            tempFolders = [];
        })
        .addCase(collapseFolder.rejected, (state, action) => {
            state.isLoading = false;
            state.folders = [];
            state.isError = true;
        })
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
            state.folders = state.folders.map(el => {
                if(el.id === action.payload.data.folder.id) {
                    el.name = action.payload.data.folder.name;
                    el.resource_module = action.payload.data.folder.resource_module;
                    el.path = action.payload.data.folder.path;
                }
                return el;
            });
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