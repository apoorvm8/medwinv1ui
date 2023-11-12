import React from 'react'
import { Backdrop, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

function Spinner({storeName = "auth"}) {
  const {isLoading} = useSelector(state => {
    if(storeName === "auth") {
      return state.auth;
    } else if(storeName === "folder") {
      return state.folder;
    }
  });
  return (
    <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={isLoading}
    >
        <CircularProgress color="inherit" />
    </Backdrop>
  )
}

export default Spinner