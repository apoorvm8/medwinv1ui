import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import AdminLogin from './views/admin/auth/AdminLogin';
import {ThemeProvider} from '@mui/material';
import Dashboard from './views/admin/Dashboard';
import Home from './views/admin/pages/Home';
import Folder from './views/admin/pages/Folder';
import Customer from './views/admin/pages/Customer';
import CustomerEInvoice from './views/admin/pages/Customereinvoice';
import CustomerRegister from './views/admin/pages/CustomerRegister';
import theme from './theme';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GuestRoute from './components/shared/GuestRoute';
import CustomerStockAccess from './views/admin/pages/CustomerStockAccess';
import CustomerBackup from './views/admin/pages/CustomerBackup';
import CustomerWhatsapp from './views/admin/pages/CustomerWhatsapp';
import PageNotFound from './views/admin/pages/PageNotFound';

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path='/' element={<GuestRoute/>}>
              <Route path='/' element={<AdminLogin/>}/>
            </Route>
            <Route path='admin' element={<Dashboard/>}>
              <Route path='' element={<Home/>}/>
              <Route path='customer' element={<Customer/>}/>
              <Route path='customer/einvoice' element={<CustomerEInvoice/>}/>
              <Route path='customer/register' element={<CustomerRegister/>}/>
              <Route path='customer/backup' element={<CustomerBackup/>}/>
              <Route path='customer/stock-access' element={<CustomerStockAccess/>}/>
              <Route path='customer/whatsapp-access' element={<CustomerWhatsapp/>}/>
              <Route path='folder' element={<Folder/>}/>
            </Route>
            <Route path="*" element={<PageNotFound/>} />

          </Routes>
        </Router>
      </ThemeProvider>
      <ToastContainer/>
    </>
  );
}

export default App;
