import React, {Fragment, useEffect, useState} from 'react'
import {Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import {reset} from '../../../features/folder/folderSlice';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-toastify';
import {getUserFolderPermissions$, updateUserFolderPermissions$} from '../../../features/folder/folderThunk';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from './../../shared/LoadingButton';
import { DataGrid} from '@mui/x-data-grid';

const FolderPermission = ({open, onClose, folder, emitPermissionsToParent = null, fromParent=false, permissionRows = null, fromAdd = false, folderToCreateName = null}) => {
  const {isLoading} = useSelector(state => state.folder);
  const dispatch = useDispatch();
  const [stateRows, setStateRows] = useState([])
  const [folderName, setFolderName] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('');
  useEffect(() => {
    // Make api hit here just to fetch root
    const getUserFolderPermissions =  async () => {
      let response = await dispatch(getUserFolderPermissions$({id: folder.id, fromAdd})).unwrap();
      setStateRows(response.data.permissions);
      dispatch(reset());
      if(fromParent) {
        // Loop through the those rows which were modified before
        setFolderName(folderToCreateName);
        setAdditionalInfo(`Permissions will be created for the folder you are about to create.`);
        if(permissionRows) {
          let updatedState = [...permissionRows];
          setStateRows(updatedState);
        }
      } else {
        setFolderName(folder.name);
      }
    }

    getUserFolderPermissions();
    // eslint-disable-next-line
  }, []);

  const toggle = (params) => {
    let row = params.row;
    let updatedState = stateRows.map((stateRow) => {
      if(stateRow.id === row.id) {
        let keysToCheck = ['create', 'delete', 'download', 'edit', 'info', 'permission', 'upload', 'view', 'applychild'];
        Object.keys(stateRow).forEach(rowKey => {
          if(keysToCheck.includes(rowKey)) {
            if(row.selectAll) {
              stateRow[rowKey] = false;
            } else {
              stateRow[rowKey] = true;
            }
          }
        })
        stateRow.selectAll = !stateRow.selectAll;
      }
      return stateRow
    })
    setStateRows(updatedState);
  }

  const togglePermission = (params, permissionType) => {
    let row = params.row;
    let updatedState = stateRows.map((stateRow) => {
      if(stateRow.id === row.id) {
        stateRow[permissionType] = !stateRow[permissionType];
      }
      return stateRow
    })

    setStateRows(updatedState);
  }

  const savePermissions = async (confirm) => {
    // Dispatch delete function
    toast.dismiss();
    if(confirm) {
        if(fromParent) {
          emitPermissionsToParent(stateRows);
        } else {
          // Make api request to update the folder permissions
          try {
            let response = await dispatch(updateUserFolderPermissions$({id: folder.id, stateRows})).unwrap();
            setStateRows(response.data.permissions);
            dispatch(reset())
            toast.success(response.msg);
          } catch(error) {
            toast.error(error);
          }
        }
     } else {
        if(fromAdd) {
          emitPermissionsToParent(null);
        }
     }

     onClose('permission');
  }

  let columns = [];
  if(folder.resource_type === 'folder') {
    columns = [
      {
          field: 'selectAll',
          headerName: '',
          width: 20,
          sortable: false,
          renderCell: (params) => {
              return (
                  <DialogContentText>
                      <FormControlLabel control={<Checkbox checked={params.row.selectAll} onChange={()=> toggle(params)}/>}/>
                  </DialogContentText>
              ) 
          },
      },
      { field: 'sno', headerName: 'S.No', width: 50 },
      { field: 'name', headerName: 'User', width: 150 },
      {
        field: 'view',
        headerName: 'View',
        width: 70,
        sortable: false,
        renderCell: (params) => {
          return (
              <DialogContentText>
                  <FormControlLabel control={<Checkbox checked={params.row.view} onChange={()=> togglePermission(params, 'view')} />} />
              </DialogContentText>
          ) 
        },
      },
      {
        field: 'create',
        headerName: 'Create',
        width: 70,
        sortable: false,
        renderCell: (params) => {
          return (
              <DialogContentText>
                  <FormControlLabel control={<Checkbox checked={params.row.create} onChange={()=> togglePermission(params, 'create')} />} />
              </DialogContentText>
          ) 
        },
      },
      {
        field: 'edit',
        headerName: 'Edit',
        width: 70,
        sortable: false,
        renderCell: (params) => {
          return (
              <DialogContentText>
                  <FormControlLabel control={<Checkbox checked={params.row.edit} onChange={()=> togglePermission(params, 'edit')} />}/>
              </DialogContentText>
          ) 
        },
      },
      {
        field: 'info',
        headerName: 'Info',
        width: 70,
        sortable: false,
        renderCell: (params) => {
          return (
              <DialogContentText>
                  <FormControlLabel control={<Checkbox checked={params.row.info} onChange={()=> togglePermission(params, 'info')} />}/>
              </DialogContentText>
          ) 
        },
      },
      {
        field: 'delete',
        headerName: 'Delete',
        width: 70,
        sortable: false,
        renderCell: (params) => {
          return (
              <DialogContentText>
                  <FormControlLabel control={<Checkbox checked={params.row.delete} onChange={()=> togglePermission(params, 'delete')} />}/>
              </DialogContentText>
          ) 
        },
      },
      // {
      //   field: 'permission',
      //   headerName: 'Permission',
      //   width: 100,
      //   sortable: false,
      //   renderCell: (params) => {
      //     return (
      //         <DialogContentText>
      //             <FormControlLabel control={<Checkbox checked={params.row.permission} onChange={()=> togglePermission(params, 'permission')} />}/>
      //         </DialogContentText>
      //     ) 
      //   },
      // },
      {
        field: 'upload',
        headerName: 'Upload',
        width: 100,
        sortable: false,
        renderCell: (params) => {
          return (
              <DialogContentText>
                  <FormControlLabel control={<Checkbox checked={params.row.upload} onChange={()=> togglePermission(params, 'upload')} />}/>
              </DialogContentText>
          ) 
        },
      },
      {
        field: 'download',
        headerName: 'Download',
        width: 100,
        sortable: false,
        renderCell: (params) => {
          return (
              <DialogContentText>
                  <FormControlLabel control={<Checkbox checked={params.row.download} onChange={()=> togglePermission(params, 'download')} />}/>
              </DialogContentText>
          ) 
        },
      },
      {
        field: 'applychild',
        headerName: 'Apply To Children',
        width: 150,
        sortable: false,
        renderCell: (params) => {
          return (
              <DialogContentText>
                  <FormControlLabel control={<Checkbox checked={params.row.applychild} onChange={()=> togglePermission(params, 'applychild')} />}/>
              </DialogContentText>
          ) 
        },
      },
    ];
  } else {
    columns = [
      {
          field: 'selectAll',
          headerName: '',
          width: 20,
          sortable: false,
          renderCell: (params) => {
              return (
                  <DialogContentText>
                      <FormControlLabel control={<Checkbox checked={params.row.selectAll} onChange={()=> toggle(params)}/>}/>
                  </DialogContentText>
              ) 
          },
      },
      { field: 'sno', headerName: 'S.No', width: 50 },
      { field: 'name', headerName: 'User', width: 150 },
      {
        field: 'view',
        headerName: 'View',
        width: 70,
        sortable: false,
        renderCell: (params) => {
          return (
              <DialogContentText>
                  <FormControlLabel control={<Checkbox checked={params.row.view} onChange={()=> togglePermission(params, 'view')} />} />
              </DialogContentText>
          ) 
        },
      },
      {
        field: 'info',
        headerName: 'Info',
        width: 70,
        sortable: false,
        renderCell: (params) => {
          return (
              <DialogContentText>
                  <FormControlLabel control={<Checkbox checked={params.row.info} onChange={()=> togglePermission(params, 'info')} />}/>
              </DialogContentText>
          ) 
        },
      },
      {
        field: 'delete',
        headerName: 'Delete',
        width: 70,
        sortable: false,
        renderCell: (params) => {
          return (
              <DialogContentText>
                  <FormControlLabel control={<Checkbox checked={params.row.delete} onChange={()=> togglePermission(params, 'delete')} />}/>
              </DialogContentText>
          ) 
        },
      },
      // {
      //   field: 'permission',
      //   headerName: 'Permission',
      //   width: 100,
      //   sortable: false,
      //   renderCell: (params) => {
      //     return (
      //         <DialogContentText>
      //             <FormControlLabel control={<Checkbox checked={params.row.permission} onChange={()=> togglePermission(params, 'permission')} />}/>
      //         </DialogContentText>
      //     ) 
      //   },
      // },
      {
        field: 'download',
        headerName: 'Download',
        width: 100,
        sortable: false,
        renderCell: (params) => {
          return (
              <DialogContentText>
                  <FormControlLabel control={<Checkbox checked={params.row.download} onChange={()=> togglePermission(params, 'download')} />}/>
              </DialogContentText>
          ) 
        },
      },
    ];
  }

  return (
    <Fragment>
      <Dialog
      open={open} onClose={() => onClose('permission')} fullWidth maxWidth='lg'
      >
          <DialogTitle>
              Folder Permission  {folderName ? ` - ${folderName}` : ''}
          </DialogTitle>
          <Divider></Divider>
          <DialogContent>
            <DialogContentText>
              <span>Not selecting anything will by default restrict the user to not see folder or perform any actions.</span>
              <br/><br/>
              <span>{additionalInfo}</span>
            </DialogContentText>
          </DialogContent>
          <DialogContent sx={{height: '80vh'}}>
              <DataGrid
              rows={stateRows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
              />
          </DialogContent>
          <DialogActions>
              <LoadingButton
                  onClick={() => savePermissions(true)}
                  size="small"
                  variant="contained"
                  startIcon={<SaveIcon/>}
                  type="submit"
                  text={isLoading ? 'Saving Data...' :  'Save'}
                  isLoading={isLoading}
                  >
                  </LoadingButton>
              <Button startIcon={<CloseIcon/>} size="small" color="secondary" variant="contained" onClick={() => savePermissions(false)}>Cancel</Button>
          </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default FolderPermission