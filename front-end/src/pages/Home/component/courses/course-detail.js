import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import { ExpandMore, PlayCircleOutline, Article } from '@mui/icons-material';
import { fetchSubjectById } from '../../../../service/subject'; // API để lấy subject theo ID
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';

const CourseOverview = () => {
    const { courseId } = useParams(); // Lấy courseId từ URL
    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const data = await fetchSubjectById(courseId); // Gọi API để lấy dữ liệu
                setCourse(data);
            } catch (err) {
                setError('Error loading course');
            }
        };

        loadCourse();
    }, [courseId]);

    if (error) return <div>{error}</div>;
    if (!course) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2, mb : 10 }}>
                <Typography variant="h4" gutterBottom>
                    {course.name}
                </Typography>

                <Typography variant="body1" paragraph>
                    {course.description}
                </Typography>

                <Typography variant="h6" gutterBottom>
                    Nội dung khóa học
                </Typography>
                <Typography variant="body2" gutterBottom>
                    {`${course.dimensions.length} chương • ${course.lessons.length} bài học`}
                </Typography>

                {course.dimensions.map((chapter, index) => (
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography>{`${index + 1}. ${chapter.name}`}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {course.lessons.map((lesson, lessonIndex) => (
                                    <ListItem key={lessonIndex}>
                                        <ListItemIcon>
                                            {lesson.status === 'Active' ? <PlayCircleOutline /> : <Article />}
                                        </ListItemIcon>
                                        <ListItemText primary={lesson.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
            <Footer />
        </>
    );
};

export default CourseOverview;
