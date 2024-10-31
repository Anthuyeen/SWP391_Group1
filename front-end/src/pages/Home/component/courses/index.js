import React, { useEffect, useState } from 'react';
import { fetchAllSubjects } from '../../../../service/subject'; // Đảm bảo đường dẫn đúng
import { Box, Grid, Typography, Card, CardContent, CardMedia, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng

const CourseCard = ({ course }) => {
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleCardClick = () => {
        navigate(`/course/${course.id}`); // Điều hướng đến trang chi tiết khóa học
    };

    return (
        <Card
            sx={{
                cursor: 'pointer',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: 'none',
                backgroundColor: '#f7f7f7',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
            onClick={handleCardClick} // Gọi hàm điều hướng khi nhấn vào card
        >
            <CardMedia
                component="img"
                image={course.thumbnail || 'default_thumbnail.png'} // Thay ảnh mặc định nếu không có thumbnail
                alt={course.name}
                sx={{
                    height: 140,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                        {course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {course.ownerName} {/* Hiển thị tên người sở hữu */}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#f15123' }}>
                        {course.price || 'Miễn phí'} {/* Thay giá nếu không có */}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

const CourseDisplay = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await fetchAllSubjects();
                setCourses(data || []); // Đảm bảo rằng courses luôn là một mảng
            } catch (e) {
                setError('Unable to fetch courses');
            }
            setLoading(false);
        };

        loadCourses();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Khóa học miễn phí
            </Typography>
            <Grid container spacing={2}>
                {courses
                    .filter(course => course.status === 'Active') // Chỉ hiển thị những course có status là "Active"
                    .slice(0, 4)
                    .map((course) => (
                        <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
                            <CourseCard course={course} />
                        </Grid>
                    ))}
            </Grid>
        </Container>
    );
};

export default CourseDisplay;
