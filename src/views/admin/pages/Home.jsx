import {Box, Button, Card, CardActions, CardContent, CardHeader, Grid, Typography} from '@mui/material';
import React, {Fragment, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import GroupIcon from '@mui/icons-material/Group';
import BackupIcon from '@mui/icons-material/Backup';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import ExplicitIcon from '@mui/icons-material/Explicit';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import {Link} from 'react-router-dom';
import {reset} from '../../../features/customer/customerSlice';
import {getCustomerDashboardDetails$} from '../../../features/customer/customerThunk';
import {toast} from 'react-toastify';

function Home() {
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [dashboardDetails, setDashboardDetails] = useState({
    customer: 0,
    backup: 0,
    stock: 0,
    einvoice: 0,
    register: 0,
    whatsapp: 0
  });
  const superUser = process.env.REACT_APP_SUPER_USER;

  useEffect(() => {
    const getCustomerDashboardDetails =  async () => {
        try {
          let response = await dispatch(getCustomerDashboardDetails$()).unwrap();
          setDashboardDetails(response.data.dashboarddetails);
        } catch(error) {
          toast.error(error);
        }
        dispatch(reset());
    }

    if(user)
      getCustomerDashboardDetails();

    // eslint-disable-next-line
  }, []);


  return (
   <Fragment>
      <Grid container spacing={2}>
          {
            user?.role === superUser || user?.permissions.includes('customer_master_view') ? (
              <Grid item md={4} xs={12}>
                <Card> 
                  <CardContent sx={{textAlign:'center'}}>
                      <Typography sx={{mb: '1rem'}} variant="h5">Customer Master</Typography>
                      <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <GroupIcon sx={{mb: '1rem'}} fontSize="large"/>
                        <Typography sx={{fontWeight: 'bold', ml: '.5rem', mb: '1rem'}} variant="h6">{dashboardDetails?.customer}</Typography>
                      </Box>
                      <Box>
                        <Button component={Link} to="/admin/customer" size="medium" color="primary" variant='contained'>
                          Go
                        </Button>
                      </Box>
                  </CardContent>
                </Card>
              </Grid>
            ) : null
          }
          {
            user?.role === superUser || user?.permissions.includes('customer_backup_view') ? (
              <Grid item md={4} xs={12}>
                <Card>
                  <CardContent sx={{textAlign:'center'}}>
                      <Typography sx={{mb: '1rem'}} variant="h5">Cloud Backup</Typography>
                      <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <BackupIcon sx={{mb: '1rem'}} fontSize="large"/>
                        <Typography sx={{fontWeight: 'bold', ml: '.5rem', mb: '1rem'}} variant="h6">{dashboardDetails?.backup}</Typography>
                      </Box>
                      <Box>
                        <Button component={Link} to="/admin/customer/backup" size="medium" color="primary" variant='contained'>
                          Go
                        </Button>
                      </Box>
                  </CardContent>
                </Card>
              </Grid>
            ) : null
          }
          {
            user?.role === superUser || user?.permissions.includes('customer_stockaccess_view') ? (
              <Grid item md={4} xs={12}>
                <Card>
                  <CardContent sx={{textAlign:'center'}}>
                      <Typography sx={{mb: '1rem'}}variant="h5">Stock Access</Typography>
                      <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <SyncAltIcon  sx={{mb: '1rem'}} fontSize="large"/>
                        <Typography sx={{fontWeight: 'bold', ml: '.5rem', mb: '1rem'}} variant="h6">{dashboardDetails?.stock}</Typography>
                      </Box>
                      <Box>
                        <Button component={Link} to="/admin/customer/stock-access" size="medium" color="primary" variant='contained'>
                          Go
                        </Button>
                      </Box>
                  </CardContent>
                </Card>
              </Grid>
            ) : null
          }
      </Grid>
      <Grid container spacing={2} sx={{marginTop: '1rem'}}>
          {
            user?.role === superUser || user?.permissions.includes('customer_register_view') ? (
              <Grid item md={4} xs={12}>
                <Card>
                  <CardContent sx={{textAlign:'center'}}>
                      <Typography sx={{mb: '1rem'}} variant="h5">Customer Register</Typography>
                      <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <AppRegistrationIcon sx={{mb: '1rem'}} fontSize="large"/>
                        <Typography sx={{fontWeight: 'bold', ml: '.5rem', mb: '1rem'}} variant="h6">{dashboardDetails?.register}</Typography>
                      </Box>
                      <Box>
                        <Button component={Link} to="/admin/customer/register" size="medium" color="primary" variant='contained'>
                          Go
                        </Button>
                      </Box>
                  </CardContent>
                </Card>
              </Grid>
            ) : null
          }
          {
            user?.role === superUser || user?.permissions.includes('customer_einvoice_view') ? (
              <Grid item md={4} xs={12}>
                <Card>
                  <CardContent sx={{textAlign:'center'}}>
                      <Typography sx={{mb: '1rem'}} variant="h5">E-Invoice Access</Typography>
                      <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <ExplicitIcon sx={{mb: '1rem'}} fontSize="large"/>
                        <Typography sx={{fontWeight: 'bold', ml: '.5rem', mb: '1rem'}} variant="h6">{dashboardDetails?.einvoice}</Typography>
                      </Box>
                      <Box>
                        <Button component={Link} to="/admin/customer/einvoice" size="medium" color="primary" variant='contained'>
                          Go
                        </Button>
                      </Box>
                  </CardContent>
                </Card>
              </Grid>
            ) : null
          }
          {
            user?.role === superUser || user?.permissions.includes('customer_whatsapp_view') ? (
              <Grid item md={4} xs={12}>
                <Card>
                  <CardContent sx={{textAlign:'center'}}>
                      <Typography sx={{mb: '1rem'}}variant="h5">Whatsapp Access</Typography>
                      <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <WhatsAppIcon sx={{mb: '1rem'}} fontSize="large"/>
                        <Typography sx={{fontWeight: 'bold', ml: '.5rem', mb: '1rem'}} variant="h6">{dashboardDetails?.whatsapp}</Typography>
                      </Box>
                      <Box>
                        <Button component={Link} to="/admin/customer/whatsapp-access" size="medium" color="primary" variant='contained'>
                          Go
                        </Button>
                      </Box>
                  </CardContent>
                </Card>
              </Grid>
            ) : null
          }
      </Grid>
   </Fragment>
  )
}

export default Home