import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    TextField,
    InputAdornment,
    ThemeProvider,
    createTheme,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Grid,
    Select,
    MenuItem,
} from '@mui/material';
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
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Đăng ký các trạng thái
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');

    // Thêm trạng thái cho lỗi xác nhận mật khẩu
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const navigate = useNavigate();

    const handleOpenLogin = () => setOpenLogin(true);
    const handleCloseLogin = () => setOpenLogin(false);
    
    const handleOpenRegister = () => setOpenRegister(true);
    const handleCloseRegister = () => setOpenRegister(false);
    
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
                const userId = decodedToken.Id;
                const role = decodedToken.role;
                const expirationTime = decodedToken.exp * 1000;
                localStorage.setItem('expirationTime', expirationTime.toString());
                localStorage.setItem('role', role);
                localStorage.setItem('id', userId);
                const nameAcc = decodedToken.Name;
                localStorage.setItem('name', nameAcc);
                
                // Điều hướng dựa vào role
                if (role === 'Admin') {
                    navigate('/admin/home');
                } else if (role === 'Student') {
                    navigate('/user');
                } else if (role === 'Teacher') {
                    navigate('/expert/home');
                }

                handleCloseLogin();
                // Tự động đăng xuất khi token hết hạn
                // setTimeout(() => {
                //     handleLogout();
                // }, expirationTime - Date.now());
                setTimeout(() => {
                    handleLogout();
                }, 36000000);
            } catch (error) {
                console.error('Đăng nhập thất bại:', error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        localStorage.removeItem('name');
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

    const handleRegister = () => {
        let isValid = true;
        setConfirmPasswordError(''); // Reset lỗi xác nhận mật khẩu

        // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
        if (regPassword !== regConfirmPassword) {
            setConfirmPasswordError('Mật khẩu không khớp');
            isValid = false;
        }

        // Kiểm tra các trường khác có hợp lệ không (nếu cần)
        if (!regEmail) {
            isValid = false; // Hoặc có thể thêm thông báo lỗi cho email
        }

        if (isValid) {
            // Logic xử lý đăng ký tại đây
            console.log({
                regEmail,
                regPassword,
                phoneNumber,
                gender,
                firstName,
                middleName,
                lastName,
            });
            // Đóng dialog đăng ký sau khi xử lý
            handleCloseRegister();
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" color="default" sx={{ backgroundColor: 'background.default', boxShadow: 'none' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button color="inherit" sx={{ color: 'primary.main', backgroundColor: 'transparent', textTransform: 'none' }}>
                    <Typography
                        variant="h6"
                        component="div"
                        onClick={() => navigate('/')} // Điều hướng về trang chính khi nhấp vào
                    >
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
                        <Button color="inherit" sx={{ color: 'primary.main', backgroundColor: 'transparent', textTransform: 'none', mr: 1 }} onClick={handleOpenRegister}>
                            Đăng ký
                        </Button>
                        <Button color="inherit" sx={{ color: 'primary.main', backgroundColor: 'transparent', textTransform: 'none' }} onClick={handleOpenLogin}>
                            Đăng nhập
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Box sx={{ height: '1px', backgroundColor: 'grey.500' }} />

            {/* Modal đăng nhập */}
            <Dialog open={openLogin} onClose={handleCloseLogin} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Đăng nhập
                    <IconButton edge="end" color="inherit" onClick={handleCloseLogin}>
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

            {/* Modal đăng ký */}
            <Dialog open={openRegister} onClose={handleCloseRegister} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Đăng ký
                    <IconButton edge="end" color="inherit" onClick={handleCloseRegister}>
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
                                value={regEmail}
                                onChange={(e) => setRegEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Mật khẩu"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                margin="dense"
                                value={regPassword}
                                onChange={(e) => setRegPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Xác nhận mật khẩu"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                margin="dense"
                                value={regConfirmPassword}
                                onChange={(e) => setRegConfirmPassword(e.target.value)}
                                error={!!confirmPasswordError}
                                helperText={confirmPasswordError}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Số điện thoại"
                                type="tel"
                                fullWidth
                                margin="dense"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <Select
                                fullWidth
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                displayEmpty
                                margin="dense"
                            >
                                <MenuItem value="">
                                    <em>Giới tính</em>
                                </MenuItem>
                                <MenuItem value="Nam">Nam</MenuItem>
                                <MenuItem value="Nữ">Nữ</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Họ"
                                fullWidth
                                margin="dense"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Tên đệm"
                                fullWidth
                                margin="dense"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Tên"
                                fullWidth
                                margin="dense"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ marginTop: 2 }}
                                onClick={handleRegister}
                            >
                                Đăng ký
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
};

export default Navbar;
