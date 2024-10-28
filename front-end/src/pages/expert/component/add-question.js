import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Checkbox, Box, Typography, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { addQuestionsToQuiz } from '../../../service/quiz'; // Đường dẫn đến file chứa hàm addQuestionsToQuiz

const AddQuestion = () => {
    const { quizId } = useParams(); // Lấy quizId từ URL
    const navigate = useNavigate();
    const [newQuestion, setNewQuestion] = useState({
        content: '',
        mediaUrl: '',
        status: 'Active', // Mặc định trạng thái là Active
        answers: [{ content: '', isCorrect: false }],
    });

    const handleAddAnswer = () => {
        setNewQuestion((prev) => ({
            ...prev,
            answers: [...prev.answers, { content: '', isCorrect: false }],
        }));
    };

    const handleAnswerChange = (index, value) => {
        const updatedAnswers = newQuestion.answers.map((answer, i) =>
            i === index ? { ...answer, content: value } : answer
        );
        setNewQuestion((prev) => ({ ...prev, answers: updatedAnswers }));
    };

    const handleCheckboxChange = (index) => {
        const updatedAnswers = newQuestion.answers.map((answer, i) =>
            i === index ? { ...answer, isCorrect: !answer.isCorrect } : answer
        );
        setNewQuestion((prev) => ({ ...prev, answers: updatedAnswers }));
    };

    const handleDeleteAnswer = (index) => {
        const updatedAnswers = newQuestion.answers.filter((_, i) => i !== index);
        setNewQuestion((prev) => ({ ...prev, answers: updatedAnswers }));
    };

    const handleSubmit = async () => {
        // Tạo mảng mới cho các câu hỏi
        const questionsToAdd = [
            {
                content: newQuestion.content,
                mediaUrl: newQuestion.mediaUrl,
                status: newQuestion.status,
                answers: newQuestion.answers.map(answer => ({
                    content: answer.content,
                    isCorrect: answer.isCorrect,
                    status: answer.isCorrect // Nếu isCorrect là true, status cũng là true
                })),
            },
        ];

        try {
            const response = await addQuestionsToQuiz(quizId, questionsToAdd); // Gọi hàm thêm câu hỏi
            console.log('Response from API:', response);
            navigate(-1); // Điều hướng trở lại màn hình câu hỏi
        } catch (error) {
            console.error('Error adding questions to quiz:', error);
            // Bạn có thể hiển thị thông báo lỗi cho người dùng ở đây
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5">Thêm Câu Hỏi</Typography>
            <TextField
                label="Nội dung câu hỏi"
                variant="outlined"
                fullWidth
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Media URL"
                variant="outlined"
                fullWidth
                value={newQuestion.mediaUrl}
                onChange={(e) => setNewQuestion({ ...newQuestion, mediaUrl: e.target.value })}
                sx={{ mb: 2 }}
            />
            <Typography variant="h6">Đáp án</Typography>
            {newQuestion.answers.map((answer, index) => (
                <Box display="flex" alignItems="center" key={index}>
                    <Checkbox
                        checked={answer.isCorrect}
                        onChange={() => handleCheckboxChange(index)}
                    />
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={answer.content}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button onClick={() => handleDeleteAnswer(index)} color="error">
                        <DeleteIcon />
                    </Button>
                </Box>
            ))}
            <Button variant="contained" onClick={handleAddAnswer}>
                Thêm Đáp Án
            </Button>
            <DialogActions>
                <Button onClick={() => navigate(-1)}>Hủy</Button>
                <Button onClick={handleSubmit} color="primary">
                    Lưu
                </Button>
            </DialogActions>
        </Container>
    );
};

export default AddQuestion;
