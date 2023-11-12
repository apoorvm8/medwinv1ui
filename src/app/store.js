import { combineReducers, configureStore } from '@reduxjs/toolkit';
import folderReducer from '../features/folder/folderSlice';
import authReducer from '../features/auth/authSlice';
import customerReducer from '../features/customer/customerSlice';

const combinedReducer = combineReducers({
  folder: folderReducer,
  auth: authReducer,
  customer: customerReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout/fulfilled') { // check for action type 
    state = undefined;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer
});
