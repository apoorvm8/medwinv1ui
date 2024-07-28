import { authInstance } from './../../interceptor/auth-interceptor';

let baseAPI = 'customers';
// Get the customers from the API
const getCustomerMessages$ = async (data) => {
    let response = await authInstance.get(`/${baseAPI}/messages`, {params: {
        page: data.page,
        pageSize: data.pageSize,
        quickFilter: data.quickFilter,
        dateFilter: data.dateFilter,
        status: data.status,
        sortOrder: data.sortOrder,
    }});
    return response.data;
}

const markSelectedMessages = async (data) => {
    let response = await authInstance.post(`/${baseAPI}/messages`, {
        actionType: data.actionType,
        idsStr: data.idsStr,
        _method: 'PUT'
    });
    return response.data;
}

const messageService = {
    getCustomerMessages$,
    markSelectedMessages,
}

export default messageService;
