import React from 'react'
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle, Button } from '@mui/material';
import  CloseIcon  from '@mui/icons-material/Close';

const InfoDialog = ({open, closeInfoDialog, msg, title, okText}) => {
  return (
    <Dialog
        open={open} onClick={() => closeInfoDialog()}
        fullWidth maxWidth='xs'
    >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {msg}
            </DialogContentText>
        </DialogContent>
        <DialogActions sx={{pb:'1rem'}}>
          <Button startIcon={<CloseIcon/>} size="small" color="secondary" variant="contained" onClick={() => closeInfoDialog()}>{okText}</Button>
        </DialogActions>
    </Dialog>
  )
}

InfoDialog.defaultProps = {
    open: PropTypes.bool,
    closeInfoDialog: PropTypes.func,
    msg: PropTypes.string,
    title: PropTypes.string,
    okText: PropTypes.string,
}

export default InfoDialog