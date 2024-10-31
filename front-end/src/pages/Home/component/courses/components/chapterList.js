import React, { useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CheckCircle from '@mui/icons-material/CheckCircle';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';

export const ChapterList = ({ chapters, groupedLessons, chapterProgress, completedLessons }) => {
    // Thêm log để debug
    useEffect(() => {
        console.log('completedLessons:', completedLessons);
        console.log('groupedLessons:', groupedLessons);
    }, [completedLessons, groupedLessons]);

    const isLessonCompleted = (chapterId, lessonId) => {
        // Kiểm tra xem lesson có tồn tại trong completedLessons không
        if (!completedLessons[chapterId]) return false;
        
        // Tìm lesson trong mảng completedLessons của chapter
        const lessonStatus = completedLessons[chapterId].find(
            lesson => lesson.id === lessonId
        );
        
        return lessonStatus?.isCompleted || false;
    };

    return (
        <>
            {chapters
                .map((chapter, index) => (
                    <Accordion key={chapter.id}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {chapterProgress[chapter.id] ? (
                                    <CheckCircle sx={{ color: 'green', fontSize: 20, marginRight: 1 }} />
                                ) : (
                                    <CheckCircleOutline sx={{ color: 'red', fontSize: 20, marginRight: 1 }} />
                                )}
                                <Typography>{`Chương ${index + 1}: ${chapter.title}`}</Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {groupedLessons[chapter.id]
                                    ?.filter(lesson => lesson.status === 'Active') // Chỉ hiển thị bài học có status là "active"
                                    .map((lesson, lessonIndex) => (
                                        <ListItem key={lesson.id}>
                                            <ListItemIcon>
                                                {isLessonCompleted(chapter.id, lesson.id) ? (
                                                    <CheckCircle sx={{ color: 'green' }} />
                                                ) : (
                                                    <CheckCircleOutline sx={{ color: 'gray' }} />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText primary={`Bài ${lessonIndex + 1}: ${lesson.name}`} />
                                        </ListItem>
                                    ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
        </>
    );
};
