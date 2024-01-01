import React, {useEffect, useState} from 'react'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment/moment';
import {reset} from '../../../features/folder/folderSlice';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-toastify';
import {getFolderInfo$} from '../../../features/folder/folderThunk';


function FolderInfo({open, onClose, folder}) {
    const dispatch = useDispatch();
    const [folderObj, setFolderObj] = useState(null);
    const {user} = useSelector(state => state.auth);
    const superUser = process.env.REACT_APP_SUPER_USER;

    useEffect(() => {
        // Make api hit here just to fetch root
        const getFolderInfo =  async () => {
            try {
                let response = await dispatch(getFolderInfo$({id: folder.id})).unwrap();
                let result = response.data.folder;
                // Calculate size
                result.file_size = niceBytes(result.file_size);
                setFolderObj(result);
          } catch(error) {
            toast.dismiss();
            toast.error(error);
        }
          dispatch(reset());
        }
    
        getFolderInfo();
        // eslint-disable-next-line
      }, []);

    const niceBytes = (x) => {
        const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let l = 0, n = parseInt(x, 10) || 0;
      
        while(n >= 1024 && ++l){
            n = n/1024;
        }
        
        return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
    }
    return (
        <Dialog
            open={open} onClose={() => onClose('info')} fullWidth maxWidth='md'
        >
            <DialogTitle>
                {folderObj && folderObj.name} - Properties {user?.role === superUser ? `(Resource Id: ${folderObj && folderObj.deid})` : ''}
            </DialogTitle>
            <DialogContent>
                {folderObj ? (
                    <React.Fragment>
                        <Grid container>
                            <Grid item md={6}>
                                <b>Name:</b> {folderObj.name}
                            </Grid>
                            <Grid item md={4}>
                                <b>Size:</b> {folderObj.file_size}
                            </Grid>
                            <Grid item md={2}>
                                <b>Type</b> {folderObj.resource_type}
                            </Grid>
                        </Grid>
                        <Grid container sx={{mt: '1rem'}}>
                            <Grid item md={6}>
                                <b>Created At:</b> {folderObj.created_at} 
                            </Grid>
                            <Grid item md={6}>
                                <b>Last Updated:</b> {folderObj.updated_at}
                            </Grid>
                        </Grid>
                        <Grid container sx={{mt: '1rem'}}>
                            <Grid item md={6}>
                                <b>Created By:</b> {folderObj.created_by}
                            </Grid>
                            <Grid item md={6}>
                                <b>Updated By:</b> {folderObj.updated_by}
                            </Grid>
                        </Grid>
                        <Grid container sx={{mt: '1rem'}}>
                            {
                                folderObj.resource_type === "folder" && folderObj.children_count && (
                                    <Grid item md={6}>
                                        <b>Total:</b> {JSON.parse(folderObj.children_count).folders} Folders & {JSON.parse(folderObj.children_count).files} Files
                                    </Grid>
                                )
                            }
                            <Grid item md={6}>
                                <b>Times Downloaded:</b> {folderObj.times_downloaded} 
                            </Grid>
                        </Grid>
                        <Grid container sx={{mt: '1rem'}}>
                            <Grid item md={6}>
                                <b>Last Downloaded:</b> {folderObj.last_downloaded_at}
                            </Grid>
                            <Grid item md={6}>
                                <b>Resource Module:</b> {folderObj.resource_module} 
                            </Grid>
                        </Grid>
                        <Grid container sx={{mt: '1rem'}}>
                            <Grid item md={12}>
                                <b>Path:</b> {folderObj.path}
                            </Grid>
                        </Grid>
                    </React.Fragment>
                ) : (
                    <DialogContentText>
                        Fetching Folder Information... Please wait.
                    </DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <Button startIcon={<CloseIcon/>} size="small" color="secondary" variant="contained" onClick={() => onClose('info')}>Close</Button>
            </DialogActions>
        </Dialog>
  )
}
export default FolderInfo