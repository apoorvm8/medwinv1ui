
import { authInstance } from './../../interceptor/auth-interceptor';

let baseAPI = 'customers';
// Get the customers from the API
const getCustomers$ = async (data) => {
    let response = await authInstance.get(`/${baseAPI}`, {params: {
        page: data.page,
        pageSize: data.pageSize,
        quickFilter: data.quickFilter,
        sortOrder: data.sortOrder,
    }});
    return response.data;
}

const customerAction$ = async(data) => {
    let response = await authInstance.put(`/${baseAPI}/update-action/${data.acctno}`, {
        actionType: data.actionType,
        sourceId: data.sourceId ? data.sourceId : null,
        _method: 'PUT'
    });

    return response.data;
}

const getCustomerBackupParentFolder = async(data) => {
    let response = await authInstance.get(`/folders?filters=${JSON.stringify(data)}`);
    return response.data;
}

// Get the customers from the API
const getCustomerEinvoices$ = async (data) => {
    let response = await authInstance.get(`/${baseAPI}/e-invoices`, {params: {
        page: data.page,
        pageSize: data.pageSize,
        quickFilter: data.quickFilter,
        status: data.status,
        sortOrder: data.sortOrder,
    }});
    return response.data;
}

// Get the customers from the API
const getCustomerStockAccess$ = async (data) => {
    let response = await authInstance.get(`/${baseAPI}/stock-access`, {params: {
        page: data.page,
        pageSize: data.pageSize,
        quickFilter: data.quickFilter,
        status: data.status
    }});
    return response.data;
}

const getCustomerBackupAccess$ = async (data) => {
    let response = await authInstance.get(`/${baseAPI}/backup-access`, {params: {
        page: data.page,
        pageSize: data.pageSize,
        quickFilter: data.quickFilter,
        status: data.status
    }});
    return response.data;
}

const getCustomerRegisters$ = async (data) => {
    let response = await authInstance.get(`/${baseAPI}/customer-registers`, {params: {
        page: data.page,
        pageSize: data.pageSize,
        quickFilter: data.quickFilter,
        status: data.status
    }});
    return response.data;
}

const bulkDeleteCustomerRegisters = async (data) => {
    let response = await authInstance.post(`/${baseAPI}/customer-registers/bulk-delete`, {
        actionType: data.actionType,
        idsStr: data.idsStr,
        _method: 'DELETE'
    });
    return response.data;
}

// Get the customers from the API
const getCustomerWhatsapps$ = async (data) => {
    let response = await authInstance.get(`/${baseAPI}/customer-whatsapps`, {params: {
        page: data.page,
        pageSize: data.pageSize,
        quickFilter: data.quickFilter,
        status: data.status
    }});
    return response.data;
}

const getCustomerDashboardDetails$ = async() => {
    let response = await authInstance.get(`/${baseAPI}/customer-dashboard-details`);
    return response.data;
}

const customerService = {
    getCustomers$,
    customerAction$,
    getCustomerBackupParentFolder,
    getCustomerEinvoices$,
    getCustomerStockAccess$,
    getCustomerBackupAccess$,
    getCustomerRegisters$,
    bulkDeleteCustomerRegisters,
    getCustomerWhatsapps$,
    getCustomerDashboardDetails$
}

export default customerService;