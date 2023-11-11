import React from 'react'
import {Navigate, Outlet} from 'react-router-dom';
import { useAuthStatus } from './../../hooks/useAuthStatus';
import Spinner from './Spinner';

const GuestRoute = () => {
  const {loggedIn, checkingStatus} = useAuthStatus();

  if(checkingStatus) {
    return <Spinner/>; // or loading spinner
  }
  return loggedIn ? <Navigate to="/admin"/> : <Outlet/>
}

export default GuestRoute