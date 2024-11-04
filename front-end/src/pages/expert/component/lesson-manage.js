import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, CircularProgress, Box, Chip, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { fetchSubjectsByOwner } from '../../../service/subject';
import { fetchLessonsBySubjectId, addLesson, editLesson, updateLessonStatus, updateLessonStatusForExpert } from '../../../service/lesson';
import { fetchChaptersBySubjectId, fetchChapterDetails, addChapter, editChapter, updateChapterStatus } from '../../../service/chapter';
import AddLessonDialog from './lesson-manage-component/add-lesson-dialog';
import EditLessonDialog from './lesson-manage-component/edit-lesson-dialog';
import EditChapterDialog from './lesson-manage-component/edit-chapter-dialog';
import AddChapterDialog from './lesson-manage-component/add-chapter-dialog';
const LessonManager = () => {
    const [subjects, setSubjects] = useState([]);
    const [chaptersBySubject, setChaptersBySubject] = useState({});
    const [lessonsByChapter, setLessonsByChapter] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [newLesson, setNewLesson] = useState({ subjectId: '', chapterId: '', name: '', content: '', status: 'Active', url: '', displayOrder: 0 });
    const [editingLesson, setEditingLesson] = useState(null);
    const [openAddChapterDialog, setOpenAddChapterDialog] = useState(false);
    const [newChapter, setNewChapter] = useState({ title: '', status: 'Active', subjectId: '' });
    const [editingChapter, setEditingChapter] = useState(null); // New state for editing chapter
    const [openEditChapterDialog, setOpenEditChapterDialog] = useState(false); // New dialog state
    const [newChapterTitle, setNewChapterTitle] = useState(''); // State for chapter title

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const ownerId = localStorage.getItem('id');
                const data = await fetchSubjectsByOwner(ownerId);
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
        if (isExpanded && !chaptersBySubject[subjectId]) {
            try {
                const chapters = await fetchChaptersBySubjectId(subjectId);
                setChaptersBySubject(prev => ({ ...prev, [subjectId]: chapters }));
            } catch (err) {
                console.error('Failed to load chapters for subject:', subjectId, err);
                setChaptersBySubject(prev => ({ ...prev, [subjectId]: 'error' }));
            }
        }
    };

    const handleChapterChange = (chapterId) => async () => {
        if (!lessonsByChapter[chapterId]) {
            try {
                const chapterDetails = await fetchChapterDetails(chapterId);
                setLessonsByChapter(prev => ({ ...prev, [chapterId]: chapterDetails.lessons.$values }));
            } catch (err) {
                console.error('Failed to load lessons for chapter:', chapterId, err);
                setLessonsByChapter(prev => ({ ...prev, [chapterId]: 'error' }));
            }
        }
    };

    const handleAddLessonOpen = (chapterId, subjectId) => {
        setNewLesson({ ...newLesson, chapterId, subjectId });
        setOpenAddDialog(true);
    };

    const handleAddLessonClose = () => {
        setOpenAddDialog(false);
        setNewLesson({ subjectId: '', chapterId: '', name: '', content: '', status: 'Active', url: '', displayOrder: 0 });
    };

    const handleAddLessonSubmit = async () => {
        try {
            // Gọi hàm để thêm bài học
            await addLesson(newLesson);

            // Lấy lại danh sách bài học sau khi thêm thành công
            const chapterDetails = await fetchChapterDetails(newLesson.chapterId);

            // Cập nhật state với bài học vừa thêm
            setLessonsByChapter(prev => ({
                ...prev,
                [newLesson.chapterId]: chapterDetails.lessons.$values // Sử dụng danh sách bài học mới từ server
            }));

            handleAddLessonClose(); // Đóng dialog
        } catch (err) {
            console.error('Failed to add lesson:', err);
        }
    };


    const handleEditLessonOpen = (lesson) => {
        setEditingLesson(lesson);
        setOpenEditDialog(true);
    };

    const handleEditLessonClose = () => {
        setOpenEditDialog(false);
        setEditingLesson(null);
    };

    const handleEditLessonSubmit = async () => {
        try {
            const updatedLesson = {
                ...editingLesson,
            };
            await editLesson(editingLesson.id, updatedLesson);
            setLessonsByChapter(prev => ({
                ...prev,
                [editingLesson.chapterId]: prev[editingLesson.chapterId].map(lesson =>
                    lesson.id === editingLesson.id ? updatedLesson : lesson
                )
            }));
            handleEditLessonClose();
        } catch (err) {
            console.error('Failed to update lesson:', err);
        }
    };

    const handleDeleteLesson = async (lesson) => {
        try {
            await updateLessonStatus(lesson.id, lesson.status === 'Active' ? 'Inactive' : 'Active');
            setLessonsByChapter(prev => ({
                ...prev,
                [lesson.chapterId]: prev[lesson.chapterId].map(l =>
                    l.id === lesson.id ? { ...l, status: l.status === 'Active' ? 'Inactive' : 'Active' } : l
                )
            }));
        } catch (err) {
            console.error('Failed to update lesson status:', err);
        }
    };

    const handleAddChapterOpen = (subjectId) => {
        setNewChapter({ ...newChapter, subjectId });
        setOpenAddChapterDialog(true);
    };

    const handleAddChapterClose = () => {
        setOpenAddChapterDialog(false);
        setNewChapter({ title: '', status: 'Active', subjectId: '' });
    };

    const handleAddChapterSubmit = async () => {
        try {
            await addChapter(newChapter);
            // Sau khi thêm thành công, tải lại danh sách chapters
            const chapters = await fetchChaptersBySubjectId(newChapter.subjectId);
            setChaptersBySubject(prev => ({ ...prev, [newChapter.subjectId]: chapters }));

            handleAddChapterClose();
        } catch (error) {
            console.error('Failed to add chapter:', error);
        }
    };

    const handleEditChapterOpen = (chapter) => {
        setEditingChapter(chapter);
        setNewChapterTitle(chapter.title); // Set current chapter title
        setOpenEditChapterDialog(true);
    };

    const handleEditChapterClose = () => {
        setOpenEditChapterDialog(false);
        setEditingChapter(null);
        setNewChapterTitle(''); // Reset chapter title
    };

    const handleEditChapterSubmit = async () => {
        try {
            const updatedChapter = {
                title: newChapterTitle,
                subjectId: editingChapter.subjectId, // Keep the subject ID same
                status: 'Active'

            };
            await editChapter(editingChapter.id, updatedChapter); // Call the edit function

            // Optionally, reload the chapters or update local state
            const chapters = await fetchChaptersBySubjectId(editingChapter.subjectId);
            setChaptersBySubject(prev => ({ ...prev, [editingChapter.subjectId]: chapters }));

            handleEditChapterClose(); // Close dialog
        } catch (error) {
            console.error('Failed to edit chapter:', error);
        }
    };
    const handleChangeChapterStatus = async (chapter) => {
        let newStatus;

        // Determine the new status based on the current status
        if (chapter.status === 'Active') {
            newStatus = 'Inactive';
        } else if (chapter.status === 'Inactive') {
            newStatus = 'Draft'; // Cycle to Draft from Inactive
        } else {
            newStatus = 'Active'; // Cycle back to Active from Draft
        }

        try {
            await updateChapterStatus(chapter.id, newStatus); // Call API to update status
            setChaptersBySubject(prev => ({
                ...prev,
                [chapter.subjectId]: prev[chapter.subjectId].map(ch =>
                    ch.id === chapter.id ? { ...ch, status: newStatus } : ch // Update status in state
                )
            }));
        } catch (error) {
            console.error('Error updating chapter status:', error);
        }
    };

    const handleStatusToggle = async (lessonId, currentStatus, chapterId) => {
        let newStatus;
    
        // Xác định trạng thái mới
        if (currentStatus === 'Active') {
            newStatus = 'Inactive';
        } else if (currentStatus === 'Inactive') {
            newStatus = 'Active';
        } else {
            // Nếu trạng thái là 'draft', không làm gì
            return; 
        }
    
        try {
            // Gọi hàm cập nhật trạng thái với id và trạng thái mới
            const response = await updateLessonStatusForExpert(lessonId, newStatus);
            console.log('Update successful:', response); // Ghi log phản hồi thành công nếu cần

            setLessonsByChapter(prev => ({
                ...prev,
                [chapterId]: prev[chapterId].map(lesson =>
                    lesson.id === lessonId ? { ...lesson, status: newStatus } : lesson
                )
            }));
        } catch (error) {
            console.error('Failed to toggle lesson status:', error);
        }
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box sx={{ width: '100%', margin: 'auto', padding: 1 }}>
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
                            <IconButton color="primary" onClick={(event) => {
                                event.stopPropagation();
                                handleAddChapterOpen(subject.id)
                            }}>
                                <AddIcon />
                            </IconButton>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" paragraph>{subject.description}</Typography>
                            <Typography variant="subtitle2">Owner: {subject.ownerName}</Typography>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Chapters:</Typography>
                            {chaptersBySubject[subject.id] ? (
                                chaptersBySubject[subject.id] === 'error' ? (
                                    <Typography color="error">Failed to load chapters. Please try again later.</Typography>
                                ) : chaptersBySubject[subject.id].length > 0 ? (
                                    <List>
                                        {chaptersBySubject[subject.id].map((chapter) => (
                                            <Accordion key={chapter.id} onChange={handleChapterChange(chapter.id)}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography variant="h6" sx={{ marginRight: 1 }}>{chapter.title}</Typography>
                                                            {/* Hiển thị chip trạng thái */}
                                                            <Chip
                                                                label={chapter.status}
                                                                color={
                                                                    chapter.status === 'Active' ? 'success' :
                                                                        chapter.status === 'Inactive' ? 'default' :
                                                                            'warning'
                                                                }
                                                                size="small"
                                                                sx={{ marginLeft: 1 }}
                                                            />
                                                        </Box>
                                                        <Box>
                                                            <IconButton
                                                                color="primary"
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    handleEditChapterOpen(chapter)
                                                                }} // Edit chapter
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                color="primary"
                                                                onClick={(event) => {
                                                                    event.stopPropagation(); // Prevent accordion from toggling
                                                                    handleAddLessonOpen(chapter.id, subject.id);
                                                                }}
                                                            >
                                                                <AddIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                color="secondary"
                                                                onClick={(event) => {
                                                                    event.stopPropagation(); // Prevent accordion from toggling
                                                                    handleChangeChapterStatus(chapter);
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Typography variant="body2" paragraph>Status: {chapter.status}</Typography>
                                                    <Typography variant="subtitle2">Lessons:</Typography>
                                                    {lessonsByChapter[chapter.id] ? (
                                                        lessonsByChapter[chapter.id] === 'error' ? (
                                                            <Typography color="error">Failed to load lessons. Please try again later.</Typography>
                                                        ) : lessonsByChapter[chapter.id].length > 0 ? (
                                                            <List>
                                                                {lessonsByChapter[chapter.id].map((lesson) => (
                                                                    <ListItem
                                                                        key={lesson.id}
                                                                        secondaryAction={
                                                                            <>
                                                                                <IconButton
                                                                                    edge="end"
                                                                                    aria-label="edit"
                                                                                    onClick={() => handleEditLessonOpen(lesson)}
                                                                                >
                                                                                    <EditIcon />
                                                                                </IconButton>
                                                                                {lesson.status !== 'Draft' && (
                                                                                    <IconButton
                                                                                        edge="end"
                                                                                        aria-label="delete"
                                                                                        // onClick={() => handleDeleteLesson(lesson)}
                                                                                        onClick={() => handleStatusToggle(lesson.id, lesson.status, lesson.chapterId)}
                                                                                    >
                                                                                        <DeleteIcon />
                                                                                    </IconButton>
                                                                                )}
                                                                            </>
                                                                        }
                                                                    >
                                                                        <ListItemText
                                                                            primary={lesson.name}
                                                                            secondary={
                                                                                <>
                                                                                    <Typography variant="body2">{lesson.content}</Typography>
                                                                                    <Chip
                                                                                        label={lesson.status}
                                                                                        color={lesson.status === 'Active' ? 'success' : 'default'}
                                                                                        size="small"
                                                                                        style={{ marginTop: 4 }} // Thêm khoảng cách trên nếu cần
                                                                                    />
                                                                                </>
                                                                            }
                                                                        />
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        ) : (
                                                            <Typography color="text.secondary">No lessons available.</Typography>
                                                        )
                                                    ) : (
                                                        <Typography color="text.secondary">Loading lessons...</Typography>
                                                    )}
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography color="text.secondary">No chapters available.</Typography>
                                )
                            ) : (
                                <Typography color="text.secondary">Loading chapters...</Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
            <AddLessonDialog
                open={openAddDialog}
                onClose={handleAddLessonClose}
                newLesson={newLesson}
                setNewLesson={setNewLesson}
                handleAddLessonSubmit={handleAddLessonSubmit}
            />

            <EditLessonDialog
                open={openEditDialog}
                onClose={handleEditLessonClose}
                editingLesson={editingLesson}
                setEditingLesson={setEditingLesson}
                handleEditLessonSubmit={handleEditLessonSubmit}
            />

            <AddChapterDialog
                open={openAddChapterDialog}
                onClose={handleAddChapterClose}
                newChapter={newChapter}
                setNewChapter={setNewChapter}
                handleAddChapterSubmit={handleAddChapterSubmit}
            />
            <EditChapterDialog
                open={openEditChapterDialog}
                onClose={handleEditChapterClose}
                newChapterTitle={newChapterTitle}
                setNewChapterTitle={setNewChapterTitle}
                handleEditChapterSubmit={handleEditChapterSubmit} 
            />
        </Box>
    );
};

export default LessonManager;
