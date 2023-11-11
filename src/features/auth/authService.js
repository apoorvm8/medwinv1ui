import { authInstance, guestInstance } from '../../interceptor/auth-interceptor';


// login User
const login = async (userData) => {
    const response = await guestInstance.post('auth/login', userData);

    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('token', response.data.data.token);
    }

    return response.data;
}

const logout = async () => {
    const response = await authInstance.post('auth/logout', {});
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return response.data;
}

const checkUserToken = async () => {
    const response = await authInstance.post('auth/checkusertoken', {});
    return response.data;
}

const authService = {
    logout,
    login,
    checkUserToken
}

export default authService;