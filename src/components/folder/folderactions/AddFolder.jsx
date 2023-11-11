import {Paper,Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box, MenuItem, Select, InputLabel, FormControl, FormHelperText, Alert, Collapse, IconButton} from '@mui/material'
import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { collapseFolder, createFolder, getChildren } from './../../../features/folder/folderThunk';
import * as yup from 'yup';
import {useFormik} from 'formik';
import LoadingButton from './../../shared/LoadingButton';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CloseIcon from '@mui/icons-material/Close';
import {reset} from '../../../features/folder/folderSlice';
import FolderPermission from './FolderPermission';
import LockIcon from '@mui/icons-material/Lock';
import { toast } from 'react-toastify';
import Draggable from 'react-draggable';

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Folder name is required.'),
  resource_module: yup
    .string()
    .required('Folder module is required.'),
});


function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function AddFolder({open, onClose, folder, fromSource = null, emitCreateRes = null}) {
  const dispatch = useDispatch();
  const [permissionOpen, setPermissionOpen] = useState(false);
  const {isLoading} = useSelector(state => state.folder);
  let [permissionRows, setPermissionRows] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      name: '',
      resource_module: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (folderData) => {
      try {
        toast.dismiss();
        folderData.parent_id = folder.id;
        folderData.permissionRows = permissionRows;
        folderData.fromSource = fromSource;
        let res = await dispatch(createFolder(folderData)).unwrap();
        if(!fromSource) {
          await dispatch(collapseFolder(folder.id)).unwrap();
          await dispatch(getChildren({parent_id: folder.id})).unwrap();
        }
        toast.success(res.msg);
        if(emitCreateRes) {
          emitCreateRes({type: 'success'});
        }
      } catch(error) {
        if(emitCreateRes) {
          emitCreateRes({type: 'error'});
        }
        console.log(error);
        toast.error(error);
      }
      dispatch(reset());
      setPermissionRows(null);
      onClose('add');
    }
  });

  useEffect(() => {
    if(fromSource && fromSource.sourceName === 'customermaster') {
      setReadOnly(true);
      formik.setFieldValue('resource_module', 'backup');
      if(fromSource.data && fromSource.data.actionType && fromSource.data.actionType === 'adminFolderActionStock') {
        formik.setFieldValue('resource_module', 'stock');
      }
      
      formik.setFieldValue('name', fromSource.data.customerName);
    } else {
      if(folder.depth >= 1) {
        // Direct child of root, now module is locked and children will get same module name as parent
        setReadOnly(true);
        formik.setFieldValue('resource_module', folder.resource_module);
      }
    }
    
    //eslint-disable-next-line 
  }, []); 

  const closeAddDialog = () => {
    formik.resetForm();
    onClose('add');
  }

  const handleDialogClose = () => {
    setPermissionOpen(false);
  };

  const handleIncomingPermissions = (rows) => {
    if(rows) {
      setPermissionRows([...rows]);
    } else {
      setPermissionRows(null);
    }
  }

  return (
    <React.Fragment>
      <Dialog PaperComponent={PaperComponent} open={open} onClose={() => onClose('add')} 
      aria-labelledby="draggable-dialog-title"
      fullWidth>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <DialogTitle style={{ cursor: 'move' }}>Create Folder in: {folder.name}</DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              Create a folder inside this folder. (*) denotes required.
            </DialogContentText>
            <TextField
              fullWidth
              autoFocus
              margin="dense"
              id="name"
              label="Enter folder name"
              type="text"
              variant="standard"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              InputLabelProps={{required: true}}  
            />
            <FormControl error={formik.touched.resource_module && Boolean(formik.errors.resource_module)} sx={{mt: '.5rem', mb: '1.5rem'}} variant='standard' fullWidth>
              <InputLabel id="resource_module_label">Enter module name *</InputLabel>
              <Select
                labelId="resource_module_label"
                label="Enter module name *"
                id="resource_module"
                value={formik.values.resource_module}
                readOnly={readOnly}
                onChange={(e) => formik.setFieldValue('resource_module', e.target.value)}
              >
                <MenuItem value={"software"}>Software</MenuItem>
                <MenuItem value={"backup"}>Backup</MenuItem>
                <MenuItem value={"stock"}>Stock</MenuItem>
              </Select>
              <FormHelperText error={true}>{formik.touched.resource_module && formik.errors.resource_module}</FormHelperText>
            </FormControl>
            <DialogContentText>
              <small>Set Folder Permission
                <IconButton onClick={() => setPermissionOpen(true)}>
                  <LockIcon/>
                </IconButton>
              </small>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{mt: '.5rem', mb:'.5rem'}}>
            <LoadingButton
              size="small"
              variant="contained"
              startIcon={<CreateNewFolderIcon/>}
              type="submit"
              text={isLoading ? 'Creating Folder...' :  'Create Folder'}
              isLoading={isLoading}
              >
              </LoadingButton>
            <Button startIcon={<CloseIcon/>} size="small" color="secondary" variant="contained" onClick={closeAddDialog}>Close</Button>
          </DialogActions>
        </Box>
      </Dialog>
      {
        permissionOpen && <FolderPermission emitPermissionsToParent={handleIncomingPermissions} folder={folder} open={permissionOpen} onClose={handleDialogClose} fromParent={true}
        permissionRows={permissionRows} fromAdd={true}/>
      }
    </React.Fragment>

  )
}

export default AddFolder