import {Alert, Button, Checkbox, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton} from '@mui/material'
import React, {useState} from 'react'
import LoadingButton from './../../shared/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import ConfirmDialog from '../../shared/ConfirmDialog';
import {reset} from '../../../features/folder/folderSlice';
import {deleteFolder} from '../../../features/folder/folderThunk';
import { toast } from 'react-toastify';


function DeleteFolder({open, onClose, folder, folders = null}) {
  const dispatch = useDispatch();
  const [errorOpen, setAlertOpen] = useState(false);
  const [severity, setSeverity] = useState('error');
  const [folderMsg, setFolderMsg] = useState('');
  const {isLoading} = useSelector(state => state.folder);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [shouldDeleteFolder, setShouldDeleteFolder] = useState(false);

  // The folder browser can also pass several picked items to delete in one go.
  const items = folders || [folder];
  const kind = items.length > 1 ? 'Items' : items[0].resource_type === 'folder' ? 'Folder' : 'File';
  const hasFolders = items.some(item => item.resource_type === 'folder');

  let msg = kind === 'Items' ? `Are you sure you want to delete these ${items.length} items ?${hasFolders ? ' Folders will lose everything inside them as well' : ''}` :
  kind === 'Folder' ? 'Are you sure you want to delete this folder ? This will remove everything inside it as well' :
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
            let res;
            for(const item of items) {
                res = await dispatch(deleteFolder({id: item.id, shouldDeleteFolder})).unwrap();
            }
            toast.dismiss();
            toast.success(kind === 'Items' ? `${items.length} items deleted successfully.` : res.msg);
            onClose('delete');
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
                Confirm Action: <b style={{textDecoration:'underline'}}>Delete {kind === 'Items' ? `${items.length} items` : `${kind.toLowerCase()}: ${items[0].name}`}</b>
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
                    hasFolders && (
                        <DialogContentText>
                            <FormControlLabel control={<Checkbox checked={!shouldDeleteFolder} onChange={() => setShouldDeleteFolder(!shouldDeleteFolder)}/>} label={kind === 'Items' ? "Don't delete the folders, only what is inside them." : "Don't delete the folder."} />
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
                    text={isLoading ? `Deleting ${kind}` :  `Delete ${kind}`}
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