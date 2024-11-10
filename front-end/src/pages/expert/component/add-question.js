import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, TextField, Button, Checkbox, Box, Typography, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { addQuestionsToQuiz } from '../../../service/quiz';

const AddQuestion = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [newQuestion, setNewQuestion] = useState({
        content: '',
        mediaUrl: '',
        status: 'Active',
        answers: [{ content: '', isCorrect: false }],
    });

    const [errors, setErrors] = useState({
        content: '',
        mediaUrl: '',
        answers: []
    });

    const handleAddAnswer = () => {
        setNewQuestion((prev) => ({
            ...prev,
            answers: [...prev.answers, { content: '', isCorrect: false }],
        }));
        setErrors((prev) => ({
            ...prev,
            answers: [...prev.answers, '']
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
        setErrors((prev) => ({
            ...prev,
            answers: prev.answers.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        let hasError = false;
        const newErrors = { content: '', mediaUrl: '', answers: [] };

        if (!newQuestion.content.trim()) {
            newErrors.content = 'Nội dung câu hỏi không được để trống';
            hasError = true;
        }

        if (!newQuestion.mediaUrl.trim()) {
            newErrors.mediaUrl = 'Media URL không được để trống';
            hasError = true;
        }

        const answerErrors = newQuestion.answers.map(answer => {
            if (!answer.content.trim()) {
                hasError = true;
                return 'Đáp án không được để trống';
            }
            return '';
        });

        newErrors.answers = answerErrors;
        setErrors(newErrors);

        if (hasError) {
            return;
        }

        const questionsToAdd = [
            {
                content: newQuestion.content,
                mediaUrl: newQuestion.mediaUrl,
                status: newQuestion.status,
                answers: newQuestion.answers.map(answer => ({
                    content: answer.content,
                    isCorrect: answer.isCorrect,
                    status: answer.isCorrect
                })),
            },
        ];

        try {
            const response = await addQuestionsToQuiz(quizId, questionsToAdd);
            console.log('Response from API:', response);
            navigate(-1);
        } catch (error) {
            console.error('Error adding questions to quiz:', error);
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
                error={!!errors.content}
                helperText={errors.content}
                required
            />
            <TextField
                label="Media URL"
                variant="outlined"
                fullWidth
                value={newQuestion.mediaUrl}
                onChange={(e) => setNewQuestion({ ...newQuestion, mediaUrl: e.target.value })}
                sx={{ mb: 2 }}
                error={!!errors.mediaUrl}
                helperText={errors.mediaUrl}
                required
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
                        error={!!errors.answers[index]}
                        helperText={errors.answers[index]}
                        required
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
