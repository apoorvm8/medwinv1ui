import React, {Fragment, useState} from 'react'
import WidgetsIcon from '@mui/icons-material/Widgets';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import {IconButton, Menu, MenuItem, Slide, Tooltip} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import AddFolder from './folderactions/AddFolder';
import EditFolder from './folderactions/EditFolder';
import DeleteFolder from './folderactions/DeleteFolder';
import UploadFile from './folderactions/UploadFile';
import ConfirmDialog from '../shared/ConfirmDialog';
import CheckIcon from '@mui/icons-material/Check';
import { toast } from 'react-toastify';
import {useDispatch, useSelector} from 'react-redux';
import {downloadResource} from '../../features/folder/folderThunk';
import {reset} from '../../features/folder/folderSlice';
import FolderInfo from './folderactions/FolderInfo';
import FolderPermission from './folderactions/FolderPermission';
import {authInstance} from '../../interceptor/auth-interceptor';

function FolderMenu({folder}) {
    const styles = {
        iconSize: {
           fontSize: '22px !important',
        }

    }

    let {resource_type, slug, folder_permissions} =  folder;
    const [selectedMenu, setSelectedMenu] = useState({isOpen: false, id: -1});
    const [dialogFlags, setDialogFlag] = useState({add: false, edit: false, delete: false, upload: false, info: false, permission: false});
    const [confirmDialog, setConfirmDialog] = useState(false);
    const {user} = useSelector(state => state.auth);

    const dispatch = useDispatch();

    const handleDialogOpen = (option) => {
        let tempObj = {...dialogFlags};
        tempObj[option] = !tempObj[option];
        setDialogFlag(tempObj);
    }

    const handleDialogClose = (option) => {
        let tempObj = {...dialogFlags};
        tempObj[option] = !tempObj[option];
        setDialogFlag(tempObj);
    };

    const handleClick = (id) => {
       setSelectedMenu(prevState => ({
            ...prevState,
            isOpen : !selectedMenu.isOpen,
            id: id
       }))
    }

    const handleCloseConfirmDialog = async (confirm) => {
        // Dispatch delete function
        setConfirmDialog(false);
        
        if(confirm) {
            try {
                toast.success(`Starting download of ${folder.name}`);
                let response = await authInstance.get(`/folders/download-file/${folder.id}`, {responseType: 'blob'});
                let res = response.data;
                const url = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(new Blob([res])) : window.webkitURL.createObjectURL(new Blob([res]));
                const link = document.createElement('a');                
                link.href = url;
                link.setAttribute('download', folder.resource_type  === "folder" ? folder.name + ".zip" : folder.name); //or any other extension
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                toast.dismiss();
                toast.success("Download started successfully.");
            } catch(error) {
                toast.dismiss();
                toast.error('Error in downloading file');
            }
            dispatch(reset());
        }
        
      }

    if(!user) {
        return null;
    }
    
    return (
        <Fragment>
            {selectedMenu.id === folder.id && selectedMenu.isOpen
                ? (
                    <Tooltip title="Close Folder Options">
                        <IconButton onClick={() => {handleClick(folder.id)}}>
                            <MenuOpenIcon sx={[styles.iconSize, {color: 'blue', cursor: 'pointer', marginBottom: '.35rem'}]}/>
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Show Folder Options">
                        <IconButton onClick={() => {handleClick(folder.id)}}>
                            <MenuIcon sx={[styles.iconSize, {color: 'blue', cursor: 'pointer', marginBottom: '.35rem'}]}
                            />
                        </IconButton>
                    </Tooltip>
                )
            }
            {
                slug === 'root' ? (
                    <Slide direction="right" in={selectedMenu.id === folder.id && selectedMenu.isOpen} mountOnEnter unmountOnExit>
                        <span className="tool-box" style={{display:'flex', marginTop: '-0.5rem'}}>
                            { 
                                resource_type === "folder" && user.role === process.env.REACT_APP_SUPER_USER ? (
                                    <Tooltip title={`Create Folder in ${folder.name}`}>
                                        <IconButton onClick={() => { handleDialogOpen('add') }} sx={{color: '#007bff', fontWeight: 'bold'}}>
                                            <AddIcon sx={[styles.iconSize]}/>
                                        </IconButton>
                                    </Tooltip>
                                ) : null
                            }
                            {
                                resource_type === "folder" && user.role === process.env.REACT_APP_SUPER_USER ? (
                                    <Tooltip title={`Folder info`}>
                                        <IconButton onClick={() => {handleDialogOpen('info')}} sx={{color: '#17a2b8'}}>
                                            <QuestionMarkIcon sx={[styles.iconSize]}/>
                                        </IconButton>
                                    </Tooltip>
                                ) : null
                            }
                            {
                                resource_type === "folder" && user.role === process.env.REACT_APP_SUPER_USER  ? (
                                    <Tooltip title={`Upload file(s) in ${folder.name}`}>
                                        <IconButton onClick={() => handleDialogOpen('upload')} sx={{color: '#007bff'}}>
                                            <UploadIcon sx={[styles.iconSize]}/>
                                        </IconButton>
                                    </Tooltip>
                                ) : null
                            }
                            {
                                resource_type === "folder" && user.role === process.env.REACT_APP_SUPER_USER ? (
                                    <Tooltip title={`Download ${resource_type === "folder" ? `${folder.name} content's` : `${folder.name}`}`}>
                                        <IconButton onClick={() => setConfirmDialog(true)} sx={{color: '#007bff'}}>
                                            <DownloadIcon sx={[styles.iconSize]}/>
                                        </IconButton>
                                    </Tooltip> )
                                 : null
                            }
                        </span>
                    </Slide>
                ) : (folder_permissions || user.role === process.env.REACT_APP_SUPER_USER) ? (
                    <Slide direction="right" in={selectedMenu.id === folder.id && selectedMenu.isOpen} mountOnEnter unmountOnExit>
                        <span className="tool-box" style={{display:'flex', marginTop: '-0.5rem'}}>
                            { 
                                resource_type === "folder" && (folder_permissions?.create || user.role === process.env.REACT_APP_SUPER_USER) ? (
                                    <Tooltip title={`Create Folder in ${folder.name}`}>
                                        <IconButton onClick={() => { handleDialogOpen('add') }} sx={{color: '#007bff', fontWeight: 'bold'}}>
                                            <AddIcon sx={[styles.iconSize]}/>
                                        </IconButton>
                                    </Tooltip>
                                ) : null
                            }
                            {
                                resource_type === "folder" && (folder_permissions?.edit || user.role === process.env.REACT_APP_SUPER_USER) ? (
                                    <Tooltip title={`Change folder properties`}>
                                        <IconButton onClick={() => { handleDialogOpen('edit') }} sx={{color: '#ffc107'}}>
                                            <EditIcon sx={[styles.iconSize]}/>
                                        </IconButton>
                                    </Tooltip>
                                ) : null
                            }
                            {
                                folder_permissions?.info || user.role === process.env.REACT_APP_SUPER_USER ? (
                                    <Tooltip title={`Folder info`}>
                                        <IconButton onClick={() => {handleDialogOpen('info')}} sx={{color: '#17a2b8'}}>
                                            <QuestionMarkIcon sx={[styles.iconSize]}/>
                                        </IconButton>
                                    </Tooltip>
                                ) : null
                            }
                            {
                                folder_permissions?.delete || user.role === process.env.REACT_APP_SUPER_USER ? (
                                    <Tooltip title={`Delete ${folder.name}`}>
                                        <IconButton onClick={() => { handleDialogOpen('delete') }} sx={{color: '#dc3545'}}>
                                            <DeleteIcon sx={[styles.iconSize]}/>
                                        </IconButton>
                                    </Tooltip>
                                ) : null
                            }
                            {
                                folder_permissions?.permission || user.role === process.env.REACT_APP_SUPER_USER ? (
                                    <Tooltip title={`Change ${folder.name}'s permission`}>
                                        <IconButton sx={{color: '#28a745'}} onClick={() => handleDialogOpen('permission')}>
                                            <LockIcon sx={[styles.iconSize]}/>
                                        </IconButton>
                                    </Tooltip>
                                ) : null
                            }
                            {
                                resource_type === "folder" && (folder_permissions?.upload || user.role === process.env.REACT_APP_SUPER_USER) ? (
                                    <Tooltip title={`Upload file(s) in ${folder.name}`}>
                                        <IconButton onClick={() => handleDialogOpen('upload')} sx={{color: '#007bff'}}>
                                            <UploadIcon sx={[styles.iconSize]}/>
                                        </IconButton>
                                    </Tooltip>
                                ) : null
                            }
                            {
                                folder_permissions?.download || user.role === process.env.REACT_APP_SUPER_USER ? (
                                    <Tooltip title={`Download ${resource_type === "folder" ? `${folder.name} content's` : `${folder.name}`}`}>
                                        <IconButton onClick={() => setConfirmDialog(true)} sx={{color: '#007bff'}}>
                                            <DownloadIcon sx={[styles.iconSize]}/>
                                        </IconButton>
                                    </Tooltip>
                                ) : null
                            }
                        </span>
                    </Slide>
                ) : null
            }
            {
                dialogFlags.add && (
                    <AddFolder folder={folder} open={dialogFlags.add} onClose={handleDialogClose}/>
                )
            }
            {
                dialogFlags.edit && (
                    <EditFolder folder={folder} open={dialogFlags.edit} onClose={handleDialogClose}/>
                )
            }
            {
                dialogFlags.delete && (
                    <DeleteFolder folder={folder} open={dialogFlags.delete} onClose={handleDialogClose}/>
                )
            }
            {
                dialogFlags.upload && (
                    <UploadFile folder={folder} open={dialogFlags.upload} onClose={handleDialogClose}/>
                )
            }
            {
                dialogFlags.info && (
                    <FolderInfo folder={folder} open={dialogFlags.info} onClose={handleDialogClose}/>
                )
            }
            {
                dialogFlags.permission && (
                    <FolderPermission folder={folder} open={dialogFlags.permission} onClose={handleDialogClose}/>
                )
            }
            { 
                confirmDialog && (
                    <ConfirmDialog 
                    icon={<CheckIcon/>}
                    msg={`Are you want to download ${folder.resource_type === 'folder' ? `whole folder: ${folder.name}` : `file: ${folder.name}`} ?`}
                    color={"success"}
                    yesText={"Confirm"}
                    closeConfirmDialog={handleCloseConfirmDialog}
                    open={confirmDialog}/>
                )
            }
        </Fragment>
  )
}

export default FolderMenu