// import React, { useState, useEffect } from 'react';
// import {
//     Accordion,
//     AccordionSummary,
//     AccordionDetails,
//     Typography,
//     List,
//     ListItem,
//     ListItemText,
//     CircularProgress,
//     Box,
//     Chip
// } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { fetchAllSubjects } from '../../../service/subject'; // Giả sử bạn đã export các hàm này từ một file api.js
// import { fetchLessonsBySubjectId } from '../../../service/lesson';

// const LessonManager = () => {
//     const [subjects, setSubjects] = useState([]);
//     const [lessonsBySubject, setLessonsBySubject] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const loadSubjects = async () => {
//             try {
//                 const data = await fetchAllSubjects();
//                 setSubjects(data);
//                 setLoading(false);
//             } catch (err) {
//                 setError('Failed to load subjects');
//                 setLoading(false);
//             }
//         };

//         loadSubjects();
//     }, []);

//     const handleAccordionChange = (subjectId) => async (event, isExpanded) => {
//         if (isExpanded && !lessonsBySubject[subjectId]) {
//             try {
//                 const lessons = await fetchLessonsBySubjectId(subjectId);
//                 setLessonsBySubject(prev => ({ ...prev, [subjectId]: lessons }));
//             } catch (err) {
//                 console.error('Failed to load lessons for subject:', subjectId, err);
//                 setLessonsBySubject(prev => ({ ...prev, [subjectId]: 'error' }));
//             }
//         }
//     };

//     if (loading) {
//         return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
//     }

//     if (error) {
//         return <Typography color="error">{error}</Typography>;
//     }

//     return (
//         <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
//             <Typography variant="h4" gutterBottom>Lesson Manager</Typography>
//             {subjects.map((subject) => (
//                 <Accordion key={subject.id} onChange={handleAccordionChange(subject.id)}>
//                     <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                         <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
//                             <Typography variant="h6">{subject.name}</Typography>
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
//                                 <Typography variant="body2" color="text.secondary">
//                                     Category: {subject.categoryName}
//                                 </Typography>
//                                 <Chip
//                                     label={subject.status}
//                                     color={subject.status === 'Active' ? 'success' : 'default'}
//                                     size="small"
//                                 />
//                             </Box>
//                         </Box>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                         <Typography variant="body2" paragraph>{subject.description}</Typography>
//                         <Typography variant="subtitle2">Owner: {subject.ownerName}</Typography>
//                         <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Lessons:</Typography>
//                         {lessonsBySubject[subject.id] ? (
//                             lessonsBySubject[subject.id] === 'error' ? (
//                                 <Typography color="error">Failed to load lessons. Please try again later.</Typography>
//                             ) : lessonsBySubject[subject.id].length > 0 ? (
//                                 <List>
//                                     {lessonsBySubject[subject.id].map((lesson) => (
//                                         <ListItem key={lesson.id}>
//                                             <ListItemText
//                                                 primary={lesson.name}
//                                                 secondary={`Status: ${lesson.status}`}
//                                             />
//                                         </ListItem>
//                                     ))}
//                                 </List>
//                             ) : (
//                                 <Typography color="text.secondary">No lessons available for this subject.</Typography>
//                             )
//                         ) : (
//                             <CircularProgress size={24} />
//                         )}
//                     </AccordionDetails>
//                 </Accordion>
//             ))}
//         </Box>
//     );
// };

// export default LessonManager;


import React, { useState, useEffect } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Box,
    Chip,
    IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchSubjectsByOwner  } from '../../../service/subject'; // Thay đổi API gọi theo owner
import { fetchLessonsBySubjectId, deleteLesson } from '../../../service/lesson';

const LessonManager = () => {
    const [subjects, setSubjects] = useState([]);
    const [lessonsBySubject, setLessonsBySubject] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const ownerId = localStorage.getItem('id'); // Lấy ownerId từ localStorage
                const data = await fetchSubjectsByOwner(ownerId); // Gọi API lấy subject theo ownerId
                setSubjects(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load subjects');
                setLoading(false);
            }
        };

        loadSubjects();
    }, []);

    const handleAccordionChange = (subjectId) => async (event, isExpanded) => {
        if (isExpanded && !lessonsBySubject[subjectId]) {
            try {
                const lessons = await fetchLessonsBySubjectId(subjectId);
                setLessonsBySubject(prev => ({ ...prev, [subjectId]: lessons }));
            } catch (err) {
                console.error('Failed to load lessons for subject:', subjectId, err);
                setLessonsBySubject(prev => ({ ...prev, [subjectId]: 'error' }));
            }
        }
    };

    const handleDeleteLesson = async (lessonId, subjectId) => {
        try {
            await deleteLesson(lessonId); // Gọi API để xóa lesson
            // Cập nhật state sau khi xóa
            setLessonsBySubject(prev => ({
                ...prev,
                [subjectId]: prev[subjectId].filter(lesson => lesson.id !== lessonId)
            }));
        } catch (err) {
            console.error('Failed to delete lesson:', err);
            // Bạn có thể cập nhật error state ở đây nếu cần
        }
    };
    

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
            <Typography variant="h4" gutterBottom>Lesson Manager</Typography>
            {subjects.length === 0 ? (
                <Typography color="text.secondary" align="center">No subject available</Typography>
            ) : (
                subjects.map((subject) => (
                    <Accordion key={subject.id} onChange={handleAccordionChange(subject.id)}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <Typography variant="h6">{subject.name}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Category: {subject.categoryName}
                                    </Typography>
                                    <Chip
                                        label={subject.status}
                                        color={subject.status === 'Active' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" paragraph>{subject.description}</Typography>
                            <Typography variant="subtitle2">Owner: {subject.ownerName}</Typography>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Lessons:</Typography>
                            {lessonsBySubject[subject.id] ? (
                                lessonsBySubject[subject.id] === 'error' ? (
                                    <Typography color="error">Failed to load lessons. Please try again later.</Typography>
                                ) : lessonsBySubject[subject.id].length > 0 ? (
                                    <List>
                                        {lessonsBySubject[subject.id].map((lesson) => (
                                            <ListItem key={lesson.id} secondaryAction={
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteLesson(lesson.id, subject.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            }>
                                                <ListItemText
                                                    primary={lesson.name}
                                                    secondary={`Status: ${lesson.status}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography color="text.secondary">No lessons available for this subject.</Typography>
                                )
                            ) : (
                                <CircularProgress size={24} />
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
        </Box>
    );
};

export default LessonManager;
