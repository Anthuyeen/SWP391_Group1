import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, InputAdornment, ThemeProvider, createTheme, Box, Dialog, DialogTitle, DialogContent, IconButton, Grid, Select, MenuItem, } from '@mui/material';
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
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
    const [userName, setUserName] = useState(''); // Trạng thái tên người dùng
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

    const handleOpenLogin = () => {
        // Xóa giá trị của email, password và các lỗi trước đó khi mở lại form
        setEmail('');
        setPassword('');
        setEmailError('');
        setPasswordError('');
        setOpenLogin(true);
    };

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
                const nameAcc = decodedToken.Name;

                localStorage.setItem('expirationTime', expirationTime.toString());
                localStorage.setItem('role', role);
                localStorage.setItem('id', userId);
                localStorage.setItem('name', nameAcc);

                // Cập nhật trực tiếp trạng thái đăng nhập và tên người dùng
                setIsLoggedIn(true);
                setUserName(nameAcc);

                // Điều hướng dựa vào role
                if (role === 'Admin') {
                    navigate('/admin/home');
                } else if (role === 'Student') {
                    navigate('/');
                } else if (role === 'Teacher') {
                    navigate('/expert/home');
                }

                handleCloseLogin();
            } catch (error) {
                console.error('Đăng nhập thất bại:', error);
            }
        }
    };


    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserName('');

        // Xóa giá trị của email, password và các lỗi khi đăng xuất
        setEmail('');
        setPassword('');
        setEmailError('');
        setPasswordError('');

        navigate('/');
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            const storedName = localStorage.getItem('name');
            if (storedName) {
                setUserName(storedName);
            }
        }
    }, []);

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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            color="inherit"
                            sx={{ color: 'primary.main', backgroundColor: 'transparent', textTransform: 'none' }}
                            onClick={() => navigate('/')} // Điều hướng về trang chính khi nhấp vào
                        >
                            <Typography variant="h6" component="div">
                                Online learning course
                            </Typography>
                        </Button>

                        <Button
                            color="inherit"
                            sx={{ textTransform: 'none' }}
                            onClick={() => navigate('/experts')} // Điều hướng đến trang Chuyên gia
                        >
                            Chuyên gia
                        </Button>
                        <Button
                            color="inherit"
                            sx={{ textTransform: 'none' }}
                            onClick={() => navigate('/courses')} // Điều hướng đến trang Khóa học
                        >
                            Khóa học
                        </Button>
                    </Box>

                    <TextField
                        sx={{ width: '30%', maxWidth: '300px', ml: 50 }} // Thêm marginLeft vào search bar
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

                    {isLoggedIn ? (
                        <div>
                            <Button
                                variant="body1"
                                sx={{ display: 'inline', mr: 2 }}
                                onClick={() => navigate('/UserProfile')}
                            >
                                Xin chào, {userName}
                            </Button>
                            <Button color="inherit" sx={{ textTransform: 'none' }} onClick={handleLogout}>
                                Đăng xuất
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <Button color="inherit" sx={{ textTransform: 'none', mr: 1 }} onClick={() => setOpenRegister(true)}>
                                Đăng ký
                            </Button>
                            <Button color="inherit" sx={{ textTransform: 'none' }} onClick={handleOpenLogin}>
                                Đăng nhập
                            </Button>
                        </div>
                    )}
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
            <Dialog open={openRegister} onClose={handleCloseRegister} maxWidth="xs" fullWidth >
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
                                required
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
                                required
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
                                required
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
                                required
                            />
                        </Grid>
                        <Grid item>
                            <Select
                                fullWidth
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                displayEmpty
                                margin="dense"
                                required
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
                                required
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Tên đệm"
                                fullWidth
                                margin="dense"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Tên"
                                fullWidth
                                margin="dense"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
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
