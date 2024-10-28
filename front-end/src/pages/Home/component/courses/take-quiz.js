import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Checkbox, Typography, Box, Grid } from '@mui/material';
import { fetchQuizDetails, submitQuiz } from './../../../../service/quiz';
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';
import { fetchChapterCompletion } from './../../../../service/chapter';

const TakeQuiz = () => {
    const { quizId } = useParams(); // Lấy quizId từ URL
    const navigate = useNavigate(); // Hook để điều hướng
    const [quizData, setQuizData] = useState(null);
    const [showQuestions, setShowQuestions] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null); // State cho thời gian đếm ngược
    const [selectedAnswers, setSelectedAnswers] = useState([]); // Lưu câu trả lời của người dùng
    const userId = localStorage.getItem('id'); // Giả định userId, bạn có thể lấy từ context hoặc state

    useEffect(() => {
        // Lấy dữ liệu quiz từ API
        const fetchData = async () => {
            const data = await fetchQuizDetails(quizId);
            setQuizData(data);
        };
        fetchData();
    }, [quizId]);

    useEffect(() => {
        // Bắt đầu đếm ngược nếu đã bắt đầu làm bài và có thời gian
        let timer;
        if (timeLeft !== null && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Thời gian đã hết, tự động nộp bài kiểm tra
            clearInterval(timer);
            handleSubmitQuiz();
        }
        return () => clearInterval(timer); // Clear interval khi component unmount
    }, [timeLeft]);

    const handleStartQuiz = () => {
        setShowQuestions(true); // Hiển thị câu hỏi khi bấm nút
        setTimeLeft(quizData.durationMinutes * 60); // Đặt thời gian đếm ngược theo phút
    };

    const handleAnswerChange = (questionId, answerId) => {
        // Cập nhật câu trả lời đã chọn
        setSelectedAnswers((prevAnswers) => {
            const existingAnswer = prevAnswers.find(answer => answer.questionId === questionId);
            if (existingAnswer) {
                return prevAnswers.map(answer =>
                    answer.questionId === questionId ? { questionId, selectedAnswerId: answerId } : answer
                );
            } else {
                return [...prevAnswers, { questionId, selectedAnswerId: answerId }];
            }
        });
    };

    const handleSubmitQuiz = async () => {
        const startTime = new Date().toISOString(); // Thời gian bắt đầu làm bài
        try {
            const response = await submitQuiz(quizId, userId, startTime, selectedAnswers);
            
            if (response) {
                if (response.isPassed) { // Nếu người dùng vượt qua bài kiểm tra
                    // Gọi API hoàn thành chương
                    const completionData = {
                        userId,
                        chapterId: quizData.chapterId, // Lấy chapterId từ dữ liệu quiz
                        subjectId: quizData.subjectId, // Lấy subjectId từ dữ liệu quiz
                        completionDate: new Date().toISOString(),
                        status: true
                    };
                    
                    // Kiểm tra nếu người dùng đã hoàn thành khóa học
                    try {
                        await fetchChapterCompletion(completionData);
                    } catch (error) {
                        // Kiểm tra lỗi và xử lý trường hợp 409
                        if (error.message === "User already completed course") {
                            // Nếu nhận được thông báo này, quay lại trang trước mà không làm gì cả
                            console.log("Người dùng đã hoàn thành khóa học. Quay lại trang trước.");
                            navigate(-1); // Quay lại trang trước đó
                            return; // Dừng thực thi hàm
                        } else {
                            // Nếu có lỗi khác, thông báo cho người dùng
                            console.error("Error completing chapter:", error);
                            alert("Có lỗi xảy ra khi hoàn thành chương!");
                        }
                    }
                }
                navigate(-1); // Quay lại trang trước đó
            }
        } catch (error) {
            console.error("Error submitting quiz:", error);
            alert("Có lỗi xảy ra khi nộp bài!");
        }
    };
    
    
    
    
    // Hàm hiển thị thời gian đếm ngược
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; // Định dạng MM:SS
    };

    return (
        <>
            <Navbar />
            <Box sx={{ p: 3, minHeight: 'calc(100vh - 100px)' }}>
                {quizData ? (
                    <>
                        <Typography variant="h4">{quizData.name}</Typography>
                        {showQuestions ? (
                            <Typography variant="subtitle1">
                                Thời gian còn lại: {formatTime(timeLeft)}
                            </Typography>
                        ) : (
                            <Typography variant="subtitle1">
                                Thời gian làm bài: {quizData.durationMinutes} phút
                            </Typography>
                        )}

                        {!showQuestions && ( // Ẩn nút khi đã bấm "Làm bài kiểm tra"
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleStartQuiz}
                                sx={{ mt: 2 }}
                            >
                                Làm bài kiểm tra
                            </Button>
                        )}

                        {showQuestions && (
                            <Box sx={{ mt: 3 }}>
                                {quizData.questions.$values.map((question, index) => (
                                    <Box key={question.id} sx={{ mb: 2 }}>
                                        <Typography variant="h6">
                                            Câu {index + 1}: {question.content}
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {question.answers.$values.map((answer) => (
                                                <Grid item xs={12} sm={6} key={answer.id}>
                                                    <Box display="flex" alignItems="center">
                                                        <Checkbox
                                                            onChange={() => handleAnswerChange(question.id, answer.id)}
                                                        />
                                                        <Typography>{answer.content}</Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                ))}

                                {/* Nút nộp bài */}
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleSubmitQuiz}
                                    sx={{ mt: 2 }}
                                >
                                    Nộp bài kiểm tra
                                </Button>
                            </Box>
                        )}
                    </>
                ) : (
                    <Typography>Đang tải dữ liệu...</Typography>
                )}
            </Box>
            <Footer />
        </>
    );
};
export default TakeQuiz;
