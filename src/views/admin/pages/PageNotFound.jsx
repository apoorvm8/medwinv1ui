import React, {Fragment} from 'react'
import { Box, Typography } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const PageNotFound = () => {
  return (
    <Fragment>
        <Box sx={{display: 'flex',  justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <SentimentVeryDissatisfiedIcon sx={{fontSize: '5rem', mr: '1rem'}}/>
            <Typography variant="h2">404, Page Not Found</Typography>
        </Box>
    </Fragment>
  )
}

export default PageNotFound