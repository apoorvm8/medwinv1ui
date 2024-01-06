import React, {Fragment, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {reset} from '../../features/customer/customerSlice';
import {customerAction$, getCustomerWhatsapps$} from '../../features/customer/customerThunk';
import { DataGrid} 
from '@mui/x-data-grid';
import { Tooltip, IconButton, Card, CardContent, CardHeader } from '@mui/material';
import {toast} from 'react-toastify';
import ConfirmDialog from '../shared/ConfirmDialog';
import CheckIcon from '@mui/icons-material/Check';
import {styles, CustomToolbar} from './../shared/CustomToolbar';
import DeleteIcon  from '@mui/icons-material/Delete';
import WhatsAppIcon  from '@mui/icons-material/WhatsApp';

const Whatsapp = () => {
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
      const getCustomerWhatsapps =  async () => {
          try {
            let response = await dispatch(getCustomerWhatsapps$({
              page: page+1,
              pageSize: pageSize,
              quickFilter: quickFilter,
              status: JSON.stringify(status),
              sortOrder: JSON.stringify(sortOrder),
            })).unwrap();

            setStateRows(response.data.customerwhatsapps.data);
            setPageCount((prevRowCountState) =>
              response.data.customerwhatsapps.last_page !== undefined
                ? response.data.customerwhatsapps.last_page
                : prevRowCountState,
            );
            setTotalRecords(response.data.customerwhatsapps.total);
            setTableInfoObj({
              per_page: response.data.customerwhatsapps.per_page,
              total: response.data.customerwhatsapps.total,
              to: response.data.customerwhatsapps.to,
              from: response.data.customerwhatsapps.from
            });
            dispatch(reset());
          } catch(error) {
            toast.dismiss();
            toast.error(error);
          }
      }
  
      getCustomerWhatsapps();
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

    const onSortChange = (e) => {
      setSortOrder(e[0]);
      setPage(0);
    }

    const customerAction = async (actionType, row) => {
      setConfirmMsg("");
      setConfirmData(null);
      if(actionType === "customerwhatsappaccess") {
        setConfirmMsg(`${row.active ? 'Disable' : 'Enable'} Whatsapp Service for account ${row.acctno} ?`);
        setConfirmDialog(true);
      }
      
      if(actionType === 'customerwhatsappdelete') {
        setConfirmMsg(`Delete Whatsapp Service for account ${row.acctno} ?`);
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
      filterable: false,
      sortable: false,
      headerName: 'S.No',
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
      headerName: 'Actions',
      cellClassName: 'wrap-text',
      renderHeader: () => <strong>Actions</strong>,
      renderCell: (params) => {
        let whatsappStatus = params.row.active;
        return (
          <Fragment>
            {
              user?.role === superUser || user?.permissions.includes('customer_whatspp_toggle') ?
              (
                <Tooltip title={`${whatsappStatus ? 'Disable' : 'Enable'} Whatsapp Service for ${params.row.acctno}`}>
                  <IconButton sx={{color: whatsappStatus ? '#28a745' : '#dc3545'}} onClick={() => customerAction('customerwhatsappaccess', params.row)}>
                      <WhatsAppIcon/>
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
      headerName: 'C_ID',
      width: 80,
      sortingOrder: ['asc', 'desc'],
      renderHeader: () => <strong>C_ID</strong>
    },
    { 
      field: 'subdesc', headerName: 'Name', width: 250,
      cellClassName: 'wrap-text cell-font-size',
      sortingOrder: ['desc', 'asc'],
      renderHeader: () => <strong>Name</strong>
    },
    { 
      headerName: 'Install DT',
      field: 'install_date', width: 120,
      cellClassName: 'cell-bold',
      sortingOrder: ['desc', 'asc'],
      renderHeader: () => <strong>Install DT</strong>
    },
    { 
      headerName: 'AMC DT',
      field: 'next_amc_date', width: 120,
      cellClassName: 'cell-bold',
      sortingOrder: ['desc', 'asc'],
      renderHeader: () => <strong>AMC DT</strong>
    },
    { 
      headerName: 'Remarks',
      field: 'remarks', width: 250,
      cellClassName: 'wrap-text cell-font-size cell-bold',
      sortable: false,
      renderHeader: () => <strong>Remarks</strong>
    },
    { 
      headerName: 'Created On',
      field: 'created_at', width: 200, cellClassName: 'cell-bold',
      sortingOrder: ['desc', 'asc'],
      renderHeader: () => <strong>Created On</strong>
    },
  ];

  if(user && user.role === process.env.REACT_APP_SUPER_USER) {
    columns.splice(1, 0, {
      headerName: 'Admin',
      field: 'admin_action',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      sortable: false,
      cellClassName: 'wrap-text',
      renderHeader: () => <strong>Admin</strong>,
      renderCell: (params) => {
        return (
          <Tooltip title={`Delete Whatsapp Service for ${params.row.acctno}`}>
          <IconButton sx={{color: '#dc3545'}} onClick={() => customerAction('customerwhatsappdelete', params.row)}>
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
        <CardHeader title='Whatsapp Access'></CardHeader>
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

export default Whatsapp