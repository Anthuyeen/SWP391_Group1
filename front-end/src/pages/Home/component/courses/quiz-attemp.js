import React, { useEffect, useState } from 'react';
import { fetchQuizAttemptsByUserId } from './../../../../service/quiz'; // Import hàm fetch
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';
const QuizAttempt = () => {
    const [quizAttempts, setQuizAttempts] = useState([]);
    const userId = localStorage.getItem('id'); // Lấy userId từ localStorage
    const navigate = useNavigate(); // Khởi tạo useNavigate

    useEffect(() => {
        const getQuizAttempts = async () => {
            try {
                const data = await fetchQuizAttemptsByUserId(userId);
                setQuizAttempts(data); // Lưu trữ dữ liệu vào state
            } catch (error) {
                console.error('Failed to fetch quiz attempts:', error);
            }
        };

        getQuizAttempts(); // Gọi hàm fetch khi component mount
    }, [userId]);

    const handleAttemptClick = (attempt) => {
        navigate(`/quiz-attempt-detail/${attempt.id}`); // Điều hướng đến trang chi tiết
    };

    return (
        <>
            <Navbar />
            <Paper sx={{ padding: 2, minHeight: 'calc(100vh - 100px)' }}>
                <Typography variant="h5" gutterBottom>
                    Các lần làm bài kiểm tra
                </Typography>
                <List>
                    {quizAttempts.map((attempt) => (
                        <ListItem key={attempt.id} button onClick={() => handleAttemptClick(attempt)}>
                            <ListItemText
                                primary={`Lần thử: ${attempt.attemptNumber}`}
                                secondary={`Điểm: ${attempt.score}, Thời gian bắt đầu: ${new Date(attempt.startTime).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <Footer />
        </>
    );
};

export default QuizAttempt;
