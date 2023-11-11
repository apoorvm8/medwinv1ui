import React from 'react'
import FolderIcon from '@mui/icons-material/Folder';
import {Fade, ListItem, ListItemIcon} from '@mui/material';
import  ListItemText from '@mui/material/ListItemText';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DescriptionIcon from '@mui/icons-material/Description'; 
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {useDispatch} from 'react-redux';
import FolderMenu from './FolderMenu';
import {collapseFolder, getChildren} from '../../features/folder/folderThunk';
import {reset} from '../../features/folder/folderSlice';

function FolderItem({folder, index}) {
  const dispatch = useDispatch();

  const folderAction = async (folder) => {
    if(folder.is_open) {
      await dispatch(collapseFolder(folder.id)).unwrap();
    } else {
      await dispatch(getChildren({parent_id: folder.id})).unwrap();
    }
    dispatch(reset());
  }
  return (   
    <Fade key={folder.id} in={true} timeout={200}>
      {folder.resource_type === 'folder' ? (
        <ListItem sx={{padding: 0, width: '50%', marginLeft: folder.margin_left}} key={folder.id}   
          >
              <div
               style={{display: 'flex', marginRight: '.8rem', cursor: "pointer"}}
               onClick={() => folderAction(folder)}>
                <ListItemIcon sx={{marginRight: '-2rem'}}>
                    {folder.is_open ? <ArrowDropDownIcon/> : <ArrowRightIcon/>}
                </ListItemIcon>
                <ListItemIcon sx={{marginRight: '-1.2rem'}}>
                    {folder.is_open ? <FolderOpenIcon sx={{color: '#f3b51c', fontSize: '25px'}}/> 
                    : <FolderIcon sx={{color: '#f3b51c', fontSize: '25px'}}/>}
                </ListItemIcon>
                <ListItemText disableTypography primary={folder.name} 
                sx={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '-0.09rem', whiteSpace: 'nowrap'}}
                />
              </div>
              <FolderMenu folder={folder}/>
        </ListItem>
      ) : (
        <ListItem sx={{padding: 0, width: '50%', cursor: 'default', marginLeft: folder.margin_left}} key={folder.id} 
        >   
          <div style={{display: 'flex', marginRight: '.8rem'}}>
            <ListItemIcon sx={{marginRight: '-1.2rem'}}>
                <DescriptionIcon sx={{color: 'black', fontSize: '25px'}}/>
            </ListItemIcon>
            <ListItemText disableTypography primary={folder.name} sx={{ marginTop: '-0.09rem', fontWeight: 'bold', fontSize: '1.1rem'}}/>
          </div>
          <FolderMenu folder={folder}/>
        </ListItem>
      )}
    </Fade>
  )
}

export default FolderItem