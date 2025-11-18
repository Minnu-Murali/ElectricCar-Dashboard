import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Layout = ({ children }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#223046f3' }}>
        <Toolbar sx={{ position: 'relative', width: '100%' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            BMW Electric Cars Dashboard
          </Typography>

          <Box sx={{ marginLeft: 'auto' }}>
            <img
              src="/bmw-logo.png"
              alt="BMW Logo"
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'contain',
              }}
            />
          </Box>

        </Toolbar>
      </AppBar>

      <Box component="main">{children}</Box>
    </Box>
  );
};

export default Layout;
