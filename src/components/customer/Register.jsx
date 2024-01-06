import React, {Fragment, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {reset} from '../../features/customer/customerSlice';
import {bulkDeleteCustomerRegisters, getCustomerRegisters$} from '../../features/customer/customerThunk';
import { DataGrid} from '@mui/x-data-grid';
import {Card, CardHeader, CardContent, CardActions, Button } from '@mui/material';
import {toast} from 'react-toastify';
import ConfirmDialog from '../shared/ConfirmDialog';
import CheckIcon from '@mui/icons-material/Check';
import {styles, CustomToolbar} from './../shared/CustomToolbar';
import InfoDialog from '../shared/InfoDialog';

const Register = () => {
    const {isLoading} = useSelector(state => state.customer);
    const {user} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [stateRows, setStateRows] = useState([])
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);
    const [quickFilter, setQuickFilter] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [triggerEffect, setTriggerEffect] = useState(0);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [confirmData, setConfirmData] = useState(null);
    const [confirmMsg, setConfirmMsg] = useState("");
    const [tableInfoObj, setTableInfoObj] = useState({per_page: 0, total: 0, to:0, from:0});
    const [selectedRows, setSelectedRows] = useState([]);
    const [infoDialog, setInfoDialog] = useState(false);
    const [infoMsg, setInfoMsg] = useState('');
    const [sortOrder, setSortOrder] = useState({field: 'acctno', sort: 'desc'})

    const superUser = process.env.REACT_APP_SUPER_USER;
    

    useEffect(() => {
      // Make api hit here just to fetch root
      const getCustomerRegisters =  async () => {
          let response = await dispatch(getCustomerRegisters$({
            page: page + 1,
            pageSize: pageSize,
            quickFilter: quickFilter,
            sortOrder: JSON.stringify(sortOrder),
          })).unwrap();
          
          setStateRows(response.data.customerregisters.data);
          setPageCount((prevRowCountState) =>
            response.data.customerregisters.last_page !== undefined
              ? response.data.customerregisters.last_page
              : prevRowCountState,
          );
          setTotalRecords(response.data.customerregisters.total);
          setTableInfoObj({
            per_page: response.data.customerregisters.per_page,
            total: response.data.customerregisters.total,
            to: response.data.customerregisters.to,
            from: response.data.customerregisters.from
          });
          dispatch(reset());
      }
  
      getCustomerRegisters();
      // eslint-disable-next-line
    }, [page, pageSize, quickFilter, triggerEffect, sortOrder]);

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

    const handleCloseConfirmDialog = async (confirmData) => {
      // Dispatch delete function
      setConfirmDialog(false);
      if(confirmData) {
        toast.dismiss();
        try {
          const response = await dispatch(bulkDeleteCustomerRegisters({
            actionType: confirmData.actionType,
            idsStr: JSON.stringify(confirmData.idsArr)
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
      setSelectedRows([]);
    }
  

    const onFilterChange = (e) => {
      setQuickFilter(e.quickFilterValues.join(' '));
      setPage(0);
    }  

    const deleteSelectedRows = (e) => {
      if(selectedRows.length === 0) {
        setInfoDialog(true);
        setInfoMsg("Please select atleast one record.");
      } else {
        setConfirmDialog(true);
        setConfirmMsg(`Are you want to delete these ${selectedRows.length} records ? This action is permanent.`);
        setConfirmData({
          actionType: 'registerdelete',
          idsArr: selectedRows
        })
      }
    }
    
    const onSelectionModelChange = (e) => {
      setSelectedRows([]);
      setSelectedRows(e);
    }

    const handleCloseInfoDialog = () => {
      setInfoDialog(false);
    }

  const columns = [
    {
      field: 'sno' , 
      filterable: false,
      sortable: false,
      renderCell: (index) => (pageSize * page) + index.api.getRowIndex(index.row.id) + 1,
      width: 55,
      headerName: 'S.No',
      renderHeader: () => <strong>S.No</strong>
    },
    {
      field: 'acctno',
      width: 80,
      sortingOrder: ['asc', 'desc'],
      headerName: 'C_ID',
      renderHeader: () => <strong>C_ID</strong>
    },
    { 
      field: 'subdesc', headerName: 'Name', width: 250,
      cellClassName: 'wrap-text cell-font-size',
      sortingOrder: ['desc', 'asc'],
      renderHeader: () => <strong>Name</strong>
    },
    { 
      field: 'datetimereg', width: 180,
      cellClassName: 'cell-bold',
      sortingOrder: ['desc', 'asc'],
      headerName: 'Date/Time',
      renderHeader: () => <strong>Date/Time</strong>
    },
    { 
      field: 'remarks', width: 500,
      sortable: false,
      cellClassName: 'wrap-text cell-font-size',
      headerName: 'Remarks',
      renderHeader: () => <strong>Remarks</strong>
    },
  ];


  if(!user) {
    return null;
  }
  return (
    <Fragment>
        <Card>
          <CardHeader title="Customer Registers">
          </CardHeader>
          <CardActions>
            <span style={{display: 'inline-block', marginLeft: '.8rem', marginRight: '1rem'}}>Bulk Actions:</span>
            {
              ( user?.role === superUser || user?.permissions.includes('customer_register_delete') ) && (
                <Button onClick={deleteSelectedRows} size="small" color="error" variant="contained">Delete</Button>
              )  
            }
          </CardActions>
          <CardContent>
            <DataGrid
            checkboxSelection
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
            onSelectionModelChange={onSelectionModelChange}
            onSortModelChange={onSortChange}
            selectionModel={selectedRows}

            components={{
              Footer: CustomToolbar,
              // Header: CustomPagination,
              Toolbar: CustomToolbar
            }}
            componentsProps={{ 
              // header: { justifyContent: 'flex-end', page, pageSize, pageCount, updateGrid: updateGrid},
              footer: { justifyContent: 'space-around', page, pageSize, pageCount, updateGrid: updateGrid, refreshGrid, tableInfoObj},
              toolbar: { justifyContent: 'space-around', page, pageSize, pageCount, updateGrid: updateGrid, refreshGrid, tableInfoObj}
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
        {infoDialog && 
            (
                <InfoDialog 
                    msg={infoMsg}
                    closeInfoDialog={handleCloseInfoDialog}
                    open={infoDialog}
                    okText={"OK"}
                    title={"Action Required"}
                />
            )
        }
    </Fragment>
  )
}

export default Register;