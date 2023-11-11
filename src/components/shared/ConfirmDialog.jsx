import {Alert, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton} from '@mui/material'
import React, {useState} from 'react'
import CloseIcon from '@mui/icons-material/Close';


function ConfirmDialog({open, closeConfirmDialog, msg, color, icon, yesText, noText, titleText, confirmData = null}) {
  return (
    <Dialog
        open={open} onClick={() => closeConfirmDialog(false)}
        fullWidth maxWidth='xs'
    >
        <DialogTitle id="alert-dialog-title">
          {titleText}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {msg}
            </DialogContentText>
        </DialogContent>
        <DialogActions sx={{pb:'1rem'}}>
          <Button
            onClick={() => closeConfirmDialog(confirmData ? confirmData : true)}
            color={color}
            size="small"
            variant="contained"
            startIcon={icon}
            type="submit"
            >
                {yesText}
            </Button>
          <Button startIcon={<CloseIcon/>} size="small" color="secondary" variant="contained" onClick={() => closeConfirmDialog(false)}>{noText}</Button>
        </DialogActions>
    </Dialog>
  )
}

ConfirmDialog.defaultProps = {
    yesText: 'Ok',
    noText: 'Cancel',
    msg: 'Please confirm your action',
    color: 'success',
    titleText: "Confirm Action"
}

export default ConfirmDialog