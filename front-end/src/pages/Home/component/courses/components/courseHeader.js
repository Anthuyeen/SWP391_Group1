import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';

export const CourseHeader = ({ course, isRegistered, progress, registrationInfo, handleRegisterClick, navigate }) => {
    return (
        <>
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
                    onClick={() => navigate(`/lesson/${course.id}`)}
                    sx={{ marginBottom: 2 }}
                >
                    Đi đến khóa học
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
        </>
    );
};