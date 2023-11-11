import React from 'react'
import { Button, CircularProgress } from '@mui/material';

function LoadingButton({color, isLoading, text, startIcon, endIcon, variant, type, spinnerStyles, size, onClick}) {
    const styles = spinnerStyles || {
        spinner: {
            '.MuiCircularProgress-circle': {
                color: 'grey'
            },
            marginLeft: '1rem',
        }
    }

    return (
    <>
        {
            isLoading ? (        
                <Button onClick={onClick} color={color} size={size} variant={variant} startIcon={startIcon} endIcon={endIcon} type={type} disabled={true}>
                    {text} <CircularProgress sx={styles.spinner} size='1.2rem' />
                </Button>
            ) : (
                <Button onClick={onClick} color={color} size={size} variant={variant} startIcon={startIcon} endIcon={endIcon} type={type}>
                    {text}
                </Button>
            )
        }
    </>
  )
}

export default LoadingButton