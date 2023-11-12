import {Alert, Button, Checkbox, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton} from '@mui/material'
import React, {useState} from 'react'
import LoadingButton from './../../shared/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import ConfirmDialog from '../../shared/ConfirmDialog';
import {reset} from '../../../features/folder/folderSlice';
import {collapseFolder, deleteFolder} from '../../../features/folder/folderThunk';
import { getChildren } from './../../../features/folder/folderThunk';
import { toast } from 'react-toastify';


function DeleteFolder({open, onClose, folder}) {
  const dispatch = useDispatch();
  const [errorOpen, setAlertOpen] = useState(false);
  const [severity, setSeverity] = useState('error');
  const [folderMsg, setFolderMsg] = useState('');
  const {isLoading} = useSelector(state => state.folder);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [shouldDeleteFolder, setShouldDeleteFolder] = useState(false);

  let msg = folder.resource_type === 'folder' ? 'Are you sure you want to delete this folder ? This will remove everything inside it as well' :
  'Are you sure you want to remove this file ?';

  const closeDeleteDialog = () => {
    setAlertOpen(false);
    setFolderMsg('');
    onClose('delete');
  }

  const handleCloseConfirmDialog = async (confirm) => {
    // Dispatch delete function
    setConfirmDialog(false);
    
    if(confirm) {
        try {
            let res = await dispatch(deleteFolder({id: folder.id, shouldDeleteFolder})).unwrap();
            await dispatch(collapseFolder(folder.parent_id)).unwrap();
            await dispatch(getChildren({parent_id: folder.parent_id})).unwrap();
            toast.dismiss();
            toast.success(res.msg);
        } catch(error) {
            setFolderMsg(error);
            setSeverity('error');
            setAlertOpen(true);
        }
        dispatch(reset());
    }
    
  }

  const deleteAction = () => {
    setConfirmDialog(true);
  }

  return (
    <React.Fragment>
        <Dialog
            open={open} onClose={() => onClose('delete')} fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                Confirm Action: <b style={{textDecoration:'underline'}}>Delete {folder.resource_type === 'folder' ? 'folder:' : 'file:'} {folder.name}</b>
            </DialogTitle>
            <DialogContent dividers>
                <Collapse in={errorOpen}>
                    <Alert 
                    action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                        setAlertOpen(false);
                        }}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                    }
                    sx={{my: '.5rem'}} severity={severity}>
                    {folderMsg}
                    </Alert>
                </Collapse>
                <DialogContentText>
                    {msg}
                </DialogContentText>
                {
                    folder.resource_type === "folder" && (
                        <DialogContentText>
                            <FormControlLabel control={<Checkbox checked={!shouldDeleteFolder} onChange={() => setShouldDeleteFolder(!shouldDeleteFolder)}/>} label="Don't delete the folder." />
                        </DialogContentText>
                    )
                }
            </DialogContent>
            <DialogActions sx={{pb:'1rem'}}>
                <LoadingButton
                    onClick={deleteAction}
                    size="small"
                    variant="contained"
                    startIcon={<DeleteIcon/>}
                    type="submit"
                    text={isLoading ? `Deleting ${folder.resource_type === 'folder' ? 'Folder' : 'File' }` 
                    :  `Delete ${folder.resource_type === 'folder' ? 'Folder' : 'File' }`}
                    isLoading={isLoading}
                    >
                </LoadingButton>
                <Button startIcon={<CloseIcon/>} size="small" color="secondary" variant="contained" onClick={closeDeleteDialog}>Close</Button>
            </DialogActions>
        </Dialog>
        {confirmDialog && 
            (
                <ConfirmDialog 
                    icon={<CheckIcon/>}
                    msg={"This action will be permanent, are you sure ?"}
                    color={"error"}
                    yesText={"Confirm"}
                    closeConfirmDialog={handleCloseConfirmDialog}
                    open={confirmDialog}
                />
            )
        }
    </React.Fragment>
  )
}

export default DeleteFolder