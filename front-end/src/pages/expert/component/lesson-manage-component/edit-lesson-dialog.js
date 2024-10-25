import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    DialogActions,
    FormHelperText
} from '@mui/material';

const EditLessonDialog = ({ open, onClose, editingLesson, setEditingLesson, handleEditLessonSubmit }) => {
    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <DialogTitle>Edit Lesson</DialogTitle>
            <DialogContent>
                {editingLesson && (
                    <>
                        <TextField
                            margin="dense"
                            label="Lesson Name"
                            type="text"
                            fullWidth
                            value={editingLesson.name}
                            onChange={(e) => setEditingLesson({ ...editingLesson, name: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Lesson Content"
                            type="text"
                            fullWidth
                            value={editingLesson.content}
                            onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="URL"
                            type="url"
                            fullWidth
                            value={editingLesson.url}
                            onChange={(e) => setEditingLesson({ ...editingLesson, url: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Display Order"
                            type="number"
                            fullWidth
                            value={editingLesson.displayOrder}
                            onChange={(e) => setEditingLesson({ ...editingLesson, displayOrder: parseInt(e.target.value) })}
                            required
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="edit-status-label">Status</InputLabel>
                            <Select
                                labelId="edit-status-label"
                                value={editingLesson.status}
                                onChange={(e) => setEditingLesson({ ...editingLesson, status: e.target.value })}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                            <FormHelperText>Select the lesson status</FormHelperText>
                        </FormControl>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleEditLessonSubmit} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditLessonDialog;
