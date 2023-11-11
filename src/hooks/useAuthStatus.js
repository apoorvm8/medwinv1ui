import { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserToken, refreshUserRole, reset } from './../features/auth/authSlice';
import { useLocation } from 'react-router-dom';

export const useAuthStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const location = useLocation();
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.auth);
    const [triggerEffect, setTriggerEffect] = useState(0);

    useEffect(() => {
        const authCheck = async () => {
            setCheckingStatus(true);
            try {
                let response = await dispatch(checkUserToken()).unwrap();
                await dispatch(refreshUserRole({role: response.data.role, permissions: response.data.permissions})).unwrap();
                setLoggedIn(true);
            } catch (error) {   
                setLoggedIn(false);
            } finally {
                setCheckingStatus(false);
            }
        }
        
        if(user) {
            authCheck();
        } else {
            setLoggedIn(false);
            setCheckingStatus(false);
        }
        //eslint-disable-next-line
    }, [location.pathname, triggerEffect]);

    return {loggedIn, checkingStatus, setCheckingStatus, setTriggerEffect};
}


