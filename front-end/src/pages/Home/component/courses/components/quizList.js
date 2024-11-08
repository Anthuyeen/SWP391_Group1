import React from 'react';
import { Typography, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import QuizIcon from '@mui/icons-material/Quiz';
import Article from '@mui/icons-material/Article';

export const QuizList = ({ quizzes, navigate }) => {
    const handleQuizDetailNavigate = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };
    const publishedQuizzes = quizzes?.filter(quiz => quiz.status === "Published") || [];

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Các bài kiểm tra
                <IconButton
                    color="primary"
                    onClick={() => navigate('/quiz-attempt')}
                    sx={{ marginLeft: 2 }}
                >
                    <ArrowForwardIcon />
                </IconButton>
            </Typography>
            {publishedQuizzes.length > 0 ?(
                <List>
                    {publishedQuizzes.map((quiz, index) => (
                        <ListItem key={index} secondaryAction={
                            <IconButton
                                edge="end"
                                color="warning"
                                onClick={() => handleQuizDetailNavigate(quiz.id)}
                            >
                                <QuizIcon />
                            </IconButton>
                        }>
                            <ListItemIcon>
                                <Article />
                            </ListItemIcon>
                            <ListItemText 
                                primary={quiz.name} 
                                secondary={`Thời gian: ${quiz.durationMinutes} phút`} 
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2" color="gray">
                    Không có bài kiểm tra nào cho khóa học này.
                </Typography>
            )}
        </>
    );
};