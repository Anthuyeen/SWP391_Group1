import React, { useEffect, useState, useCallback, useRef    } from 'react';
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
import { fetchSubjectById, fetchSubjectProgress } from '../../../../service/subject';
import { fetchRegistrationStatus } from '../../../../service/enroll'; // Import hàm kiểm tra đăng ký
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { fetchLogin } from '../../../../service/authAPI';
import { jwtDecode } from 'jwt-decode';
import { fetchRegisterSubject } from '../../../../service/enroll'; // Import hàm fetchEnrollSubject từ service
import { useNavigate } from 'react-router-dom';
import QuizIcon from '@mui/icons-material/Quiz';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CheckCircle, CheckCircleOutline } from '@mui/icons-material';
import { fetchChapterProgress, fetchCompletedLessons } from '../../../../service/chapter';
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
    const [progress, setProgress] = useState(null);
    const [chapterProgress, setChapterProgress] = useState({});
    const [completedLessons, setCompletedLessons] = useState({});
    const navigate = useNavigate();

    const hasFetchedData = useRef(false); // Sử dụng useRef để theo dõi trạng thái đã fetch

    const loadCourse = useCallback(async () => {
        try {
            const data = await fetchSubjectById(courseId);
            setCourse(data);
        } catch (err) {
            setError('Error loading course');
        }
    }, [courseId]);

    const loadChapterProgress = useCallback(async () => {
        const userId = localStorage.getItem('id');
        if (userId && course) {
            const progressPromises = course.chapters.$values.map(chapter =>
                fetchChapterProgress(userId, chapter.id)
            );
            const progressResults = await Promise.all(progressPromises);
            const progressMap = progressResults.reduce((acc, progress, index) => {
                acc[course.chapters.$values[index].id] = progress.isComplete;
                return acc;
            }, {});
            setChapterProgress(progressMap);
        }
    }, [course]);

    const loadLessonProgress = useCallback(async () => {
        const userId = localStorage.getItem('id');
        if (!userId) {
            console.error("User ID is undefined. Please ensure the user is logged in.");
            return;
        }

        if (userId && course) {
            const completedLessonsPromises = course.chapters.$values.map(async (chapter) => {
                const lessons = await fetchCompletedLessons(chapter.id, userId);
                return { chapterId: chapter.id, lessons: lessons.$values };
            });
            const completedResults = await Promise.all(completedLessonsPromises);

            const lessonsMap = completedResults.reduce((acc, { chapterId, lessons }) => {
                acc[chapterId] = lessons.reduce((lessonAcc, lesson) => {
                    lessonAcc[lesson.id] = lesson.isCompleted;
                    return lessonAcc;
                }, {});
                return acc;
            }, {});

            setCompletedLessons(lessonsMap);
        }
    }, [course]);

    const checkProgress = useCallback(async () => {
        const userId = localStorage.getItem('id');
        if (userId) {
            try {
                const progressData = await fetchSubjectProgress(userId, courseId);
                setProgress(progressData.isComplete);
            } catch (err) {
                console.error('Error fetching subject progress:', err);
            }
        }
    }, [courseId]);

    const checkRegistration = useCallback(async () => {
        if (isLoggedIn) {
            const accId = localStorage.getItem('id');
            try {
                const status = await fetchRegistrationStatus(accId, courseId);
                if (status === "Bạn đã đăng ký môn học này") {
                    setIsRegistered(true);
                } else if (status === "Pending") {
                    setIsRegistered(false);
                    setRegistrationInfo("Bạn chưa thanh toán khóa học này");
                } else {
                    setIsRegistered(false);
                    setRegistrationInfo(status);
                }
            } catch (err) {
                console.error('Lỗi kiểm tra trạng thái đăng ký:', err);
            }
        }
    }, [courseId, isLoggedIn]);

    useEffect(() => {
        const fetchData = async () => {
            if (!hasFetchedData.current) { // Chỉ gọi khi chưa fetch
                await loadCourse();
                await checkRegistration();
                await checkProgress();

                if (course) {
                    await Promise.all([
                        loadChapterProgress(),
                        loadLessonProgress()
                    ]);
                }
                hasFetchedData.current = true; // Đánh dấu là đã fetch
            }
        };

        fetchData();
    }, [courseId, isLoggedIn, course]);

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

    const handleQuizDetailNavigate = (quizId) => {
        navigate(`/quiz/${quizId}`);  // Điều hướng đến trang chi tiết quiz theo quizId
    };

    const handleQuizAttemptsNavigate = () => {
        const userId = localStorage.getItem('id'); // Lấy userId từ localStorage
        navigate(`/quiz-attempt/${userId}`); // Điều hướng đến trang quiz-attempt với userId
    };
    // Tạo đối tượng groupedLessons để nhóm lessons theo ChapterId
    const groupedLessons = course?.lessons?.$values.reduce((acc, lesson) => {
        const chapterId = lesson.chapterId;
        if (!acc[chapterId]) acc[chapterId] = [];
        acc[chapterId].push(lesson);
        return acc;
    }, {});

    // Tính tổng số chương
    const totalChapters = course?.chapters?.$values.length || 0;
    // Tính tổng số bài học
    const totalLessons = Object.values(groupedLessons || {}).reduce(
        (acc, lessons) => acc + lessons.length,
        0
    );
    if (error) return <div>{error}</div>;
    if (!course) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2, mb: 10 }}>
                <Typography variant="h4" gutterBottom>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {course.name}
                        {isRegistered && (
                            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                                {progress ? (
                                    <CheckCircle sx={{ color: 'green', fontSize: 20 }} />
                                ) : (
                                    <CheckCircleOutline sx={{ color: 'gray', fontSize: 20 }} />
                                )}
                                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                    {progress ? 'Khóa học đã hoàn thành' : 'Khóa học chưa hoàn thành'}
                                </Typography>
                            </Box>
                        )}
                    </Box>
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
                {/* Hiển thị tổng số chương và bài học */}
                <Typography variant="body1" gutterBottom>
                    {`${totalChapters} Chương | ${totalLessons} Bài học`}
                </Typography>
                {course.chapters?.$values.map((chapter, index) => (
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {chapterProgress[chapter.id] ? ( // Kiểm tra tiến độ
                                    <CheckCircle sx={{ color: 'green', fontSize: 20, marginRight: 1 }} />
                                ) : (
                                    <CheckCircleOutline sx={{ color: 'gray', fontSize: 20, marginRight: 1 }} />
                                )}
                                <Typography>{`Chương ${index + 1}: ${chapter.title}`}</Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {groupedLessons[chapter.id]?.map((lesson, lessonIndex) => (
                                    <ListItem key={lessonIndex}>
                                        <ListItemIcon>
                                            {completedLessons[chapter.id]?.[lesson.id] ? (
                                                <CheckCircle sx={{ color: 'green' }} />
                                            ) : (
                                                <CheckCircleOutline sx={{ color: 'gray' }} />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText primary={`Bài ${lessonIndex + 1}: ${lesson.name}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
                <Typography variant="h6" gutterBottom>
                    Các bài kiểm tra
                    <IconButton
                        color="primary"
                        onClick={() => navigate('/quiz-attempt')} // Điều hướng đến trang quiz-attempt
                        sx={{ marginLeft: 2 }} // Thêm một chút khoảng cách bên trái
                    >
                        <ArrowForwardIcon />
                    </IconButton>
                </Typography>

                {course.quizzes?.$values.length > 0 ? (
                    <List>
                        {course.quizzes.$values.map((quiz, index) => (
                            <ListItem key={index} secondaryAction={
                                <IconButton
                                    edge="end"
                                    color="warning"
                                    onClick={() => handleQuizDetailNavigate(quiz.id)}  // Điều hướng theo quiz.id
                                >
                                    <QuizIcon />
                                </IconButton>
                            }>
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
