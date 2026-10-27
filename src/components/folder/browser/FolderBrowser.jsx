import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Alert, Box, Breadcrumbs, Button, Chip, IconButton, Link, Paper, Stack, Tooltip, Typography} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';
import {toast} from 'react-toastify';
import folderService from '../../../features/folder/folderService';
import ConfirmDialog from '../../shared/ConfirmDialog';
import Spinner from '../../shared/Spinner';
import AddFolder from '../folderactions/AddFolder';
import EditFolder from '../folderactions/EditFolder';
import DeleteFolder from '../folderactions/DeleteFolder';
import UploadFile from '../folderactions/UploadFile';
import FolderInfo from '../folderactions/FolderInfo';
import FolderPermission from '../folderactions/FolderPermission';
import BrowserFilters from './BrowserFilters';
import BrowserTable from './BrowserTable';

const NO_FILTERS = {type: 'all', modified: 'any', from: '', to: '', area: 'all'};

// The S3-console-style folder screen: a folder's contents or, when searching or filtering, everything
// below it. The server decides what the user may see and do: each item comes with its `can` flags.
function FolderBrowser({folderId}) {
  const [, setSearchParams] = useSearchParams();
  const [text, setText] = useState('');
  const [params, setParams] = useState({search: '', ...NO_FILTERS, sort: 'name', dir: 'asc', page: 0, pageSize: 25});
  const [data, setData] = useState({folder: null, breadcrumbs: [], items: [], total: 0, finding: false});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloads, setReloads] = useState(0);
  const [selection, setSelection] = useState([]);
  const [dialog, setDialog] = useState(null);
  const [toDownload, setToDownload] = useState(null);

  // Any change other than paging starts again from the first page.
  const update = (changes) => setParams((current) => ({...current, page: 0, ...changes}));

  // Search once typing pauses, from 2 letters on.
  useEffect(() => {
    const timer = setTimeout(() => {
      const search = text.trim().length >= 2 ? text.trim() : '';
      setParams((current) => (current.search === search ? current : {...current, search, page: 0}));
    }, 400);
    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => {
    let latest = true; // an older, slower answer must not replace a newer one
    setLoading(true);
    setSelection([]);
    folderService.browse({
      folder: folderId || undefined,
      search: params.search || undefined,
      type: params.type,
      modified: params.modified,
      from: params.modified === 'custom' && params.from ? params.from : undefined,
      to: params.modified === 'custom' && params.to ? params.to : undefined,
      area: params.area,
      sort: params.sort,
      dir: params.dir,
      page: params.page + 1,
      per_page: params.pageSize,
    }).then((result) => {
      if (latest) {
        setData(result);
        setError(null);
      }
    }).catch((err) => {
      if (latest) {
        setData((current) => ({...current, items: [], total: 0}));
        setError(err.response?.data?.message || err.message);
      }
    }).finally(() => {
      if (latest) setLoading(false);
    });
    return () => {
      latest = false;
    };
  }, [folderId, params, reloads]);

  const {folder, breadcrumbs} = data;
  const selected = data.items.filter((item) => selection.includes(item.id));
  const openFolder = (id) => setSearchParams({f: id});
  const refresh = () => setReloads((count) => count + 1);

  const closeDialog = () => {
    setDialog(null);
    refresh();
  };

  const clearFilters = () => {
    setText('');
    update({search: '', ...NO_FILTERS});
  };

  const onAction = (type, item) => {
    if (type === 'download') {
      setToDownload([item]);
    } else {
      setDialog({type, folder: item});
    }
  };

  const download = async (confirm) => {
    const items = toDownload;
    setToDownload(null);
    if (!confirm) return;

    for (const item of items) {
      const id = toast.loading(`Preparing ${item.name}...`);
      try {
        await folderService.download(item);
        toast.update(id, {render: `${item.name} downloaded.`, type: 'success', isLoading: false, autoClose: 3000});
      } catch (err) {
        toast.update(id, {render: err.message, type: 'error', isLoading: false, autoClose: 5000});
      }
    }
    refresh(); // the download counts went up
  };

  const crumbLabel = (crumb, index) => (
    <>
      {index === 0 && <HomeIcon sx={{mr: 0.5, fontSize: 18}}/>}
      {crumb.name}
    </>
  );

  return (
    <Paper elevation={0} sx={{border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden'}}>
      <Box sx={{px: {xs: 2, md: 3}, pt: 2.5, pb: 2, background: 'linear-gradient(180deg, #f4f8fd 0%, #ffffff 100%)'}}>
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small"/>} sx={{mb: 1, fontSize: '.875rem'}}>
          {breadcrumbs.map((crumb, index) => (index === breadcrumbs.length - 1 ? (
            <Typography key={crumb.id} fontSize="inherit" fontWeight={600} color="text.primary" sx={{display: 'flex', alignItems: 'center'}}>
              {crumbLabel(crumb, index)}
            </Typography>
          ) : (
            <Link key={crumb.id} component="button" underline="hover" color="inherit" fontSize="inherit" onClick={() => openFolder(crumb.id)}
              sx={{display: 'flex', alignItems: 'center'}}>
              {crumbLabel(crumb, index)}
            </Link>
          )))}
        </Breadcrumbs>

        {/* A long folder name is cut short; the buttons keep one line beside it on wide screens. */}
        <Stack direction={{xs: 'column', lg: 'row'}} spacing={2} justifyContent="space-between" alignItems={{xs: 'flex-start', lg: 'center'}}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{minWidth: 0, maxWidth: '100%', flex: {lg: 1}}}>
            <Typography variant="h5" fontWeight={700} noWrap title={folder?.name}>{folder ? folder.name : 'Files'}</Typography>
            {folder && <Chip size="small" label={`${data.total} ${data.finding ? 'found' : data.total === 1 ? 'item' : 'items'}`}/>}
          </Stack>
          <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', flexShrink: 0}}>
            <Tooltip title="Refresh">
              <IconButton onClick={refresh} aria-label="Refresh"><RefreshIcon/></IconButton>
            </Tooltip>
            <Button variant="outlined" startIcon={<DownloadIcon/>} onClick={() => setToDownload(selected)}
              disabled={!selected.length || !selected.every((item) => item.can.download)}>
              Download
            </Button>
            <Button variant="outlined" color="error" startIcon={<DeleteIcon/>} onClick={() => setDialog({type: 'delete', folders: selected})}
              disabled={!selected.length || !selected.every((item) => item.can.delete)}>
              Delete
            </Button>
            {folder?.can.create && (
              <Button variant="outlined" startIcon={<CreateNewFolderIcon/>} onClick={() => setDialog({type: 'add', folder})}>Create folder</Button>
            )}
            {folder?.can.upload && (
              <Button variant="contained" disableElevation startIcon={<CloudUploadIcon/>} onClick={() => setDialog({type: 'upload', folder})}>Upload</Button>
            )}
          </Box>
        </Stack>

        <Box sx={{mt: 2.5}}>
          <BrowserFilters text={text} onTextChange={setText} params={params} onChange={update} onClear={clearFilters} folderName={folder?.name}/>
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{mx: {xs: 2, md: 3}, mb: 2}}
          action={folderId ? <Button color="inherit" size="small" onClick={() => setSearchParams({})}>Go to root</Button> : null}>
          {error}
        </Alert>
      )}
      {data.finding && !error && (
        <Typography variant="body2" color="text.secondary" sx={{px: {xs: 2, md: 3}, pb: 1.5}}>
          Results from everything inside <b>{folder.name}</b>
          {params.modified !== 'any' && '. Folders have no modified date, so a date filter shows files only.'}
        </Typography>
      )}

      {/* Without a listing there's nothing to show; an "empty folder" table would mislead. */}
      {!error && (
        <BrowserTable rows={data.items} total={data.total} loading={loading} finding={data.finding}
          params={params} onParamsChange={update} selection={selection} onSelectionChange={setSelection}
          onOpen={openFolder} onAction={onAction}/>
      )}

      <Spinner storeName='folder'/>
      {dialog?.type === 'add' && <AddFolder open folder={dialog.folder} onClose={closeDialog}/>}
      {dialog?.type === 'edit' && <EditFolder open folder={dialog.folder} onClose={closeDialog}/>}
      {dialog?.type === 'delete' && <DeleteFolder open folder={dialog.folder} folders={dialog.folders} onClose={closeDialog}/>}
      {dialog?.type === 'upload' && <UploadFile open folder={dialog.folder} onClose={closeDialog}/>}
      {dialog?.type === 'info' && <FolderInfo open folder={dialog.folder} onClose={closeDialog}/>}
      {dialog?.type === 'permission' && <FolderPermission open folder={dialog.folder} onClose={closeDialog}/>}
      {toDownload && (
        <ConfirmDialog open icon={<CheckIcon/>} color="success" yesText="Download" closeConfirmDialog={download}
          msg={toDownload.length > 1 ? `Download these ${toDownload.length} items? Folders come as ZIP files.`
            : toDownload[0].resource_type === 'folder' ? `Download the whole folder ${toDownload[0].name} as a ZIP file?`
            : `Download ${toDownload[0].name}?`}/>
      )}
    </Paper>
  );
}

export default FolderBrowser;
