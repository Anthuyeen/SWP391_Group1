import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  padding: theme.spacing(4, 0),
  marginTop: theme.spacing(8), //32px
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: '#ffffff',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const Footer = () => {
  return (
    <StyledFooter>
      <Container maxWidth="lg" >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <Box display="flex" alignItems="center" mb={2}>
           
              <Typography variant="h6">Online learning courses</Typography>
            </Box>
            <Typography variant="body2">Điện thoại: 0111111111</Typography>
            <Typography variant="body2">Email: contact@gmail.com</Typography>
            <Typography variant="body2">Địa chỉ: km29 Đại lộ Thăng Long, khu CNC Hòa Lạc</Typography>
          </Grid>
        </Grid>
      </Container>
    </StyledFooter>
  );
};

export default Footer;