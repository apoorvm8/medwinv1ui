import { useEffect } from 'react';
import  List  from '@mui/material/List';
import FolderItem from './FolderItem';
import { useSelector, useDispatch } from 'react-redux';
import { getChildren } from './../../features/folder/folderThunk';
import {fullReset, reset} from '../../features/folder/folderSlice';
import { Backdrop, CircularProgress } from '@mui/material';
import Spinner from '../shared/Spinner';
import {toast} from 'react-toastify';

function FolderView() {

  const dispatch = useDispatch();
  // Use the global folders state from reducer
  let {folders} = useSelector(state => state.folder);
  const {isLoading} = useSelector(state => state.folder);
  const {user} = useSelector(state => state.auth);

  useEffect(() => {
    
    // We only want this called to get the initial root folder, after this no need to call this
    // Make api hit here just to fetch root
    const getRoot =  async () => {
      try {
        await dispatch(getChildren({parent_id : null, slug: process.env.REACT_APP_ROOT_SLUG})).unwrap();
      } catch(error) {  
        toast.error(error);
      }
      dispatch(reset());
    }
    
    if(folders.length === 0 && user) {
      getRoot();
    }

    return () => {
      dispatch(fullReset());
    }

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {isLoading ? (<Spinner storeName='folder'/>) : ""}
      <List>
      {
          folders.map((folder, index) => (
            <FolderItem key={folder.id} folder={folder} index={index}/>
          ))
        }
      </List>
    </div>
  )
}

export default FolderView;