import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Grid,
    TextField,
    InputAdornment
} from '@mui/material';
import { ExpandMore, PlayCircleOutline, Article } from '@mui/icons-material';
import { fetchSubjectById } from '../../../../service/subject';
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { fetchLogin } from '../../../../service/authAPI';
import { jwtDecode } from 'jwt-decode';
import { fetchRegisterSubject } from '../../../../service/enroll'; // Import hàm fetchEnrollSubject từ service

const CourseOverview = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);
    const [openLogin, setOpenLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [registrationInfo, setRegistrationInfo] = useState(null); // State lưu thông tin đăng ký

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const data = await fetchSubjectById(courseId);
                setCourse(data);
            } catch (err) {
                setError('Error loading course');
            }
        };

        loadCourse();
    }, [courseId]);

    const handleOpenLogin = () => {
        setEmail('');
        setPassword('');
        setEmailError('');
        setPasswordError('');
        setOpenLogin(true);
    };

    const handleCloseLogin = () => setOpenLogin(false);
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

                setIsLoggedIn(true);
                handleCloseLogin();
            } catch (error) {
                console.error('Đăng nhập thất bại:', error);
            }
        }
    };

    const handleRegisterClick = async () => {
        if (!isLoggedIn) {
            handleOpenLogin();
        } else {
            // Gọi API để đăng ký môn học
            const accId = localStorage.getItem('id'); // Lấy accId từ localStorage
            try {
                const response = await fetchRegisterSubject(accId, courseId); // Gọi API đăng ký
                setRegistrationInfo(response); // Lưu thông tin đăng ký vào state
            } catch (error) {
                console.error('Đăng ký thất bại:', error);
            }
        }
    };

    if (error) return <div>{error}</div>;
    if (!course) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2, mb: 10 }}>
                <Typography variant="h4" gutterBottom>
                    {course.name}
                </Typography>

                {registrationInfo ? (
                    <Typography variant="h6" color="green" sx={{ marginBottom: 2 }}>
                        ĐÃ ĐĂNG KÍ
                    </Typography>
                ) : (
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleRegisterClick}
                        sx={{ marginBottom: 2 }}
                    >
                        Đăng ký
                    </Button>
                )}

                <Typography variant="body1" paragraph>
                    {course.description}
                </Typography>

                <Typography variant="h6" gutterBottom>
                    Nội dung khóa học
                </Typography>
                <Typography variant="body2" gutterBottom>
                    {`${course.dimensions?.$values.length || 0} chương • ${course.lessons?.$values.length || 0} bài học`}
                </Typography>

                {course.dimensions?.$values.map((chapter, index) => (
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography>{`${index + 1}. ${chapter.name}`}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {course.lessons?.$values.map((lesson, lessonIndex) => (
                                    <ListItem key={lessonIndex}>
                                        <ListItemIcon>
                                            {lesson.status === 'Active' ? <PlayCircleOutline /> : <Article />}
                                        </ListItemIcon>
                                        <ListItemText primary={lesson.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
            <Footer />

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
                                color="warning"
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
        </>
    );
};

export default CourseOverview;
