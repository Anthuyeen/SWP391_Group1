import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    DialogActions
} from '@mui/material';

const AddChapterDialog = ({ open, onClose, newChapter, setNewChapter, handleAddChapterSubmit }) => {
    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <DialogTitle>Add Chapter</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Chapter Title"
                    type="text"
                    fullWidth
                    value={newChapter.title}
                    onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleAddChapterSubmit} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddChapterDialog;
