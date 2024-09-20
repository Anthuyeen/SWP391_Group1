import React from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, InputAdornment, ThemeProvider, createTheme, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Cấu hình theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#ff5722', // Màu sắc chính cho các nút và các thành phần
        },
        background: {
            default: '#fff' // Màu nền cho AppBar
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'transparent', // Hiệu ứng khi hover lên nút
                    }
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined', // Dạng biên của TextField
                size: 'small', // Kích thước của TextField
            }
        }
    }
});

const Navbar = () => {
    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" color="default" sx={{ backgroundColor: 'background.default', boxShadow: 'none' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button color="inherit" sx={{ color: 'primary.main', backgroundColor: 'transparent', textTransform: 'none' }}>
                        <Typography variant="h6" component="div">
                            Online learning course
                        </Typography>
                    </Button>
                    <TextField
                        sx={{ width: '40%', maxWidth: '500px' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button sx={{ minWidth: '40px', padding: 0 }}>×</Button>
                                </InputAdornment>
                            )
                        }}
                    />
                    <div>
                        <Button color="inherit" sx={{ color: 'primary.main', backgroundColor: 'transparent', textTransform: 'none', mr: 1 }}>
                            Đăng ký
                        </Button>
                        <Button color="inherit" sx={{ color: 'primary.main', backgroundColor: 'transparent', textTransform: 'none' }}>
                            Đăng nhập
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Box sx={{ height: '1px', backgroundColor: 'grey.500' }} />
        </ThemeProvider>
    );
};

export default Navbar;
