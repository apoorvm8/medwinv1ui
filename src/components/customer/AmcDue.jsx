import React, {Fragment, useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {reset} from '../../features/customer/customerSlice';
import {getCustomers$} from '../../features/customer/customerThunk';
import { DataGrid} from '@mui/x-data-grid';
import {Card, CardHeader, CardContent, Button, TextField, Box, Divider } from '@mui/material';
import {styles, CustomToolbar} from './../shared/CustomToolbar';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


const AmcDue = () => {
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
    const [tableInfoObj, setTableInfoObj] = useState({per_page: 0, total: 0, to:0, from:0});
    const [startDate, setStartDate] = useState(dayjs().startOf("month"));
    const [endDate, setEndDate] = useState(dayjs().endOf("month"));
    const [sortOrder, setSortOrder] = useState({field: 'acctno', sort: 'desc'})
    const [dateFilter, setDateFilter] = useState({});
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
            dateFilter: JSON.stringify({date1: startDate.format('YYYY-MM-DD'), date2: endDate.format('YYYY-MM-DD'), col: 'nextamcdate'}),
            sortOrder: JSON.stringify(sortOrder),
            status: JSON.stringify(status)
          })).unwrap();
          
          setStateRows(response.data.customers.data);
          setPageCount((prevRowCountState) =>
            response.data.customers.last_page !== undefined
              ? response.data.customers.last_page
              : prevRowCountState,
          );
          setTotalRecords(response.data.customers.total);
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
    }, [page, pageSize, quickFilter, triggerEffect, sortOrder, dateFilter, status]);
  
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

    const searchAmcDue = () => {
      let startDate$ = startDate.format('YYYY-MM-DD');
      let endDate$ = endDate.format('YYYY-MM-DD');
      setDateFilter({
        ...dateFilter,
        stateDate: startDate$,
        endDate: endDate$
      })
    }

    const refreshGrid = () => {
      setTriggerEffect(Math.random().toString(36)); // We want to run useeffect to reload the datatable
    }
  
    const onSortChange = (e) => {
      setSortOrder(e[0]);
      setPage(0);
    }

    const onFilterChange = (e) => {
      setQuickFilter(e.quickFilterValues.join(' '));
      setPage(0);
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
        field: 'subphone', width: 200,
        headerName: 'Phones',
        cellClassName: 'cell-font-size',
        sortable: false,
        renderHeader: () => <strong>Phones</strong>
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
        field: 'amcamount',
        headerName: 'AMC Amt',
        sortingOrder: ['desc', 'asc'],
        renderHeader: () => <strong>AMC Amt</strong>
      },
    ];


  if(!user) {
    return null;
  }

  return (
    <Fragment>
        <Card>
          <CardHeader title="AMC DUE"> 
          </CardHeader>
          <Divider/>
          <Box sx={
                    {mt: '1rem', display: 'flex', flexDirection: {xs: 'column', md: 'row'}, px: {xs: '6%'}, placeContent: 'center center',
                     columnGap: '2%'}
                  }>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        disableFuture
                        label="Start Date"
                        inputFormat='DD/MM/YYYY'
                        openTo="day"
                        views={['year', 'month', 'day']}
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue);
                        }}
                        renderInput={(params) => <TextField sx={{mb: {xs: '1.5rem'}}} {...params} inputProps={{...params.inputProps, readOnly: true}} />}
                        />
                    <DatePicker
                        label="End Date"
                        openTo="day"
                        inputFormat='DD/MM/YYYY'
                        views={['year', 'month', 'day']}
                        value={endDate}
                        onChange={(newValue) => {
                            setEndDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} inputProps={{...params.inputProps, readOnly: true}} />}
                        />
                </LocalizationProvider>
                <Button onClick={searchAmcDue} sx={{alignSelf: {md: 'start'}, mt: {xs: '1rem', md: '0rem'}, py: {md: '1rem'}}} size="small" color="primary" variant="contained">Search</Button>
           </Box>
          <CardContent>
            <DataGrid
            sx={[styles.wrapText, styles.cellFontSize, styles.cellBold, styles.headerBold]}
            rows={stateRows}
            getRowId={(row) => row.acctno}
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
            onSortModelChange={onSortChange}
            components={{
              Footer: CustomToolbar,
              // Header: CustomPagination,
              Toolbar: CustomToolbar
            }}
            componentsProps={{ 
              // header: { justifyContent: 'flex-end', page, pageSize, pageCount, updateGrid: updateGrid},
              footer: { justifyContent: 'space-around', page, pageSize, pageCount, updateGrid: updateGrid, refreshGrid, status, statuses, onStatusChange, tableInfoObj},
              toolbar: { justifyContent: 'space-around', page, pageSize, pageCount, updateGrid: updateGrid, refreshGrid, status, statuses, onStatusChange, tableInfoObj}
            }}
            />
          </CardContent>
        </Card>
    </Fragment>
  )
}

export default AmcDue;