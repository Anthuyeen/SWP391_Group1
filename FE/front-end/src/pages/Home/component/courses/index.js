// import React from 'react';
// import { Box, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';

// const CourseCard = ({ course }) => (
//     <Card
//         sx={{
//             cursor: 'pointer',
//             borderRadius: '15px', // Bo tròn thẻ
//             width: '90%', // Chiều rộng thẻ
//             margin: '2px auto', // Giảm khoảng cách giữa các thẻ
//             boxShadow: 'none', // Không đổ bóng
//             backgroundColor: '#f7f7f7' // Màu nền của thẻ
//         }}
//         onClick={() => console.log(course.name)} // Chức năng click cho thẻ
//     >
//         <CardMedia
//             component="img"
//             image={course.thumbnail}
//             alt={course.name}
//             sx={{ height: 140 }}
//         />
//         <CardContent>
//             <Typography gutterBottom variant="h6">
//                 {course.name}
//             </Typography>
//             <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#f15123' }}>
//                 {course.price}
//             </Typography>
//             <Typography variant="body2">
//                 {course.author}
//             </Typography>
//         </CardContent>
//     </Card>
// );

// const CourseDisplay = ({ courses }) => (
//     <Box sx={{ mt: 4, mx: '10px' }}> {/* Khoảng cách 2 bên màn hình */}
//         <Typography variant="h4" component="h1" gutterBottom>
//             Các khóa học
//         </Typography>
//         <Grid container spacing={0}> {/* Đặt spacing = 0 */}
//             {courses.map((course, index) => (
//                 <Grid item key={index} xs={12} sm={6} md={3}>
//                     <CourseCard course={course} />
//                 </Grid>
//             ))}
//         </Grid>
//     </Box>
// );

// export default CourseDisplay;


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