import {Box, FormControl, IconButton, MenuItem, Pagination, Select, Tooltip, Typography} from '@mui/material';
import {GridToolbarColumnsButton, GridToolbarQuickFilter} from '@mui/x-data-grid';
import React, {Fragment} from 'react'
import RefreshSharpIcon from '@mui/icons-material/RefreshSharp';

const CustomToolbar = ({justifyContent, page, pageSize, pageCount, updateGrid, refreshGrid = null, statuses = null, onStatusChange = null, status = null, tableInfoObj = null}) => {
    return (
      <Fragment>
        <Box 
          sx={{display: 'flex', justifyContent: justifyContent, flexDirection: {xs: 'column', sm: 'row'}}}>
          <GridToolbarColumnsButton/>
          {
            refreshGrid && (
              <Tooltip title={"Refresh"}>
                <IconButton onClick={refreshGrid}>
                    <RefreshSharpIcon color="primary"/>
                </IconButton>
              </Tooltip>
            )
          }
          {/* <GridToolbarDensitySelector/> */}
          {
            statuses && statuses.length > 0 && (
              <Box>
                <Typography noWrap component="span" sx={{display: 'inline-block', pt: '.8rem'}}>
                  Filter By:
                </Typography> 
                <FormControl variant="standard" sx={{m: '.5rem', minWidth: 50 }}>
                  <Select
                    value={JSON.stringify(status)}
                    onChange={(event) => onStatusChange(JSON.parse(event.target.value))}
                  >
                    {statuses.map((status, key) => (
                      <MenuItem key={key} value={JSON.stringify(status)}>{status.text}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )
          }

          <Box>
            <Typography noWrap component="span" sx={{ml: {xs: '2rem'}, display: 'inline-block', pt: '.8rem'}}>
              Rows Per Page:
            </Typography> 
            <FormControl variant="standard" sx={{m: '.5rem', minWidth: 50 }}>
              <Select
                value={pageSize}
                onChange={(newPageSize) => updateGrid({type: 'pagesize', value: newPageSize.target.value})}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Pagination
            sx={{pt: '.5rem'}}
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => updateGrid({type: 'page', value})}
          />
          <GridToolbarQuickFilter 
          debounceMs={200} />
        </Box>
        {
          tableInfoObj && (
            <Box sx={{marginRight:'2rem', display: 'flex', justifyContent: 'end', flexDirection: {xs: 'column', sm: 'row'}}}>
              <b>Showing: {tableInfoObj.from ? tableInfoObj.from : 0}  to {tableInfoObj.to ? tableInfoObj.to : 0} of {tableInfoObj.total} entries</b>
            </Box>
          )
        }
      </Fragment>
    );
  }
  
const styles = {
  wrapText: {
    '.wrap-text': {
      whiteSpace: 'normal !important',
      wordBreak: 'break-all !important'
    }
  },
  cellFontSize: {
    '.cell-font-size': {
      fontSize: '.8rem'
    }
  },
  cellBold: {
    '.cell-bold': {
      fontWeight : 'bold'
    }
  },
  headerBold: {
    '.header-bold': {
      fontWeight: 'bold !important'
    }
  }
}
  
export {styles, CustomToolbar};