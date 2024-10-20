import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Typography,
    Box,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
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
import { fetchRegistrationStatus } from '../../../../service/enroll'; // Import hàm kiểm tra đăng ký
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { fetchLogin } from '../../../../service/authAPI';
import { jwtDecode } from 'jwt-decode';
import { fetchRegisterSubject } from '../../../../service/enroll'; // Import hàm fetchEnrollSubject từ service
import { useNavigate } from 'react-router-dom';
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
    const [registrationInfo, setRegistrationInfo] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false); // Thêm state để kiểm tra đã đăng ký
    const navigate = useNavigate();

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
        checkRegistration();
    }, [courseId, isLoggedIn]);
    const checkRegistration = async () => {
        if (isLoggedIn) {
            const accId = localStorage.getItem('id'); // Lấy accId từ localStorage
            try {
                const status = await fetchRegistrationStatus(accId, courseId);
                if (status === "Bạn đã đăng ký môn học này") {
                    setIsRegistered(true); // Người dùng đã đăng ký
                } else if (status === "Pending") {
                    setIsRegistered(false); // Người dùng chưa đăng ký
                    setRegistrationInfo("Bạn chưa thanh toán khóa học này"); // Lưu thông báo
                } else {
                    setIsRegistered(false); // Người dùng chưa đăng ký
                    setRegistrationInfo(status); // Lưu giá tiền môn học
                }
            } catch (err) {
                console.error('Lỗi kiểm tra trạng thái đăng ký:', err);
            }
        }
    };
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
            const accId = localStorage.getItem('id');
            try {
                const response = await fetchRegisterSubject(accId, courseId);
                setRegistrationInfo(response);
                setIsRegistered(true); // Cập nhật trạng thái sau khi đăng ký thành công
                await checkRegistration();
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
                {isRegistered ? (
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => navigate(`/lesson/${courseId}`)}  // Điều hướng tới trang khác
                        sx={{ marginBottom: 2 }}
                    >
                        ĐI đến khóa học
                    </Button>
                ) : registrationInfo === "Bạn chưa thanh toán khóa học này" ? (
                    <Typography variant="h6" color="red" sx={{ marginBottom: 2 }}>
                        Bạn chưa thanh toán khóa học này
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

                {/* {course.dimensions?.$values.map((chapter, index) => (
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
                ))} */}

                <Accordion>
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
                <Typography variant="h6" gutterBottom>
                    Các bài kiểm tra
                </Typography>
                {course.quizzes?.$values.length > 0 ? (
                    <List>
                        {course.quizzes.$values.map((quiz, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    <Article />
                                </ListItemIcon>
                                <ListItemText primary={quiz.name} secondary={`Thời gian: ${quiz.durationMinutes} phút`} />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" color="gray">
                        Không có bài kiểm tra nào cho khóa học này.
                    </Typography>
                )}

            </Box>
            <Footer />

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
