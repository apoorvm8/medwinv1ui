import {Button, Dialog, DialogActions, DialogContent,DialogTitle, TextField, Box, MenuItem, Select, InputLabel, FormControl, FormHelperText, Typography} from '@mui/material'
import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { collapseFolder, editFolder, getChildren } from './../../../features/folder/folderThunk';
import * as yup from 'yup';
import {useFormik} from 'formik';
import LoadingButton from './../../shared/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import {reset} from '../../../features/folder/folderSlice';
import EditIcon from '@mui/icons-material/Edit';
import {toast} from 'react-toastify';

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Folder name is required.')
    .matches(/^[a-zA-Z][a-zA-Z0-9_ ]*$/, 'Folder can only be alphanumeric with underscore'),
  resource_module: yup
    .string()
    .required('Folder module is required.'),
});


function EditFolder({open, onClose, folder}) {
  const dispatch = useDispatch();
  const {isLoading} = useSelector(state => state.folder);
  const [readOnly, setReadOnly] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      resource_module: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (folderData) => {
      try {
        folderData.id = folder.id;
        folderData.depth = folder.depth;
        let res = await dispatch(editFolder(folderData)).unwrap();
        toast.success(res.msg);
        await dispatch(collapseFolder(folder.id)).unwrap();
        await dispatch(getChildren({parent_id: folder.id})).unwrap();
      } catch(error) {
        toast.error(error);
      }
      dispatch(reset());
      onClose('edit');
    }
  });

  useEffect(() => {
    formik.setFieldValue('name', folder.name);
    formik.setFieldValue('resource_module', folder.resource_module);
    if(folder.depth >= 2) {
      // Direct child of root, now module is locked and children will get same module name as parent
      setReadOnly(true);
      formik.setFieldValue('resource_module', folder.resource_module);
    }
    // eslint-disable-next-line
  }, []);


  const closeAddDialog = () => {
    formik.resetForm();
    onClose('edit');
  }

  return (
    <Dialog open={open} onClose={() => onClose('edit')} fullWidth>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogTitle>
          Edit Folder: {folder.name}
          <br/>
          <small style={{fontSize: '.9rem'}}>
            Change this folder's name or module type
          </small>
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{mb: '1.5rem', color: '#d9534f', fontWeight:'bold'}} variant="subtitle2" gutterBottom>
              NOTE:- Changing this folder's module type will change all the files and folders inside module type as well.
          </Typography>
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
        </DialogContent>
        <DialogActions sx={{mt: '.5rem', mb:'.5rem'}}>
          <LoadingButton
            size="small"
            variant="contained"
            startIcon={<EditIcon/>}
            type="submit"
            text={isLoading ? 'Editing Folder...' :  'Edit Folder'}
            isLoading={isLoading}
            >
            </LoadingButton>
          <Button startIcon={<CloseIcon/>} size="small" color="secondary" variant="contained" onClick={closeAddDialog}>Close</Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default EditFolder;