import React, {Fragment, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {reset} from '../../features/customer/customerSlice';
import {customerAction$, getCustomerBackupParentFolder, getCustomerEinvoices$, getCustomerStockAccess$, getCustomers$} from '../../features/customer/customerThunk';
import { DataGrid} 
from '@mui/x-data-grid';
import { Tooltip, IconButton, CardHeader, CardContent, Card } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ExplicitIcon from '@mui/icons-material/Explicit';
import KeyIcon from '@mui/icons-material/Key';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import BackupIcon from '@mui/icons-material/Backup';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {toast} from 'react-toastify';
import ConfirmDialog from '../shared/ConfirmDialog';
import CheckIcon from '@mui/icons-material/Check';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import AddIcon from '@mui/icons-material/Add';
import AddFolder from '../folder/folderactions/AddFolder';
import {styles, CustomToolbar} from './../shared/CustomToolbar';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon  from '@mui/icons-material/Delete';

const StockAccess = () => {
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
    const [createFolderOpen, setCreateFolderOpen] = useState(false);
    const [createFolder, setCreateFolder] = useState(null);
    const [fromSource, setFromSource] = useState(null);
    const statuses = [
      {value: -1, text: "All"},
      {value: 1, text: "Active"},
      {value: 0, text: "Inactive"},
    ]
    const superUser = process.env.REACT_APP_SUPER_USER;

    useEffect(() => {
      // Make api hit here just to fetch root
      const getCustomerStockAccess =  async () => {
          let response = await dispatch(getCustomerStockAccess$({
            page:  page+1,
            pageSize: pageSize,
            quickFilter: quickFilter,
            status: JSON.stringify(status)
          })).unwrap();
          
          setStateRows(response.data.stockaccess.data);
          setPageCount((prevRowCountState) =>
            response.data.stockaccess.last_page !== undefined
              ? response.data.stockaccess.last_page
              : prevRowCountState,
          );
          setTotalRecords(response.data.stockaccess.total);
          dispatch(reset());
      }
  
      getCustomerStockAccess();
      // eslint-disable-next-line
    }, [page, pageSize, quickFilter, triggerEffect, status]);

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
      setFromSource(null);
  
      if(actionType === "stockaccess") {
        setConfirmMsg(`Are you sure want to ${row.active ? 'disable' : 'enable'} stock access for account ${row.acctno} ?`);
        setConfirmDialog(true);
      }

      if(actionType === "stockaccessdelete") {
        setConfirmMsg(`Deleting this will also delete the stock folder of customer ${row.acctno} inside customerstock folder. Please click yes to confirm.`);
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
    
  const columns = [
    {
      field: 'sno' , 
      headerName: 'S.No',
      filterable: false,
      sortable: false,
      renderCell: (index) => (pageSize * page) + index.api.getRowIndex(index.row.id) + 1,
      width: 55,
      renderHeader: () => <strong>S.No</strong>
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      cellClassName: 'wrap-text',
      renderHeader: () => <strong>Actions</strong>,
      renderCell: (params) => {
        let stockAccessStatus = params.row.active;
        return (
          <Fragment>
            {
              user?.role === superUser || user?.permissions.includes('customer_stockaccess_toggle') ? (
                <Tooltip title={`${stockAccessStatus ? 'Disable' : 'Enable'} Stock Access for ${params.row.acctno}`}>
                  <IconButton sx={{color: stockAccessStatus ? '#28a745' : '#dc3545'}} onClick={() => customerAction('stockaccess', params.row)}>
                      <SyncAltIcon/>
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
      headerName: 'C_ID',
      renderHeader: () => <strong>C_ID</strong>
    },
    { 
      field: 'subdesc', headerName: 'Name', width: 250,
      cellClassName: 'wrap-text cell-font-size',
      renderHeader: () => <strong>Name</strong>
    },
    { 
      field: 'gstno', headerName: 'GST', width: 200,
      cellClassName: 'wrap-text cell-font-size',
      renderHeader: () => <strong>GST</strong>
    },
    { 
      field: 'install_date', width: 120, headerName: "Install Dt",
      cellClassName: 'cell-bold',
      renderHeader: () => <strong>Install DT</strong>
    },
    { 
      field: 'next_amc_date', width: 120, headerName: 'AMC DT',
      cellClassName: 'cell-bold',
      renderHeader: () => <strong>AMC DT</strong>
    },
    { 
      field: 'created_at', width: 200, cellClassName: 'cell-bold', headerName: 'Created On',
      renderHeader: () => <strong>Created On</strong>
    },
  ];

  if(user && user.role === process.env.REACT_APP_SUPER_USER) {
    columns.splice(1, 0, {
      field: 'admin_action',
      headerName: 'Admin',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      cellClassName: 'wrap-text',
      renderHeader: () => <strong>Admin</strong>,
      renderCell: (params) => {
        return (
          <Tooltip title={`Delete Stock Access for ${params.row.acctno}`}>
          <IconButton sx={{color: '#dc3545'}} onClick={() => customerAction('stockaccessdelete', params.row)}>
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
        <CardHeader title='Stock Access'></CardHeader>
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
          disableColumnMenu={true}
          showColumnRightBorder={true}
          showCellRightBorder={true}
          onFilterModelChange={onFilterChange}
          components={{
            Footer: CustomToolbar,
            // Header: CustomPagination,
            Toolbar: CustomToolbar
          }}
          componentsProps={{ 
            // header: { justifyContent: 'flex-end', page, pageSize, pageCount, updateGrid: updateGrid},
            footer: { justifyContent: 'space-around', page, pageSize, pageCount, updateGrid: updateGrid, refreshGrid, statuses, onStatusChange, status},
            toolbar: { justifyContent: 'space-around', page, pageSize, pageCount, updateGrid: updateGrid, refreshGrid, statuses, onStatusChange, status},
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

export default StockAccess;