import React, { useState, useEffect } from 'react';
import { fetchAllSubjects } from '../../../../service/subject';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Box
} from '@mui/material';
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';
import { useNavigate } from 'react-router-dom';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await fetchAllSubjects();
                setCourses(data);
            } catch (error) {
                console.error('Error loading courses:', error);
            }
        };
        loadCourses();
    }, []);

    const handleCourseClick = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Container maxWidth="lg" sx={{ flexGrow: 1, mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
                        Các khóa học
                    </Typography>
                    <Grid container spacing={3}>
                        {courses
                            .filter(course => course.status === 'Active') // Chỉ hiển thị những course có status là "Active"
                            .map(course => (
                                <Grid item xs={12} sm={6} md={4} key={course.id}>
                                    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={course.thumbnail || 'https://via.placeholder.com/300x140?text=No+Image'}
                                            alt={course.name}
                                            sx={{ objectFit: 'cover', cursor: 'pointer' }}
                                            onClick={() => handleCourseClick(course.id)}

                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="h2" gutterBottom>
                                                {course.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {course.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                    </Grid>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
};

export default CourseList;
