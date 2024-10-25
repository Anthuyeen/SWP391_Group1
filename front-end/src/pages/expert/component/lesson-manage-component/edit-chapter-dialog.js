import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    DialogActions
} from '@mui/material';

const EditChapterDialog = ({ open, onClose, newChapterTitle, setNewChapterTitle, handleEditChapterSubmit }) => {
    return (
        <Dialog fullScreen open={open} onClose={onClose}>
            <DialogTitle>Edit Chapter</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Chapter Title"
                    type="text"
                    fullWidth
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleEditChapterSubmit} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditChapterDialog;
