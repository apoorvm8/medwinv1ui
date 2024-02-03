import React, {useEffect, useState} from 'react'
import {Button, Dialog, DialogActions, DialogContent,DialogTitle, TextField, Box, Paper} from '@mui/material'
import * as yup from 'yup';
import {useFormik} from 'formik';
import LoadingButton from './../../shared/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import {toast} from 'react-toastify';
import {authInstance} from '../../../interceptor/auth-interceptor';
import Draggable from 'react-draggable';

const validationSchema = yup.object({
  password: yup
    .string()
    .required('Password is required.')
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


const SetCustomerPassword = ({icon, open, closePasswordDialog, customer}) => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (customerData) => {
      toast.dismiss();
      try {
        setIsLoading(true);
        customerData['_method'] = 'PUT';
        let response = await authInstance.post(`/customers/update-password/${customer.acctno}`, customerData);
        let res = response.data;
        toast.success(res.msg);
        closePasswordDialog(true);
      } catch(error) {
        toast.error(error.response.data.message);
        closePasswordDialog(false);
      }
    }
  });

  useEffect(() => {
    // eslint-disable-next-line
  }, []);


  const closeDialog = () => {
    formik.resetForm();
    closePasswordDialog(false);
  }

  return (
    <Dialog PaperComponent={PaperComponent} open={open} onClose={() => closePasswordDialog(false)}
     aria-labelledby="draggable-dialog-title"  fullWidth>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogTitle>
          Update Password For: {customer.subdesc}  
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            sx={{mt: '-1rem'}}
            fullWidth
            autoFocus
            margin="dense"
            id="password"
            label="Update Password"
            type="password"
            variant="standard"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputLabelProps={{required: true}}  
          />
        </DialogContent>
        <DialogActions sx={{mt: '.5rem', mb:'.5rem'}}>
          <LoadingButton
            size="small"
            variant="contained"
            startIcon={icon}
            type="submit"
            text={isLoading ? 'Updating password...' :  'Update Password'}
            isLoading={isLoading}
            >
            </LoadingButton>
          <Button disabled={isLoading} startIcon={<CloseIcon/>} size="small" color="secondary" variant="contained" onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default SetCustomerPassword;