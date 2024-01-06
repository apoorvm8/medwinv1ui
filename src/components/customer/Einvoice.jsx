import React, {Fragment, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {reset} from '../../features/customer/customerSlice';
import {customerAction$, getCustomerEinvoices$} from '../../features/customer/customerThunk';
import { DataGrid} 
from '@mui/x-data-grid';
import { Tooltip, IconButton, CardHeader, Card, CardContent } from '@mui/material';
import ExplicitIcon from '@mui/icons-material/Explicit';
import {toast} from 'react-toastify';
import ConfirmDialog from '../shared/ConfirmDialog';
import CheckIcon from '@mui/icons-material/Check';
import {styles, CustomToolbar} from './../shared/CustomToolbar';
import DeleteIcon  from '@mui/icons-material/Delete';

const Einvoice = () => {
    const {isLoading} = useSelector(state => state.customer);
    const {user} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [stateRows, setStateRows] = useState([])
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);
    const [status, setStatus] = useState({value: -1, text: 'All'});
    const [quickFilter, setQuickFilter] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [triggerEffect, setTriggerEffect] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [confirmData, setConfirmData] = useState(null);
    const [confirmMsg, setConfirmMsg] = useState("");
    const [sortOrder, setSortOrder] = useState({field: 'acctno', sort: 'desc'})
    const [tableInfoObj, setTableInfoObj] = useState({per_page: 0, total: 0, to:0, from:0});

    const statuses = [
      {value: -1, text: "All"},
      {value: 1, text: "Active"},
      {value: 0, text: "Inactive"},
    ]
    const superUser = process.env.REACT_APP_SUPER_USER;

    useEffect(() => {
      // Make api hit here just to fetch root
      const getCustomerEinvoices =  async () => {
          let response = await dispatch(getCustomerEinvoices$({
            page: page+1,
            pageSize: pageSize,
            quickFilter: quickFilter,
            status: JSON.stringify(status),
            sortOrder: JSON.stringify(sortOrder),
          })).unwrap();
          
          setStateRows(response.data.einvoices.data);
          setPageCount((prevRowCountState) =>
            response.data.einvoices.last_page !== undefined
              ? response.data.einvoices.last_page
              : prevRowCountState,
          );
          setTotalRecords(response.data.einvoices.total);
          setTableInfoObj({
            per_page: response.data.einvoices.per_page,
            total: response.data.einvoices.total,
            to: response.data.einvoices.to,
            from: response.data.einvoices.from
          });
          dispatch(reset());
      }
  
      getCustomerEinvoices();
      // eslint-disable-next-line
    }, [page, pageSize, quickFilter, triggerEffect, status, sortOrder]);

    const updateGrid = (data) => {
      if(data.type === 'page') {
        setPage(data.value - 1);
      }
  
      if(data.type === 'pagesize') {
        const pageFirstItemIndex = pageSize * (page) + 1;
        const newPage = Math.ceil(pageFirstItemIndex / data.value);
        setPageSize(data.value);
        setPage(newPage - 1);
      }
    }

    const customerAction = async (actionType, row) => {
      setConfirmMsg("");
      setConfirmData(null);
      if(actionType === "einvoice") {
        setConfirmMsg(`${row.active ? 'Disable' : 'Enable'} E-invoice for account ${row.acctno} ?`);
        setConfirmDialog(true);
      }
      
      if(actionType === 'einvoicedelete') {
        setConfirmMsg(`Delete E-invoice for account ${row.acctno} ?`);
        setConfirmDialog(true);  
      }
  
      setConfirmData({
        actionType: actionType,
        row: row
      })
    }

    const handleCloseConfirmDialog = async (confirmData) => {
      // Dispatch delete function
      setConfirmDialog(false);
      if(typeof confirmData === 'object') {
        toast.dismiss();
        try {
          const response = await dispatch(customerAction$({
            actionType: confirmData.actionType,
            acctno: confirmData.row.acctno,
            sourceId: confirmData.row.id
          })).unwrap();
          toast.success(response.msg);
          setTriggerEffect(Math.random().toString(36)); // We want to run useeffect to reload the datatable
          setConfirmData(null);
          setConfirmMsg("");
        } catch(error) {
          toast.error(error);
          setConfirmData(null);
          setConfirmMsg("");
        }
        dispatch(reset());
      } else {
        setConfirmData(null);
        setConfirmMsg("");
      }
    }

    const refreshGrid = () => {
      setTriggerEffect(Math.random().toString(36)); // We want to run useeffect to reload the datatable
    }

    const onStatusChange = (newStatus) => {
      setStatus({
        ...status,
        ...newStatus
      })
    }

    const onFilterChange = (e) => {
      setQuickFilter(e.quickFilterValues.join(' '));
      setPage(0);
    }  

    const onSortChange = (e) => {
      setSortOrder(e[0]);
      setPage(0);
    }
    
  const columns = [
    {
      field: 'sno' , 
      filterable: false,
      sortable: false,
      headerName: 'S.NO',
      renderCell: (index) => (pageSize * page) + index.api.getRowIndex(index.row.id) + 1,
      width: 55,
      renderHeader: () => <strong>S.No</strong>
    },
    {
      field: 'action',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      cellClassName: 'wrap-text',
      headerName: 'Action',
      renderHeader: () => <strong>Actions</strong>,
      renderCell: (params) => {
        let eInvoiceStatus = params.row.active;
        return (
          <Fragment>
            {
              user?.role === superUser || user?.permissions.includes('customer_master_einvoice') ?
              (
                <Tooltip title={`${eInvoiceStatus ? 'Disable' : 'Enable'} E-Invoice for ${params.row.acctno}`}>
                  <IconButton sx={{color: eInvoiceStatus ? '#28a745' : '#dc3545'}} onClick={() => customerAction('einvoice', params.row)}>
                      <ExplicitIcon/>
                  </IconButton>
                </Tooltip>
              ) : null
            }
          </Fragment>
        )
      }
    },
    {
      field: 'acctno',
      width: 80,
      sortOrder: ['asc', 'desc'],
      headerName: 'C_ID',
      renderHeader: () => <strong>C_ID</strong>
    },
    { 
      field: 'subdesc', headerName: 'Name', width: 250,
      sortingOrder: ['desc', 'asc'],
      cellClassName: 'wrap-text cell-font-size',
      renderHeader: () => <strong>Name</strong>
    },
    { 
      field: 'install_date', width: 120,
      cellClassName: 'cell-bold',
      sortOrder: ['desc', 'asc'],
      headerName: 'Install Dt',
      renderHeader: () => <strong>Install DT</strong>
    },
    { 
      field: 'next_amc_date', width: 120,
      cellClassName: 'cell-bold',
      sortOrder: ['desc', 'asc'],
      headerName: 'AMC DT',
      renderHeader: () => <strong>AMC DT</strong>
    },
    { 
      field: 'remarks', width: 250,
      cellClassName: 'wrap-text cell-font-size cell-bold',
      sortable:false,
      headerName: 'Remarks',
      renderHeader: () => <strong>Remarks</strong>
    },
    { 
      field: 'gstno', headerName: 'GST', width: 120,
      cellClassName: 'wrap-text cell-font-size',
      renderHeader: () => <strong>GST</strong>
    },
    { 
      field: 'created_at', width: 200, cellClassName: 'cell-bold',
      sortOrder: ['desc', 'asc'],
      headerName: 'Created On',
      renderHeader: () => <strong>Created On</strong>
    },
  ];

  if(user && user.role === process.env.REACT_APP_SUPER_USER) {
    columns.splice(1, 0, {
      field: 'admin_action',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      cellClassName: 'wrap-text',
      headerName: 'Admin Action',
      renderHeader: () => <strong>Admin</strong>,
      renderCell: (params) => {
        return (
          <Tooltip title={`Delete E-Invoice for ${params.row.acctno}`}>
          <IconButton sx={{color: '#dc3545'}} onClick={() => customerAction('einvoicedelete', params.row)}>
              <DeleteIcon/>
          </IconButton>
        </Tooltip>
        )
      }
    })
  }

  if(!user) {
    return null;
  }
  return (
    <Fragment>
      <Card>
        <CardHeader title='E-Invoice'></CardHeader>
        <CardContent>
            <DataGrid
            sx={[styles.wrapText, styles.cellFontSize, styles.cellBold, styles.headerBold]}
            rows={stateRows}
            rowCount={totalRecords}
            loading={isLoading}
            columns={columns}
            autoHeight={true}
            page={page}
            pageSize={pageSize}
            hideFooterSelectedRowCount
            density='comfortable'
            paginationMode="server"
            sortingMode="server"
            disableColumnMenu={true}
            showColumnRightBorder={true}
            showCellRightBorder={true}
            onFilterModelChange={onFilterChange}
            onSortModelChange={onSortChange}
            components={{
              Footer: CustomToolbar,
              // Header: CustomPagination,
              Toolbar: CustomToolbar
            }}
            componentsProps={{ 
              // header: { justifyContent: 'flex-end', page, pageSize, pageCount, updateGrid: updateGrid},
              footer: { justifyContent: 'space-around', page, pageSize, pageCount, updateGrid: updateGrid, refreshGrid, statuses, onStatusChange, status, tableInfoObj},
              toolbar: { justifyContent: 'space-around', page, pageSize, pageCount, updateGrid: updateGrid, refreshGrid, statuses, onStatusChange, status, tableInfoObj},
            }}
            />
        </CardContent>
      </Card>
         {confirmDialog && 
            (
                <ConfirmDialog 
                    icon={<CheckIcon/>}
                    msg={confirmMsg}
                    color={"success"}
                    yesText={"Yes"}
                    noText={"No"}
                    closeConfirmDialog={handleCloseConfirmDialog}
                    open={confirmDialog}
                    confirmData={confirmData}
                />
            )
        }
    </Fragment>
  )
}

export default Einvoice