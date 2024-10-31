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

const AddLessonDialog = ({ open, onClose, newLesson, setNewLesson, handleAddLessonSubmit }) => {
    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <DialogTitle>Add Lesson</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Lesson Name"
                    type="text"
                    fullWidth
                    value={newLesson.name}
                    onChange={(e) => setNewLesson({ ...newLesson, name: e.target.value })}
                    required
                />
                <TextField
                    margin="dense"
                    label="Lesson Content"
                    type="text"
                    fullWidth
                    value={newLesson.content}
                    onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                    required
                />
                <TextField
                    margin="dense"
                    label="URL"
                    type="url"
                    fullWidth
                    value={newLesson.url}
                    onChange={(e) => setNewLesson({ ...newLesson, url: e.target.value })}
                    required
                />
                {/* <TextField
                    margin="dense"
                    label="Display Order"
                    type="number"
                    fullWidth
                    value={newLesson.displayOrder}
                    onChange={(e) => setNewLesson({ ...newLesson, displayOrder: parseInt(e.target.value) })}
                    required
                /> */}
                {/* <FormControl fullWidth margin="dense">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        value={newLesson.status}
                        onChange={(e) => setNewLesson({ ...newLesson, status: e.target.value })}
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                    <FormHelperText>Select the lesson status</FormHelperText>
                </FormControl> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleAddLessonSubmit} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddLessonDialog;
