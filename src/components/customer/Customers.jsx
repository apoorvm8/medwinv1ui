import React, {Fragment, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {reset} from '../../features/customer/customerSlice';
import {customerAction$, getCustomerBackupParentFolder, getCustomers$} from '../../features/customer/customerThunk';
import { DataGrid} 
from '@mui/x-data-grid';
import { Tooltip, IconButton, Card, CardHeader, CardContent } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import ExplicitIcon from '@mui/icons-material/Explicit';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import BackupIcon from '@mui/icons-material/Backup';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {toast} from 'react-toastify';
import ConfirmDialog from '../shared/ConfirmDialog';
import CheckIcon from '@mui/icons-material/Check';
import AddFolder from '../folder/folderactions/AddFolder';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {styles, CustomToolbar} from './../shared/CustomToolbar';


const Customers = () => {
  const {isLoading} = useSelector(state => state.customer);
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [stateRows, setStateRows] = useState([])
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [quickFilter, setQuickFilter] = useState('');
  const [triggerEffect, setTriggerEffect] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState("");
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [createFolder, setCreateFolder] = useState(null);
  const [fromSource, setFromSource] = useState(null);
  const [tableInfoObj, setTableInfoObj] = useState({per_page: 0, total: 0, to:0, from:0});
  const [sortOrder, setSortOrder] = useState({field: 'acctno', sort: 'desc'})
  const superUser = process.env.REACT_APP_SUPER_USER;
  const [status, setStatus] = useState({value: '-1', text: 'All'});
  const statuses = [
    {value: '-1', text: "All"},
    {value: 'Y', text: "Unlocked"},
    {value: 'N', text: "Locked"},
  ]

  useEffect(() => {
    // Make api hit here just to fetch root
    const getCustomers =  async () => {
        let response = await dispatch(getCustomers$({
          page: page+1,
          pageSize: pageSize,
          quickFilter: quickFilter,
          status: JSON.stringify(status),
          sortOrder: JSON.stringify(sortOrder)
        })).unwrap();
        
        setStateRows(response.data.customers.data);
        setPageCount((prevRowCountState) =>
          response.data.customers.last_page !== undefined
            ? response.data.customers.last_page
            : prevRowCountState,
        );
        setTableInfoObj({
          per_page: response.data.customers.per_page,
          total: response.data.customers.total,
          to: response.data.customers.to,
          from: response.data.customers.from
        });
        dispatch(reset());
    }

    getCustomers();
    // eslint-disable-next-line
  }, [page, pageSize, quickFilter, triggerEffect, sortOrder, status]);

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

  const refreshGrid = () => {
    setTriggerEffect(Math.random().toString(36)); // We want to run useeffect to reload the datatable
  }


  const onFilterChange = (e) => {
    setQuickFilter(e.quickFilterValues.join(' '));
    setPage(0);
  }

  const onSortChange = (e) => {
    setSortOrder(e[0]);
    setPage(0);
  }

  const customerAction = async (actionType, row) => {
    setConfirmMsg("");
    setConfirmData(null);
    setFromSource(null);
    if(actionType === "lock") {
      setConfirmMsg(`Are you sure want to ${row.activestatus === 'Y' ? 'lock' : 'unlock'} for account ${row.acctno} ?`);
      setConfirmDialog(true);
    }

    if(actionType === "einvoice") {
      setConfirmMsg(`Are you sure want to ${row.e_invoice?.active ? 'disable' : 'enable'} e-invoice for account ${row.acctno} ?`);
      setConfirmDialog(true);
    }
    
    if(actionType === 'customerwhatsappaccess') {
      setConfirmMsg(`Are you sure want to ${row.customer_whatsapp?.active ? 'disable' : 'enable'} whatsapp service for account ${row.acctno} ?`);
      setConfirmDialog(true);
    }

    if(actionType === 'adminFolderAction' || actionType === 'adminFolderActionStock') {
      // Fetch the parent backup folder by the slug
      let slug = process.env.REACT_APP_CUSTOMER_BACKUP_SLUG;
      let waitMsg = 'Fetching backup info... Please wait.';
      if(actionType === 'adminFolderActionStock') {
        slug = process.env.REACT_APP_CUSTOMER_STOCK_SLUG;
        waitMsg = 'Fetchin stock info... Please wait.';
      }

      try {
        toast.dismiss();
        toast.info(waitMsg);
        let response = await dispatch(getCustomerBackupParentFolder({slug})).unwrap();
        if(response.data.folders.length === 0) {
          toast.dismiss();
          toast.error(`Please check if ${slug} named folder is created to use this functionality, in folders section`);
          return;
        }
        toast.dismiss();
        setCreateFolder(response.data.folders[0]);
        setCreateFolderOpen(true);
        setFromSource({
          sourceName: 'customermaster',
          data: {
            actionType: actionType,
            acctNo: row.acctno,
            customerName: row.subdesc
          }
        })
      } catch (error) {
        toast.dismiss();
        toast.error(error);
        setCreateFolderOpen(false);
      }
      dispatch(reset());
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
          acctno: confirmData.row.acctno
        })).unwrap();
        toast.success(response.msg);
        refreshGrid();
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

  const handleDialogClose = () => {
    setCreateFolder(false);    
  }

  const handleCreateRes = (res) => {
    refreshGrid();
  }

  const onStatusChange = (newStatus) => {
    setStatus({
      ...status,
      ...newStatus
    })
  }

  const columns = [
    {
      field: 'sno' , 
      headerName: 'S.No',
      filterable: false,
      sortable: false,
      renderCell: (index) => (pageSize * page) + index.api.getRowIndex(index.row.acctno) + 1,
      width: 55,
      renderHeader: () => <strong>S.No</strong>
    },
    {
      headerName: 'Action',
      field: 'action',
      width: 130,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      cellClassName: 'wrap-text',
      renderHeader: () => <strong>Actions</strong>,
      renderCell: (params) => {
        let eInvoiceStatus = params.row.e_invoice?.active;
        let customerWhatsappStatus = params.row.customer_whatsapp?.active;

        if(eInvoiceStatus === 0) {
          // If it is disabled we want to remove it from the list
          eInvoiceStatus = 1;
        }
        
        if(customerWhatsappStatus === 0) {
          // If it is disabled we want to remove it from the list
          customerWhatsappStatus = 1;
        }
    
        return (
          <Fragment>
            {
              user?.role === superUser || user?.permissions.includes('customer_master_lock') ? (
                <Tooltip title={params.row.activestatus === 'Y' ? `Lock ${params.row.acctno}` : `Unlock ${params.row.acctno}`}>
                  <IconButton sx={{color: params.row.activestatus === 'Y' ? '#28a745' : '#dc3545'}} onClick={() => customerAction('lock', params.row)}>
                    {
                      params.row.activestatus === 'Y' ? (
                        <LockOpenIcon/>
                      ) : (
                        <LockIcon/>
                      )
                    }
                  </IconButton>
                </Tooltip>
              ) : null 
            }
            {
              (user?.role === superUser || user?.permissions.includes('customer_master_einvoice')) && params.row.activestatus === "Y" && !eInvoiceStatus ?  (
                <Fragment>
                    <Tooltip title={`${eInvoiceStatus ? 'Disable' : 'Enable'} E-Invoice for ${params.row.acctno}`}>
                    <IconButton sx={{color: eInvoiceStatus ? '#28a745' : '#dc3545'}} onClick={() => customerAction('einvoice', params.row)}>
                      <ExplicitIcon/>
                    </IconButton>
                  </Tooltip>
                </Fragment>
              ) : null
            }
            {
              (user?.role === superUser || user?.permissions.includes('customer_whatsapp_toggle')) && params.row.activestatus === "Y" && !customerWhatsappStatus ?  (
                <Fragment>
                    <Tooltip title={`${customerWhatsappStatus ? 'Disable' : 'Enable'} Whatsapp Service for ${params.row.acctno}`}>
                    <IconButton sx={{color: customerWhatsappStatus ? '#28a745' : '#dc3545'}} onClick={() => customerAction('customerwhatsappaccess', params.row)}>
                      <WhatsAppIcon/>
                    </IconButton>
                  </Tooltip>
                </Fragment>
              ) : null
            }
          </Fragment>
        )
      }
    },
    {
      headerName: 'C_ID',
      field: 'acctno',
      width: 80,
      sortingOrder: ['asc', 'desc'],
      renderHeader: () => <strong>C_ID</strong>
    },
    { 
      field: 'subdesc', headerName: 'Name', width: 200,
      cellClassName: 'wrap-text cell-font-size',
      sortingOrder: ['desc', 'asc'],
      renderHeader: () => <strong>Name</strong>
    },
    { 
      field: 'installdate', width: 100,
      cellClassName: 'cell-bold',
      headerName: "Install Dt",
      sortingOrder: ['desc', 'asc'],
      renderHeader: () => <strong>Install DT</strong>
    },
    { 
      field: 'nextamcdate', width: 100,
      sortingOrder: ['desc', 'asc'],
      headerName: 'Next Amc Dt',
      renderHeader: () => <strong>AMC DT</strong>
    },
    { 
      field: 'subphone', width: 200,
      headerName: 'Phones',
      cellClassName: 'cell-font-size',
      sortable: false,
      renderHeader: () => <strong>Phones</strong>
    },
    {
      field: 'address',
      width: 280,
      sortable: false,
      headerName: 'Address',
      cellClassName: 'wrap-text cell-font-size',
      renderHeader: () => <strong>Address</strong>,
      renderCell : (params) => {
        return (
          <span>{params.row.subadd1} {params.row.subadd2} {params.row.subadd3}</span>
          )
        }
     },
     { 
        field: 'amcamount',
        headerName: 'AMC Amt',
        sortingOrder: ['desc', 'asc'],
        renderHeader: () => <strong>AMC Amt</strong>
     },
     { 
      headerName: 'Remarks',
      cellClassName: 'wrap-text cell-font-size',
      field: 'narration', width: 250, sortable: false,
      renderHeader: () => <strong>Remarks</strong>
     },
     { 
      field: 'area', headerName: 'Area', width: 150, cellClassName: 'cell-font-size', sortable: false,
      renderHeader: () => <strong>Area</strong>

     },
     { 
      headerName: 'State', field: 'state',  width: 150,cellClassName: 'cell-font-size', sortable: false,
      renderHeader: () => <strong>State</strong>
     },
  ];

  // Only push if role is superuser
  if(user && user.role === process.env.REACT_APP_SUPER_USER) {
    columns.splice(1, 0, {
      headerName: 'Admin',
      field: 'admin_action',
      width: 90,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      cellClassName: 'wrap-text',
      renderHeader: () => <strong>Admin</strong>,
      renderCell: (params) => {
        let customer_backup = params.row.customer_backup;
        let customer_stock_access = params.row.customer_stock_access;
        return (
          <Fragment>
            {
              params.row.activestatus === "Y" && !customer_backup ? (
                <Tooltip title={`Turn on customer backup for ${params.row.acctno}`}>
                  <IconButton sx={{color: params.row.activestatus === 'Y' ? '#28a745' : '#dc3545'}} onClick={() => customerAction('adminFolderAction', params.row)}>
                    <BackupIcon/>          
                  </IconButton>
                </Tooltip>
              ) : null
            }
            {
              params.row.activestatus === "Y" && !customer_stock_access ? (
                <Tooltip title={ `Turn on stock access for ${params.row.acctno}`}>
                  <IconButton sx={{color: params.row.activestatus === 'Y' ? '#28a745' : '#dc3545'}} onClick={() => customerAction('adminFolderActionStock', params.row)}>
                    <SyncAltIcon/>          
                  </IconButton>
                </Tooltip>
              ) : null
            }
          </Fragment>
        )
      }
    });
  }
 
  if(!user) {
    return null;
  }

  return (
      <Fragment>
        <Card>
          <CardHeader title='Customer Master'></CardHeader>
          <CardContent>
            <DataGrid
            sx={[styles.wrapText, styles.cellFontSize, styles.cellBold, styles.headerBold]}
            rows={stateRows}
            rowCount={pageCount}
            loading={isLoading}
            columns={columns}
            getRowId={(row) => row.acctno}
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
              footer: { justifyContent: 'space-between', page, pageSize, pageCount, quickFilter, updateGrid, refreshGrid, status, statuses, onStatusChange, tableInfoObj},
              toolbar: { justifyContent: 'space-between', page, pageSize, pageCount, quickFilter, updateGrid, refreshGrid, status, statuses, onStatusChange, tableInfoObj},
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
        {
          createFolder && (
              <AddFolder folder={createFolder} open={createFolderOpen} onClose={handleDialogClose}
              fromSource={fromSource} emitCreateRes={handleCreateRes}/>
          )
        }
      </Fragment>
  )
}

export default Customers