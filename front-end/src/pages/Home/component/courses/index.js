import React from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia, Container } from '@mui/material';

const CourseCard = ({ course }) => (
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
        onClick={() => console.log(course.name)}
    >
        <CardMedia
            component="img"
            image={course.thumbnail}
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
                    {course.author}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#f15123' }}>
                    {course.price}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

const CourseDisplay = ({ courses }) => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Khóa học miễn phí
        </Typography>
        <Grid container spacing={2}>
            {courses.map((course, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                    <CourseCard course={course} />
                </Grid>
            ))}
        </Grid>
    </Container>
);

export default CourseDisplay;