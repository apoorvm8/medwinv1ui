import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Get user from localstorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    logoutLoader: false
}


// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        return await authService.login(user);
    } catch (error) {
        let message = null;

        if(error.code === "ERR_NETWORK") {
            message = 'Server error, please contact admin';
            return thunkAPI.rejectWithValue(message);
        }

        if(error.response.data.data && error.response.data.data.errors) {
            message = error.response.data.data.errors;
        } else {
            message= error.response.data.msg;
        }
        
        return thunkAPI.rejectWithValue(message);
    }
})

// Logout user
export const logout = createAsyncThunk('auth/logout', async (thunkAPI) => {
    try {
        return await authService.logout();
    } catch(error) {
        let message = null;

        if(error.code === "ERR_NETWORK") {
            message = 'Server error, please contact admin';
            return thunkAPI.rejectWithValue(message);
        }

        if(error.response.status === 401) {
            message = error.response.data.message;
            return thunkAPI.rejectWithValue(message);
        }

        if(error.response.data.data && error.response.data.data.errors) {
            message = error.response.data.data.errors;
        } else {
            message= error.response.data.msg;
        }

        
        return thunkAPI.rejectWithValue(message);
    }
});

export const checkUserToken = createAsyncThunk('auth/checkusertoken', async (thunkAPI) => {
    try {
        return await authService.checkUserToken();
    } catch(error) {
        let message = null;

        if(error.code === "ERR_NETWORK") {
            message = 'Server error, please contact admin';
            return thunkAPI.rejectWithValue(message);
        }

        if(error.response.status === 401) {
            message = error.response.data.message;
            return thunkAPI.rejectWithValue(message);
        }

        if(error.response.data.data && error.response.data.data.errors) {
            message = error.response.data.data.errors;
        } else {
            message= error.response.data.msg;
        }

        
        return thunkAPI.rejectWithValue(message);
    }
});

export const refreshUserRole = createAsyncThunk('auth/createUserRole', async (data, thunkAPI) => {
   let user = JSON.parse(localStorage.getItem('user'));
   if(user) {
    user.role = data.role;
    user.permissions = data.permissions;
    localStorage.setItem('user', JSON.stringify(user));
   }
   return data;
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.msg;
            state.user = action.payload.data.user;
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(logout.pending, (state) => {
            state.isLoading = true;
            state.logoutLoader = true;
        })
        .addCase(logout.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.msg;
            state.user = null;
            state.logoutLoader = false;
        })
        .addCase(logout.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isError = true;
            state.message = action.payload;
            state.logoutLoader = false;
        })
        .addCase(checkUserToken.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(checkUserToken.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        .addCase(checkUserToken.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isError = false;
            state.message = action.payload;
        })
        .addCase(refreshUserRole.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(refreshUserRole.fulfilled, (state, action) => {
            let role = action.payload.role;
            let permissions = action.payload.permissions;
            state.user = {...state.user, role, permissions};
            state.isLoading = false;
        })
        .addCase(refreshUserRole.rejected, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isError = false;
            state.message = action.payload;
        })
    }
})

export const {reset}  = authSlice.actions;
export default authSlice.reducer