import {useState, Fragment, useEffect} from 'react';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MainLogo from '../../components/shared/MainLogo';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import GroupIcon from '@mui/icons-material/Group';
import {Link} from 'react-router-dom';
import  ListItemButton  from '@mui/material/ListItemButton';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { Badge, Button, Collapse, useMediaQuery, useTheme } from '@mui/material';
import SidenavListItem from './../../models/SidenavListItem';
import styled from '@emotion/styled';
import ContactsIcon from '@mui/icons-material/Contacts';
import ClearIcon from '@mui/icons-material/Clear';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import BackupIcon from '@mui/icons-material/Backup';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import WhatsAppIcon  from '@mui/icons-material/WhatsApp';
import {logout, reset} from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-toastify';
import {useAuthStatus} from '../../hooks/useAuthStatus';
import Spinner from '../../components/shared/Spinner';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import EmailIcon from '@mui/icons-material/Email';

const drawerWidth = 250;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


const styles = {
  sideNavColor: {
    '.MuiDrawer-paper': {
      background: 'linear-gradient(59deg, rgba(5,30,52,1) 20%, rgba(20,42,64,1) 40%, rgba(7,31,53,1) 60%, rgba(19,41,63,1) 80%, rgba(7,31,53,1) 100%)'   
    },
    '.MuiListItemButton-root': {
      color: 'rgba(255,255,255,.8)',
      // mb: '.4rem'
    },
    '.MuiListItemIcon-root': {
      color: '#eee',
      pl: '1rem',
    },
    '.MuiListItemText-primary': {
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    '.MuiSvgIcon-root': {
      fontSize: '20px'
    },
    '.Mui-selected': {
      color: '#fff',
    }
  },
  letter: {
    fontSize: '2.5rem',
    borderColor: '#eee',
    borderRadius: '50%',
    border: 'solid',
    padding: '0.5rem',
    textDecoration: 'none', 
    color: '#eee', 
    fontWeight: 'bold'
  }
}

export default function Dashboard(props) {
  const { window } = props;
  // logic for sidenav for mobile
  const [mobileOpen, setMobileOpen] = useState(false);

  // logic for the sidenav
  const [open, setOpen] = useState(false);

  // logic for list item dropdown
  const [listOpen, setListOpen] = useState({index: -1, isOpen: false});

  // logic for selected index of a list item (highlighting the selected item)
  const [selectedIndex, setSelectedIndex] = useState(0);

  // logic to activate (highlight) the parent if a child list item is selected, eg customer register, so activate customer
  const [parentIndex, setParentIndex] = useState(-1);

  // use theme
  const theme = useTheme();

  // logic to know when the screen hits sm breakpoint
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const {loggedIn, checkingStatus, setCheckingStatus, setTriggerEffect} = useAuthStatus();
  const {logoutLoader, user} = useSelector(state => state.auth);
  const {unreadMessages} = useSelector(state => state.message);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [permissionToCheck, setPermissionToCheck] = useState('');
  const [shouldCheckPermission, setShouldCheckPermission] = useState(false);
  
  useEffect(() => {
    setMobileOpen(false);
    if(matches) {
      setOpen(true);
    }

    setPermissionToCheck('');
    // logic for matching the path name and marking the selecting item (route)
    if(location.pathname === '/admin') {
      setSelectedIndex(0);
      setShouldCheckPermission(false);
    }
    
    if(location.pathname === '/admin/customer') {
      setSelectedIndex(2);
      setPermissionToCheck('customer_master_view');
      setShouldCheckPermission(true);
    }

    if(location.pathname === '/admin/customer/register'){
      setSelectedIndex(3);
      setPermissionToCheck('customer_register_view');
      setShouldCheckPermission(true);
    }

    if(location.pathname === '/admin/customer/einvoice') {
      setSelectedIndex(4);
      setPermissionToCheck('customer_einvoice_view');
      setShouldCheckPermission(true);
    }

    if(location.pathname === '/admin/customer/backup') {
      setSelectedIndex(5);
      setPermissionToCheck('customer_backup_view');
      setShouldCheckPermission(true);
    }

    if(location.pathname === '/admin/customer/stock-access') {
      setSelectedIndex(6);
      setPermissionToCheck('customer_stockaccess_view');
      setShouldCheckPermission(true);
    }

    if(location.pathname === '/admin/customer/whatsapp-access') {
      setSelectedIndex(7);
      setPermissionToCheck('customer_whatsapp_view');
      setShouldCheckPermission(true);
    }
  
    if(location.pathname === '/admin/folder') {
      setSelectedIndex(8);
      setPermissionToCheck('folder_view');
      setShouldCheckPermission(true);
    }
    
    if(location.pathname === '/admin/amc-due') {
      setSelectedIndex(9);
      setPermissionToCheck('customer_amcdue_view');
      setShouldCheckPermission(true);
    }

    if(location.pathname === '/admin/messages') {
      setSelectedIndex(10);
      setPermissionToCheck('messages_view');
      setShouldCheckPermission(true);
    }

    // Handle parent activation incase a child item has been selected
    if(location.pathname.startsWith('/admin/customer')) {
      setParentIndex(1);
      setListOpen((prevState) => ({
        ...prevState,
        index: 1,
        isOpen: true
      }));
    } else {
      setListOpen((prevState) => ({
        ...prevState,
        index: 1,
        isOpen: false
      }));
    }
    // eslint-disable-next-line
  }, [location, matches]);

  const handleClick = (id, hasCollapse, parent) => {

    if(id !== selectedIndex && id !== 1) {
      setCheckingStatus(true);
      setTriggerEffect(Math.random().toString(36)); // We want to run useeffect to reload the datatable

    }

    if(hasCollapse) {
      setListOpen((prevState) => ({
        ...prevState,
        index: id,
        isOpen: !listOpen.isOpen
      }));
    }
    setSelectedIndex(id);
    // If the origin has parent then we activate it as well
    if(parent) {
      setParentIndex(parent.id);
    } else {
      setParentIndex(-1)
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logoutFn = async () => {
    try {
      const response = await dispatch(logout()).unwrap();
      dispatch(reset());
      toast.dismiss();
      toast.success(response.msg);
      navigate('/');
    } catch(error) {
      toast.dismiss();
      toast.error(error);
      navigate('/');
    }
  }

  let menuOptions = [
    new SidenavListItem(0, 'Home', '/admin', <HomeIcon/>, [])
  ];
  let hasOneCustomerPermission = false;
  
  if(user) {
    if(user.role === 'superuser') {
      menuOptions  = [
        new SidenavListItem(0, 'Home', '/admin', <HomeIcon/>, []),
        new SidenavListItem(1, 'Customer', null, <GroupIcon/>, [
          new SidenavListItem(2, 'Master', '/admin/customer', <ContactsIcon/>, []),
          new SidenavListItem(3, 'Register', '/admin/customer/register', <AppRegistrationIcon/>, []),
          new SidenavListItem(4, 'E-Invoice', '/admin/customer/einvoice', <ReceiptIcon/>, []),
          new SidenavListItem(5, 'Cloud Backup', '/admin/customer/backup', <BackupIcon/>, []),
          new SidenavListItem(6, 'Stock Access', '/admin/customer/stock-access', <SyncAltIcon/>, []),
          new SidenavListItem(7, 'Whatsapp Access', '/admin/customer/whatsapp-access', <WhatsAppIcon/>, []),
        ]),
        new SidenavListItem(8, 'Folder', '/admin/folder', <FolderIcon/>, []),
        new SidenavListItem(9, 'Amc Due', '/admin/amc-due', <CurrencyRupeeIcon/>, []),
        new SidenavListItem(10, 'Messages', '/admin/messages', 
          <Badge badgeContent={unreadMessages} color="error">
            <EmailIcon/>
          </Badge>
        , [])
      ]
    } else {
      if(user.permissions) {
        menuOptions.push(new SidenavListItem(1, 'Customer', null, <GroupIcon/>, []));

        if(user.permissions.includes('customer_master_view')) {
          hasOneCustomerPermission = true;
          menuOptions[1].children.push(new SidenavListItem(2, 'Master', '/admin/customer', <ContactsIcon/>, []));
        }
    
        if(user.permissions.includes('customer_register_view')) {
          hasOneCustomerPermission = true;
          menuOptions[1].children.push(new SidenavListItem(3, 'Register', '/admin/customer/register', <AppRegistrationIcon/>, []));
        }
    
        if(user.permissions.includes('customer_einvoice_view')) {
          hasOneCustomerPermission = true;
          menuOptions[1].children.push(new SidenavListItem(4, 'E-Invoice', '/admin/customer/einvoice', <ReceiptIcon/>, []));
        }
    
        if(user.permissions.includes('customer_backup_view')) {
          hasOneCustomerPermission = true;
          menuOptions[1].children.push(new SidenavListItem(5, 'Cloud Backup', '/admin/customer/backup', <BackupIcon/>, []));
        }
        
        if(user.permissions.includes('customer_stockaccess_view')) {
          hasOneCustomerPermission = true;
          menuOptions[1].children.push(new SidenavListItem(6, 'Stock Access', '/admin/customer/stock-access', <SyncAltIcon/>, []));
        }

        if(user.permissions.includes('customer_whatsapp_view')) {
          hasOneCustomerPermission = true;
          menuOptions[1].children.push(new SidenavListItem(7, 'Whatsapp Access', '/admin/customer/whatsapp-access', <WhatsAppIcon/>, []));
        }
     
        if(user.permissions.includes('folder_view')) {
          menuOptions.push(new SidenavListItem(8, 'Folder', '/admin/folder', <FolderIcon/>, []));
        }

        if(user.permissions.includes('customer_amcdue_view')) {
          menuOptions.push(new SidenavListItem(9, 'Amc Due', '/admin/amc-due', <CurrencyRupeeIcon/>, []));
        }

        if(user.permissions.includes('messages_view')) {
          menuOptions.push(new SidenavListItem(10, 'Messages', '/admin/messages', 
            <Badge badgeContent={unreadMessages} color="error">
              <EmailIcon/>
            </Badge>
            , [])
          )
        }
      }    
      if(!hasOneCustomerPermission) {
        menuOptions.splice(1, 1);
      }
    }
  }

  // Generate the html for the sidenav
  const drawer = (
    <div>
      <Toolbar sx={ matches ? {justifyContent: "center", mt: '-2rem'} : {justifyContent: "center", mt: '1rem'}}>
         <Link to="/admin" style={{textDecoration: 'none'}}>
            <MainLogo/>
         </Link>
      </Toolbar>
      <Toolbar sx={{justifyContent: "center", mt: '-.5rem', mb: '.5rem', fontWeight: "bold"}}>
        <span style={{color: '#eee'}}>{user ? user.first_name + " " + user.last_name : 'NAME'}</span>
      </Toolbar>
      <Divider />
      <List>
        {menuOptions.map((item) => (
          item.children.length === 0 ?
          <ListItemButton key={item.id} component={Link} to={item.link} 
          selected={selectedIndex === item.id}
          onClick={() => handleClick(item.id, false, null)}
          >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name}/>
          </ListItemButton>
          : 
          <Fragment key={item.id}>
            <ListItemButton key={item.id} onClick={() => handleClick(item.id, true, null)}
            selected={selectedIndex === item.id || parentIndex === item.id}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name}/>
              {listOpen.index === 1 && listOpen.isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={listOpen.index === 1 && listOpen.isOpen} timeout="auto" unmountOnExit>
              <List component="li" disablePadding>
                {item.children.map((childItem) => (
                  <ListItemButton key={childItem.id} component={Link} to={childItem.link} sx={{ pl: 3 }}  onClick={() => handleClick(childItem.id, false, item)}
                  selected={selectedIndex === childItem.id}>
                    <ListItemIcon>
                     {childItem.icon}
                   </ListItemIcon>
                   <ListItemText primary={childItem.name}/>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Fragment>
        ))}
      </List>
      <Divider />
      <Toolbar sx={{justifyContent: "center", marginTop: '1rem'}}>
        <ListItemButton onClick={logoutFn}>
            <ListItemIcon sx={{marginRight: '-0.6rem'}}>
              <ExitToAppIcon sx={{fontSize: '25px !important'}}/>
            </ListItemIcon>
            <ListItemText primary="EXIT / LOGOUT" sx={{fontWeight: 'bold', fontSize: ''}}/>
        </ListItemButton>
      </Toolbar>
    </div>
);

const container = window !== undefined ? () => window().document.body : undefined;


if(logoutLoader) {
  return <Spinner/>
}

if(checkingStatus) {
  if(!loggedIn) {
     return <Spinner/>
  } else {
      return (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar color='primary' position="fixed" open={matches ? open : false}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={matches ? handleDrawerOpen : handleDrawerToggle}
                edge="start"
                sx={{ mr: 2, ...((matches ? open : false) && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
                Dashboard
              </Typography>
              <Button sx={{fontWeight: 'bold'}} startIcon={<ExitToAppIcon/>} color='inherit' onClick={logoutFn}>
                  EXIT/LOGOUT
              </Button>
            </Toolbar>
          </AppBar>
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
          >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={[{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }, styles.sideNavColor]}
            >
              {drawer}
            </Drawer>
            <Drawer
            sx={[{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }, styles.sideNavColor]}
            variant="persistent"
            anchor="left"
            open={matches ? open : false}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                 <ClearIcon sx={{color: '#eee', fontSize: '25px !important', fontWeight: 'bold !important;'}}/>
              </IconButton>
            </DrawerHeader>
            <Divider />
            {drawer}
          </Drawer>
          </Box>
          <Main open={matches ? open : false}>
            <DrawerHeader />
            <Spinner/>
          </Main>
        </Box>
      );
    }
  } 
  
  return loggedIn ? (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <AppBar color='primary' position="fixed" open={matches ? open : false}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={matches ? handleDrawerOpen : handleDrawerToggle}
            edge="start"
            sx={{ mr: 2, ...((matches ? open : false) && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
            Dashboard
          </Typography>
          <Button sx={{fontWeight: 'bold'}} startIcon={<ExitToAppIcon/>} color='inherit' onClick={logoutFn}>
              EXIT/LOGOUT
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={[{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }, styles.sideNavColor]}
        >
          {drawer}
        </Drawer>
        <Drawer
        sx={[{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }, styles.sideNavColor]}
        variant="persistent"
        anchor="left"
        open={matches ? open : false}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
              <ClearIcon sx={{color: '#eee', fontSize: '25px !important', fontWeight: 'bold !important;'}}/>
          </IconButton>



        </DrawerHeader>
        <Divider />
        {drawer}
      </Drawer>
      </Box>
      <Main open={matches ? open : false}>
        <DrawerHeader />
        {!shouldCheckPermission || (user && user.role === 'superuser') ? 
          <Outlet/> : (user && user.permissions.includes(permissionToCheck)) ? 
          <Outlet/> : <Navigate to="/admin"/>
        }
      </Main>
    </Box>
  ) : <Navigate to='/'/>;

}