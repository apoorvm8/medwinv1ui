import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import LoginIcon from '@mui/icons-material/Login';
import {Box, Card, CardActions, CardContent, CardHeader, Grid, InputAdornment, TextField} from '@mui/material';
import {useFormik} from 'formik';
import {useNavigate} from 'react-router-dom';
import * as yup from 'yup';
import MainLogo from '../../../components/shared/MainLogo';
import { useDispatch, useSelector } from 'react-redux';
import {login, reset} from '../../../features/auth/authSlice';
import LoadingButton from '../../../components/shared/LoadingButton';
import {toast} from 'react-toastify';

const validationSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be valid'),
  password: yup
    .string()
    .required('Password is required'),
});

const styles = {
  cardHeader: {
    '.MuiCardHeader-title': {
      textAlign: 'center',
    },
    '.MuiCardHeader-subheader': {
      textAlign: 'center',
      fontWeight: 'bold'
    },
  },
  formLabel: {
    '.MuiFormLabel-root': {
      fontWeight: 'bold',
      fontSize: '1.15rem'
    },
    '.MuiFormLabel-asterisk': {
      color: 'red',
      fontSize: '1.3rem',
      fontWeight: 'bold'
    }
  }
}

function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (loginData) => {
      try {
        let response = await dispatch(login(loginData)).unwrap();
        toast.dismiss();
        toast.success(response.msg);
        navigate('/admin');
      } catch(error) {
        if(typeof error === 'object') {
          formik.setErrors({email: error.email && error.email.length > 0 ? error.email[0] : '', password: error.password && error.password.length > 0 ? error.password[0] : ''});
        } else {
          toast.error(error);
        }
        dispatch(reset());
      }
    }
  });

  const {isLoading} = useSelector(state => state.auth);


  return (
    <Grid
      container
      sx={{height: '100vh'}}
    >
      <Grid item xs={11} sm={6} md={3} sx={{ mx: 'auto', mt: '8rem'}}>
        <Box
        component="form"
        onSubmit={formik.handleSubmit}
        >
          <Card sx={{pb: "1.5rem"}} variant="elevation">
            <CardHeader title={<MainLogo/>} subheader="Admin Login"  sx={styles.cardHeader}/>
            <CardContent sx={{px:'3.5rem'}}>
                  <TextField
                    autoFocus={true}
                    id="email"
                    variant="standard"
                    fullWidth
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon/>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{required: true}}
                    sx={[{mb: '1.5rem'}, styles.formLabel]}
                  />
                  <TextField
                    id="password"
                    type="password"
                    variant="standard"
                    fullWidth
                    label="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon/>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{required: true}}
                    sx={[styles.formLabel]}
                  />
            </CardContent>
            <CardActions sx={{'justifyContent': 'center', mt: "0.5rem"}}>
              <LoadingButton
                variant="contained"
                endIcon={<LoginIcon/>}
                type="submit"
                text={isLoading ? 'Logging In' :  'LOGIN'}
                isLoading={isLoading}
              >
              </LoadingButton>
            </CardActions>
          </Card>
        </Box>
      </Grid>      
    </Grid> 
  )
}

export default AdminLogin