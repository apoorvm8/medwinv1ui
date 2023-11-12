import {Alert, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, LinearProgress, TextareaAutosize, TextField} from '@mui/material'
import React, {useRef, useState} from 'react'
import LoadingButton from './../../shared/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import ConfirmDialog from '../../shared/ConfirmDialog';
import {reset} from '../../../features/folder/folderSlice';
import {collapseFolder, deleteFolder, uploadFiles$} from '../../../features/folder/folderThunk';
import { getChildren } from './../../../features/folder/folderThunk';
import { toast } from 'react-toastify';
import UploadIcon from '@mui/icons-material/Upload';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

function UploadFile({open, onClose, folder}) {
    const dispatch = useDispatch();
    const [errorOpen, setAlertOpen] = useState(false);
    const [severity, setSeverity] = useState('error');
    const [folderMsg, setFolderMsg] = useState('');
    const {isLoading, fileUploadProgress} = useSelector(state => state.folder);
    const [totalFileSize, setTotalFileSize] = useState(0.0);
    const [totalFiles, setTotalFiles] = useState({});
    const [uploadError, setUploadError] = useState(null);
    const [theInputKey, setTheInputKey] = useState(0);
    const [totalFileAdded, setTotalFileAdded] = useState(0);

    let msg = `Upload file in ${folder.name}, total size cannot exceed 100 MB`;

    const calcFileSize = (file, fileLst) => {
        if(file) {
            let fileSize = parseFloat(file.size);
            fileSize = fileSize / Math.pow(1024, 2);

            let tempSize = totalFileSize;

            let newSize = parseFloat(tempSize) + parseFloat(fileSize);

            newSize = parseFloat(newSize).toFixed(1);

            setTotalFileSize(newSize);
        }

        if(fileLst) {
            if(Object.keys(fileLst).length > 0) {
                let sum = 0;
                Object.keys(fileLst).forEach(key => {
                    let fileSize = parseFloat(fileLst[key].size);
                    fileSize = fileSize / Math.pow(1024, 2);
                    sum = parseFloat(sum) + parseFloat(fileSize);
    
                });
                let newSize = parseFloat(sum).toFixed(1);
                setTotalFileSize(newSize);
            } else {
                setTotalFileSize(0.0);
            }
        } 
    } 


    const fileInputChange = (e) => {
        setAlertOpen(false);
        setFolderMsg('')
        setSeverity('success');
        setUploadError(null);

        if(totalFileAdded > 4) {
            setUploadError("Only 5 files can be uploaded at max.");
            return;
        }


       if(Object.keys(totalFiles).length > 0) {
            let duplicateFound = false;
            // Check if the file name matches an already present file
            Object.keys(totalFiles).forEach(key => {
                if(totalFiles[key].name === e.target.files[0].name) {
                   duplicateFound = true;
                }
            });

            if(duplicateFound) {
                setUploadError("File already added in list. Remove it and then add.");
                setTheInputKey(Math.random().toString(36));
                return;
            }

            let lastPos = Object.keys(totalFiles).length;
            let fileToPush = {};
            fileToPush[lastPos] = e.target.files[0];

            setTotalFiles(() => ({
                ...totalFiles,
                ...fileToPush
            }))
            
            calcFileSize(e.target.files[0]);

            let fileAddedNum = totalFileAdded + 1;
            setTotalFileAdded(fileAddedNum);
       } else {
            
            setTotalFiles(e.target.files);
            calcFileSize(e.target.files[0]);

            let fileAddedNum = totalFileAdded + 1;
            setTotalFileAdded(fileAddedNum);
       }
    }

    const uploadFiles = async () => {
        setAlertOpen(false);
        setFolderMsg('')
        setSeverity('success');
        setUploadError(null);
        // Perform some basic validation
        if(totalFiles && Object.keys(totalFiles).length > 0) {
            if(Object.keys(totalFiles).length > 5) {
                setUploadError("Only 5 files can be uploaded at max.");
                return;
            } 

            // Check the total size
            if(totalFileSize > 100) {
                setUploadError("Total files must not exceed 100 MB");
                return;
            }

            // Proceed with the file upload
            try {
                let res = await dispatch(uploadFiles$({id: folder.id, fileLst: totalFiles ? totalFiles : {}})).unwrap();
                setFolderMsg(res.msg)
                await dispatch(collapseFolder(folder.id)).unwrap();
                await dispatch(getChildren({parent_id: folder.id})).unwrap();
                setSeverity('success');
                setAlertOpen(true);
                setTotalFileSize(0.0);
                setTotalFiles({});
                setTotalFileAdded(0);
                setTheInputKey(Math.random().toString(36));
            } catch(error) {
                setUploadError(error);
            }
            dispatch(reset());
        } else {
            setUploadError("Please upload at least one file");
        }
    }

    const closeUploadFileDialog = () => {
        setAlertOpen(false);
        setFolderMsg('')
        setSeverity('success');
        setTotalFileSize(0);
        setTotalFiles(null);
        setUploadError(null);
        onClose('upload');
    }

    const removeFile = (index) => {
        let tempObj = {...totalFiles};
        delete tempObj[index];
        let newSeqObj = {}
        let i = 0;
        
        if(Object.keys(tempObj).length > 0) {
            Object.keys(tempObj).forEach(key => {
                newSeqObj[i++] = tempObj[key]; 
            })
        }

        setTotalFiles(newSeqObj);
        let newFileAdded = totalFileAdded - 1;
        setTotalFileAdded(newFileAdded);
        calcFileSize(null, newSeqObj);
    }

    return (
        <Dialog
        open={open} onClose={() => onClose('upload')} fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                Confirm Action: <b>Upload File in: {folder.name}</b>
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

                {isLoading && (
                    <DialogContentText sx={{ fontWeight:'bold', mb: '1rem', width: '60%'}}>
                        Progress: {fileUploadProgress}%
                    </DialogContentText>
                )}
                
                <DialogContentText sx={{mb: '.5rem'}}>
                    {msg}
                </DialogContentText>
                <DialogContentText sx={{mb: '.5rem'}}>
                    <b>Note:- Maximum 5 files allowed at once.</b>
                </DialogContentText>
                <DialogContentText sx={{mb: '.5rem'}}>
                    Total Size (in MB): <b>{totalFileSize} MB</b>
                </DialogContentText>
                {
                  !isLoading && Object.keys(totalFiles).length > 0 && Object.keys(totalFiles).map((index)  => (
                    <DialogContentText key={index}>
                        Name: {totalFiles[index].name}   
                        <IconButton sx={{color: '#dc3545'}} onClick={() => {removeFile(index)}}> 
                            <RemoveCircleIcon/>
                        </IconButton>
                    </DialogContentText>
                  ))
                }
                <TextField
                    key={theInputKey}
                    onChange={fileInputChange}
                    autoFocus
                    margin="dense"
                    id="name"
                    type="file"
                    variant="standard"
                    InputLabelProps={{required: true}}  
                    error={uploadError && uploadError.length > 0 ? true : false}
                    helperText={uploadError}
                />
            </DialogContent>
            <DialogActions sx={{pb:'1rem'}}>
                <LoadingButton
                    onClick={uploadFiles}
                    size="small"
                    variant="contained"
                    startIcon={<UploadIcon/>}
                    type="submit"
                    text={isLoading ? 'Uploading File...' :  'Upload File'}
                    isLoading={isLoading}
                    >
                </LoadingButton>
                <Button disabled={isLoading} startIcon={<CloseIcon/>} size="small" color="secondary" variant="contained" onClick={closeUploadFileDialog}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default UploadFile