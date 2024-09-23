import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { fetchAllSubjects } from '../../../service/subject';

const SubjectManage = () => {
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    thumbnail: '',
    categoryId: 0,
    isFeatured: true,
    ownerId: 0,
    status: '',
    description: ''
  });

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await fetchAllSubjects();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    loadSubjects();
  }, []);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  const handleCreateSubject = () => {
    // Logic to handle subject creation (e.g., API call)
    console.log('Creating subject:', newSubject);
    handleClose(); // Close the dialog after creating
  };

  return (
    <div>
      <h1>Subject Management</h1>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
        Create Subject
      </Button>
      
      {/* Table displaying subjects */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Thumbnail</TableCell>
            <TableCell>Category ID</TableCell>
            <TableCell>Featured</TableCell>
            <TableCell>Owner ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell>{subject.id}</TableCell>
              <TableCell>{subject.name}</TableCell>
              <TableCell>{subject.thumbnail}</TableCell>
              <TableCell>{subject.categoryId}</TableCell>
              <TableCell>{subject.isFeatured ? 'Yes' : 'No'}</TableCell>
              <TableCell>{subject.ownerId}</TableCell>
              <TableCell>{subject.status}</TableCell>
              <TableCell>{subject.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Subject Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Subject</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Name" name="name" fullWidth value={newSubject.name} onChange={handleInputChange} />
          <TextField margin="dense" label="Thumbnail" name="thumbnail" fullWidth value={newSubject.thumbnail} onChange={handleInputChange} />
          <TextField margin="dense" label="Category ID" name="categoryId" type="number" fullWidth value={newSubject.categoryId} onChange={handleInputChange} />
          <TextField margin="dense" label="Is Featured" name="isFeatured" fullWidth value={newSubject.isFeatured} onChange={handleInputChange} />
          <TextField margin="dense" label="Owner ID" name="ownerId" type="number" fullWidth value={newSubject.ownerId} onChange={handleInputChange} />
          <TextField margin="dense" label="Status" name="status" fullWidth value={newSubject.status} onChange={handleInputChange} />
          <TextField margin="dense" label="Description" name="description" fullWidth value={newSubject.description} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleCreateSubject} color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SubjectManage;
