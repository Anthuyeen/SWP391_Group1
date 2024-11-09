import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { fetchQuizAttemptById, fetchQuizDetails } from './../../../../service/quiz'; // Import các hàm fetch
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';
const QuizAttemptDetail = () => {
    const { attemptId } = useParams(); // Lấy attemptId từ URL
    const [quizAttempt, setQuizAttempt] = useState(null);
    const [quizDetails, setQuizDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getQuizAttemptDetails = async () => {
            try {
                const data = await fetchQuizAttemptById(attemptId); // Lấy thông tin lần làm bài kiểm tra
                console.log('Quiz attempt fetched:', data); // Kiểm tra dữ liệu
                setQuizAttempt(data);
                if (data.userAnswers) {
                    const quizData = await fetchQuizDetails(data.quizId); // Lấy chi tiết quiz
                    setQuizDetails(quizData);
                }
            } catch (err) {
                console.error('Failed to fetch quiz attempt:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getQuizAttemptDetails();
    }, [attemptId]);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!quizAttempt) return <Typography>Không có dữ liệu cho lần làm bài này.</Typography>;

    return (
        <>
            <Navbar />
            <Paper sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Chi tiết lần làm bài kiểm tra
                </Typography>
                <Typography variant="h6">Lần làm bài: {quizAttempt.attemptNumber}</Typography>
                <Typography variant="body1">Điểm: {quizAttempt.score}</Typography>
                {quizDetails && quizDetails.questions && Array.isArray(quizDetails.questions.$values) ? (
                    <List>
                        {quizDetails.questions.$values.map((question) => {
                            const userAnswer = quizAttempt.userAnswers.$values.find(
                                answer => answer.questionId === question.id
                            );

                            return (
                                <Paper key={question.id} sx={{ padding: 2, margin: '10px 0' }}>
                                    <Typography variant="body1">{question.content}</Typography>
                                    <List>
                                        {question.answers.$values.map((answer) => {
                                            const isCorrect = answer.isCorrect; // Kiểm tra xem câu trả lời có đúng không
                                            const isUserAnswer = userAnswer && userAnswer.answerOptionId === answer.id; // Kiểm tra xem người dùng đã chọn câu trả lời này chưa

                                            return (
                                                <ListItem key={answer.id}>
                                                    <ListItemText
                                                        primary={
                                                            isCorrect ? `✔ ${answer.content}` : isUserAnswer ? `✖ ${answer.content}` : answer.content
                                                        }
                                                        sx={{
                                                            color: isCorrect ? 'green' : isUserAnswer ? 'red' : 'inherit',
                                                        }}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Paper>
                            );
                        })}
                    </List>
                ) : (
                    <Typography variant="body2" color="error">
                        Không có dữ liệu câu hỏi cho lần làm bài này.
                    </Typography>
                )}
            </Paper>
            <Footer />
        </>
    );
};

export default QuizAttemptDetail;
