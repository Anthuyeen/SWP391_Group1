import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, TextField, InputAdornment,
    ThemeProvider, createTheme, Box, Dialog, DialogTitle, DialogContent,
    IconButton, Grid, DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';

// Cấu hình theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#ff5722',
        },
        background: {
            default: '#fff'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'transparent',
                    }
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
            }
        }
    }
});

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Hàm mở modal
    const handleOpen = () => setOpen(true);

    // Hàm đóng modal
    const handleClose = () => setOpen(false);

    // Hàm toggle hiển thị mật khẩu
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    // Hàm kiểm tra định dạng email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Hàm submit form
    const handleLogin = () => {
        let isValid = true;

        // Kiểm tra email
        if (!email) {
            setEmailError('Email không được để trống');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Email không đúng định dạng');
            isValid = false;
        } else {
            setEmailError('');
        }

        // Kiểm tra mật khẩu
        if (!password) {
            setPasswordError('Mật khẩu không được để trống');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (isValid) {
            // Gọi API hoặc xử lý đăng nhập
            console.log('Đăng nhập thành công');
            handleClose(); // Đóng modal sau khi đăng nhập thành công
        }
    };

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
                        <Button color="inherit" sx={{ color: 'primary.main', backgroundColor: 'transparent', textTransform: 'none' }} onClick={handleOpen}>
                            Đăng nhập
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Box sx={{ height: '1px', backgroundColor: 'grey.500' }} />

            {/* Modal đăng nhập */}
            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Đăng nhập
                    <IconButton edge="end" color="inherit" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                margin="dense"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!emailError}
                                helperText={emailError}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Mật khẩu"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                margin="dense"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!passwordError}
                                helperText={passwordError}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={togglePasswordVisibility}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ marginTop: 2 }}
                                onClick={handleLogin}
                            >
                                Đăng nhập
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
};

export default Navbar;
