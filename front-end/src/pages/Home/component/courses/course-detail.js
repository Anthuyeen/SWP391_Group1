import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Navbar from '../../../../layouts/navbar'; // Import Navbar nếu bạn có
import Footer from '../../../../layouts/footer' // Import Footer nếu bạn có
// Tách phần xử lý authentication ra một custom hook riêng
import { useAuth } from './hooks/useAuth';
// Tách phần xử lý course data ra một custom hook riêng
import { useCourseData } from './hooks/useCourseData';
import { LoginDialog } from './components/loginDialog';
import { CourseHeader } from './components/courseHeader';
import { ChapterList } from './components/chapterList';
import { QuizList } from './components/quizList';

const CourseOverview = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    
    // Custom hook xử lý authentication
    const { 
        isLoggedIn, 
        openLogin, 
        handleOpenLogin, 
        handleCloseLogin,
        handleLogin 
    } = useAuth();

    // Custom hook xử lý course data
    const {
        course,
        error,
        isRegistered,
        registrationInfo,
        progress,
        chapterProgress,
        completedLessons,
        handleRegisterClick,
        groupedLessons
    } = useCourseData(courseId, isLoggedIn);

    if (error) return <div>{error}</div>;
    if (!course) return <div>Loading...</div>;

    const totalChapters = course.chapters?.$values.length || 0;
    const totalLessons = Object.values(groupedLessons || {}).reduce(
        (acc, lessons) => acc + lessons.length,
        0
    );

    return (
        <>
            <Navbar />
            <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2, mb: 10, minHeight: 'calc(100vh - 100px)' }}>
                <CourseHeader 
                    course={course}
                    isRegistered={isRegistered}
                    progress={progress}
                    registrationInfo={registrationInfo}
                    handleRegisterClick={handleRegisterClick}
                    navigate={navigate}
                />

                <Typography variant="body1" paragraph>
                    {course.description}
                </Typography>

                <Typography variant="h6" gutterBottom>
                    Nội dung khóa học
                </Typography>
                
                <Typography variant="body1" gutterBottom>
                    {`${totalChapters} Chương | ${totalLessons} Bài học`}
                </Typography>

                <ChapterList 
                    chapters={course.chapters?.$values}
                    groupedLessons={groupedLessons}
                    chapterProgress={chapterProgress}
                    completedLessons={completedLessons}
                />

                <QuizList 
                    quizzes={course.quizzes?.$values}
                    navigate={navigate}
                />
            </Box>
            
            <LoginDialog 
                open={openLogin}
                onClose={handleCloseLogin}
                onLogin={handleLogin}
            />
            
            <Footer />
        </>
    );
};

export default CourseOverview;
