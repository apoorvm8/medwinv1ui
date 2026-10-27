import React, {useState} from 'react';
import dayjs from 'dayjs';
import {DataGrid} from '@mui/x-data-grid';
import {IconButton, Link, ListItemIcon, Menu, MenuItem, Stack, Typography} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import TerminalIcon from '@mui/icons-material/Terminal';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';

// Icon and colour by file extension; anything else gets a plain file icon.
const FILE_KINDS = [
  {extensions: ['zip', 'rar', '7z', 'gz', 'tar'], Icon: FolderZipIcon, color: '#7e57c2'},
  {extensions: ['exe', 'msi', 'dll', 'ocx', 'bat'], Icon: TerminalIcon, color: '#546e7a'},
  {extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'], Icon: ImageIcon, color: '#26a69a'},
  {extensions: ['pdf'], Icon: PictureAsPdfIcon, color: '#e53935'},
  {extensions: ['csv', 'xls', 'xlsx'], Icon: TableChartIcon, color: '#2e7d32'},
  {extensions: ['txt', 'doc', 'docx', 'ini', 'log'], Icon: DescriptionIcon, color: '#1e88e5'},
];

// The ⋮ menu of a row; each entry needs the matching permission on that row.
const ROW_ACTIONS = [
  {type: 'open', label: 'Open', Icon: FolderOpenIcon, allowed: (row) => row.resource_type === 'folder'},
  {type: 'download', label: 'Download', Icon: DownloadIcon, allowed: (row) => row.can.download},
  {type: 'edit', label: 'Rename', Icon: EditIcon, allowed: (row) => row.can.edit},
  {type: 'info', label: 'Info', Icon: InfoOutlinedIcon, allowed: (row) => row.can.info},
  {type: 'permission', label: 'Permissions', Icon: LockIcon, allowed: (row) => row.can.permission},
  {type: 'delete', label: 'Delete', Icon: DeleteIcon, allowed: (row) => row.can.delete},
];

const ellipsis = {overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'};

const extension = (name) => (name.includes('.') ? name.split('.').pop().toLowerCase() : '');

function ItemIcon({item}) {
  if (item.resource_type === 'folder') {
    return <FolderIcon sx={{color: '#f3b51c'}}/>;
  }
  const kind = FILE_KINDS.find((k) => k.extensions.includes(extension(item.name)));
  const Icon = kind ? kind.Icon : InsertDriveFileIcon;
  return <Icon sx={{color: kind ? kind.color : '#90a4ae'}}/>;
}

function formatSize(bytes) {
  if (bytes === null || bytes === undefined) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit++;
  }
  return `${unit === 0 ? size : size.toFixed(1)} ${units[unit]}`;
}

function NoRows({finding}) {
  const Icon = finding ? SearchOffIcon : FolderOpenIcon;
  return (
    <Stack alignItems="center" justifyContent="center" spacing={0.5} sx={{height: '100%', color: 'text.secondary'}}>
      <Icon sx={{fontSize: 52, color: '#cfd8dc', mb: 1}}/>
      <Typography fontWeight={600} color="text.primary">{finding ? 'Nothing matches' : 'This folder is empty'}</Typography>
      <Typography variant="body2">{finding ? 'Try another search, or clear the filters.' : 'Nothing has been added here yet.'}</Typography>
    </Stack>
  );
}

const gridStyles = {
  border: 0,
  '& .MuiDataGrid-columnHeaders': {bgcolor: '#f8fafc', borderColor: 'divider'},
  '& .MuiDataGrid-columnHeaderTitle': {fontWeight: 700, fontSize: '.75rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'text.secondary'},
  '& .MuiDataGrid-cell': {borderColor: '#f0f2f5'},
  '& .MuiDataGrid-row:hover': {bgcolor: '#f5f9ff'},
  '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover': {bgcolor: '#e8f1fd'},
  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {outline: 'none'},
  '& .MuiDataGrid-footerContainer': {borderColor: 'divider'},
};

// The folder browser's list: server-side paging and sorting, checkboxes for the toolbar's bulk actions.
function BrowserTable({rows, total, loading, finding, params, onParamsChange, selection, onSelectionChange, onOpen, onAction}) {
  const [menu, setMenu] = useState(null);

  const pick = (type) => {
    const row = menu.row;
    setMenu(null);
    if (type === 'open') {
      onOpen(row.id);
    } else {
      onAction(type, row);
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 2,
      minWidth: 260,
      renderCell: ({row}) => (
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{minWidth: 0}}>
          <ItemIcon item={row}/>
          {row.resource_type === 'folder' ? (
            <Link component="button" underline="hover" color="text.primary" title={row.name} onClick={() => onOpen(row.id)}
              sx={{fontWeight: 600, fontSize: '.875rem', textAlign: 'left', ...ellipsis}}>
              {row.name}
            </Link>
          ) : (
            <Typography variant="body2" title={row.name} sx={{fontWeight: 500, ...ellipsis}}>{row.name}</Typography>
          )}
        </Stack>
      ),
    },
    // Search results come from anywhere below the folder, so say where each one is.
    ...(finding ? [{
      field: 'location',
      headerName: 'Location',
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: ({row}) => (
        <Link component="button" underline="hover" color="text.secondary" title={row.location} onClick={() => onOpen(row.parent_id)}
          sx={{fontSize: '.8125rem', textAlign: 'left', ...ellipsis}}>
          {row.location}
        </Link>
      ),
    }] : []),
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      sortable: false,
      valueGetter: ({row}) => (row.resource_type === 'folder' ? 'Folder' : extension(row.name).toUpperCase() || 'File'),
    },
    {
      field: 'last_modified',
      headerName: 'Last modified',
      width: 190,
      valueFormatter: ({value}) => (value ? dayjs.unix(value).format('D MMM YYYY, h:mm A') : '—'),
    },
    {
      field: 'size',
      headerName: 'Size',
      width: 110,
      valueFormatter: ({value}) => formatSize(value),
    },
    {
      field: 'downloads',
      headerName: 'Downloads',
      width: 120,
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      align: 'right',
      renderCell: ({row}) => (ROW_ACTIONS.some((action) => action.type !== 'open' && action.allowed(row)) ? (
        <IconButton size="small" aria-label={`Actions for ${row.name}`} onClick={(event) => setMenu({anchor: event.currentTarget, row})}>
          <MoreVertIcon fontSize="small"/>
        </IconButton>
      ) : null),
    },
  ];

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={total}
        loading={loading}
        autoHeight
        checkboxSelection
        disableSelectionOnClick
        disableColumnMenu
        isRowSelectable={({row}) => row.can.download || row.can.delete}
        selectionModel={selection}
        onSelectionModelChange={onSelectionChange}
        paginationMode="server"
        page={params.page}
        pageSize={params.pageSize}
        rowsPerPageOptions={[25, 50, 100]}
        onPageChange={(page) => onParamsChange({page})}
        onPageSizeChange={(pageSize) => onParamsChange({pageSize})}
        sortingMode="server"
        sortingOrder={['asc', 'desc']}
        sortModel={[{field: params.sort, sort: params.dir}]}
        onSortModelChange={(model) => model.length && onParamsChange({sort: model[0].field, dir: model[0].sort})}
        onRowDoubleClick={({row}) => row.resource_type === 'folder' && onOpen(row.id)}
        components={{NoRowsOverlay: NoRows}}
        componentsProps={{noRowsOverlay: {finding}}}
        sx={{...gridStyles, '& .MuiDataGrid-virtualScroller': {minHeight: rows.length ? 0 : 260}}}
      />
      <Menu anchorEl={menu?.anchor} open={Boolean(menu)} onClose={() => setMenu(null)}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} transformOrigin={{vertical: 'top', horizontal: 'right'}}>
        {menu && ROW_ACTIONS.filter((action) => action.allowed(menu.row)).map(({type, label, Icon}) => (
          <MenuItem key={type} onClick={() => pick(type)} sx={type === 'delete' ? {color: 'error.main'} : null}>
            <ListItemIcon sx={type === 'delete' ? {color: 'error.main'} : null}><Icon fontSize="small"/></ListItemIcon>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default BrowserTable;
