import React, { useState, useEffect } from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, CircularProgress, Box, Chip, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';  // Thêm icon edit
import AddIcon from '@mui/icons-material/Add';
import { fetchSubjectsByOwner } from '../../../service/subject';
import { fetchLessonsBySubjectId, addLesson, editLesson, updateLessonStatus } from '../../../service/lesson'; // Thêm editLesson

const LessonManager = () => {
    const [subjects, setSubjects] = useState([]);
    const [lessonsBySubject, setLessonsBySubject] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [newLesson, setNewLesson] = useState({ subjectId: '', name: '', content: '', status: 'Active' });
    const [editingLesson, setEditingLesson] = useState(null); // State để lưu lesson đang được chỉnh sửa

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

    const handleAddLessonOpen = (subjectId) => {
        setNewLesson({ ...newLesson, subjectId });
        setOpenAddDialog(true);
    };

    const handleAddLessonClose = () => {
        setOpenAddDialog(false);
        setNewLesson({ subjectId: '', name: '', content: '', status: 'Active' });
    };

    const handleAddLessonSubmit = async () => {
        try {
            await addLesson(newLesson);
            setLessonsBySubject(prev => ({
                ...prev,
                [newLesson.subjectId]: Array.isArray(prev[newLesson.subjectId])
                    ? [...prev[newLesson.subjectId], { ...newLesson, id: Date.now() }]
                    : [{ ...newLesson, id: Date.now() }]
            }));
            handleAddLessonClose();
        } catch (err) {
            console.error('Failed to add lesson:', err);
        }
    };

    // Mở dialog để chỉnh sửa bài học
    const handleEditLessonOpen = (lesson) => {
        setEditingLesson(lesson);
        setOpenEditDialog(true);
    };

    const handleEditLessonClose = () => {
        setOpenEditDialog(false);
        setEditingLesson(null); // Reset form
    };

    const handleEditLessonSubmit = async () => {
        try {
            const updatedLesson = {
                ...editingLesson,
            };
            await editLesson(editingLesson.id, updatedLesson);
            setLessonsBySubject(prev => ({
                ...prev,
                [editingLesson.subjectId]: prev[editingLesson.subjectId].map(lesson =>
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
            setLessonsBySubject(prev => ({
                ...prev,
                [lesson.subjectId]: prev[lesson.subjectId].map(l =>
                    l.id === lesson.id ? { ...l, status: l.status === 'Active' ? 'Inactive' : 'Active' } : l
                )
            }));
        } catch (err) {
            console.error('Failed to update lesson status:', err);
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
                            <IconButton color="primary" onClick={() => handleAddLessonOpen(subject.id)}>
                                <AddIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Lessons:</Typography>
                            {lessonsBySubject[subject.id] ? (
                                lessonsBySubject[subject.id] === 'error' ? (
                                    <Typography color="error">Failed to load lessons. Please try again later.</Typography>
                                ) : lessonsBySubject[subject.id].length > 0 ? (
                                    <List>
                                        {lessonsBySubject[subject.id].map((lesson) => (
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
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="delete"
                                                            onClick={() => handleDeleteLesson(lesson)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </>
                                                }
                                            >
                                                <ListItemText
                                                    primary={lesson.name}
                                                    secondary={
                                                        <>
                                                            <div>Status: {lesson.content}</div>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Content: {lesson.status}
                                                            </Typography>
                                                        </>
                                                    }
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

            {/* Dialog để thêm bài học */}
            <Dialog fullScreen open={openAddDialog} onClose={handleAddLessonClose}>
                <DialogTitle>Add Lesson</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Lesson Name"
                        type="text"
                        fullWidth
                        value={newLesson.name}
                        onChange={(e) => setNewLesson({ ...newLesson, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Content"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={newLesson.content}
                        onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <TextField
                            label="YouTube Video Link"
                            type="url"
                            fullWidth
                            value={newLesson.url || ''}
                            onChange={(e) => setNewLesson({ ...newLesson, url: e.target.value })}
                        />
                        <FormHelperText>Enter a valid YouTube video link.</FormHelperText>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddLessonClose} color="primary">Cancel</Button>
                    <Button onClick={handleAddLessonSubmit} color="primary">Add</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog để chỉnh sửa bài học */}
            <Dialog fullScreen open={openEditDialog} onClose={handleEditLessonClose}>
                <DialogTitle>Edit Lesson</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Lesson Name"
                        type="text"
                        fullWidth
                        value={editingLesson?.name || ''}
                        onChange={(e) => setEditingLesson({ ...editingLesson, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Content"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={editingLesson?.content || ''}
                        onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <TextField
                            label="YouTube Video Link"
                            type="url"
                            fullWidth
                            value={editingLesson?.url || ''}
                            onChange={(e) => setEditingLesson({ ...editingLesson, url: e.target.value })}
                        />
                        <FormHelperText>
                            {editingLesson?.url ? 'Current video link: ' + editingLesson.url : 'Enter a valid YouTube video link.'}
                        </FormHelperText>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={editingLesson?.status || ''}
                            onChange={(e) => setEditingLesson({ ...editingLesson, status: e.target.value })}
                        >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditLessonClose} color="primary">Cancel</Button>
                    <Button onClick={handleEditLessonSubmit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LessonManager;
