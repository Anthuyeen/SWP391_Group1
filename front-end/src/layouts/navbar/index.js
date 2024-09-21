import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, InputAdornment, ThemeProvider, createTheme, Box, Dialog, DialogTitle, DialogContent, IconButton, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { fetchLogin } from '../../service/authAPI';

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
    const navigate = useNavigate();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        let isValid = true;

        if (!email) {
            setEmailError('Email không được để trống');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Email không đúng định dạng');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Mật khẩu không được để trống');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (isValid) {
            try {
                const token = await fetchLogin(email, password);
                localStorage.setItem('token', token);

                const decodedToken = jwtDecode(token);
                const role = decodedToken.role;
                const expirationTime = decodedToken.exp * 1000;
                localStorage.setItem('expirationTime', expirationTime.toString());

                // Điều hướng dựa vào role
                if (role === 'Admin') {
                    navigate('/admin/home');
                } else if (role === 'Student') {
                    navigate('/user');
                } else if (role === 'Teacher') {
                    navigate('/expert/home');
                }

                handleClose();

                // Tự động đăng xuất khi token hết hạn
                setTimeout(() => {
                    handleLogout();
                }, expirationTime - Date.now());

            } catch (error) {
                console.error('Đăng nhập thất bại:', error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        navigate('/');
    };

    useEffect(() => {
        const checkTokenExpiration = () => {
            const expirationTime = localStorage.getItem('expirationTime');
            if (expirationTime && Date.now() > parseInt(expirationTime)) {
                handleLogout();
            }
        };

        checkTokenExpiration();

        const intervalId = setInterval(checkTokenExpiration, 60000); // Kiểm tra mỗi 60 giây
        return () => clearInterval(intervalId);
    }, []);

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
                                label="Email, hoặc số điện thoại"
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
