import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableHead, TableRow, MenuItem, Select, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchAllSubjects } from '../../../service/subject';
import { fetchSubjectsByOwner } from '../../../service/subject';
import { fetchCategories } from '../../../service/subject';
import { createSubject } from '../../../service/subject';
import { editSubject } from '../../../service/subject';
import { deleteSubject } from '../../../service/subject';

const SubjectManage = () => {
  const [subjects, setSubjects] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [newSubject, setNewSubject] = useState({
    name: '',
    thumbnail: '',
    categoryId: '',
    isFeatured: true,
    ownerId: localStorage.getItem('id'), // Fetch from local storage
    description: ''
  });
  const [categories, setCategories] = useState([]);
  const ownerId = localStorage.getItem('id'); // Lấy ID của người dùng từ localStorage

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await fetchSubjectsByOwner(ownerId);
        setSubjects(data);
        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    loadSubjects();
  }, [ownerId]);

  const handleOpenCreate = () => {
    // Đặt giá trị mặc định cho newSubject
    setNewSubject({
      name: '',
      thumbnail: '',
      categoryId: categories.length > 0 ? categories[0].id : '', // Giữ giá trị đầu tiên của category
      isFeatured: true,
      ownerId: localStorage.getItem('id'), // Fetch from local storage
      description: ''
    });
    setOpenCreate(true);
  };
  
  const handleCloseCreate = () => setOpenCreate(false);
  
  const handleOpenEdit = (subject) => {
    setSelectedSubject(subject);
    setNewSubject(subject); // Pre-fill dialog with the selected subject data
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const handleOpenDelete = (subject) => {
    setSelectedSubject(subject);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => setOpenDelete(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  const handleCreateSubject = async () => {
    if (!newSubject.name || !newSubject.thumbnail || !newSubject.categoryId || !newSubject.description) {
      alert("All fields must be filled!");
      return;
    }
  
    const subjectToCreate = {
      ...newSubject,
      status: 'Active' // Đặt trạng thái 'active' mặc định
    };
  
    console.log('Creating subject:', subjectToCreate); // In ra để kiểm tra
  
    try {
      const createdSubject = await createSubject(subjectToCreate);
      setSubjects([...subjects, createdSubject]);
      handleCloseCreate();
    } catch (error) {
      alert('Thêm Subject thành công !'); // Thông báo cho người dùng
    }
  };
  

  const handleEditSubject = async () => {
    if (!newSubject.name || !newSubject.thumbnail || !newSubject.categoryId || !newSubject.description) {
      alert("All fields must be filled!");
      return;
    }
  
    try {
      await editSubject(selectedSubject.id, newSubject);
      setSubjects(subjects.map((subject) => 
        subject.id === selectedSubject.id ? { ...subject, ...newSubject } : subject
      ));
      handleCloseEdit();
    } catch (error) {
      console.error('Error editing subject:', error);
      alert('There was an error editing the subject. Please try again.'); // Thông báo cho người dùng
    }
  };
  

  const handleDeleteSubject = async () => {
    try {
      await deleteSubject(selectedSubject.id); // Call deleteSubject with subject ID
      setSubjects(subjects.filter((subject) => subject.id !== selectedSubject.id));
      handleCloseDelete(); // Close the dialog after deletion
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  return (
    <div>
      <h1>Subject Management</h1>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreate}>
        Create Subject
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Thumbnail</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Featured</TableCell>
            {/* <TableCell>Owner ID</TableCell> */}
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell>{subject.id}</TableCell>
              <TableCell>{subject.name}</TableCell>
              <TableCell>{subject.thumbnail}</TableCell>
              <TableCell>{categories.find(c => c.id === subject.categoryId)?.name}</TableCell>
              <TableCell>{subject.isFeatured ? 'Yes' : 'No'}</TableCell>
              {/* <TableCell>{subject.ownerId}</TableCell> */}
              <TableCell>{subject.description}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenEdit(subject)}><EditIcon /></IconButton>
                <IconButton onClick={() => handleOpenDelete(subject)}><DeleteIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Subject Dialog */}
      <Dialog fullScreen open={openCreate} onClose={handleCloseCreate}>
        <DialogTitle>Create New Subject</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Name" name="name" fullWidth value={newSubject.name} onChange={handleInputChange} />
          <TextField margin="dense" label="Thumbnail" name="thumbnail" fullWidth value={newSubject.thumbnail} onChange={handleInputChange} />
          <Select label="Category" name="categoryId" fullWidth value={newSubject.categoryId} onChange={handleInputChange}>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
            ))}
          </Select>
          <TextField margin="dense" label="Description" name="description" fullWidth value={newSubject.description} onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate} color="secondary">Cancel</Button>
          <Button onClick={handleCreateSubject} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subject Dialog */}
      {/* Edit Subject Dialog */}
<Dialog open={openEdit} onClose={handleCloseEdit}>
  <DialogTitle>Edit Subject</DialogTitle>
  <DialogContent>
    <TextField 
      margin="dense" 
      label="Name" 
      name="name" 
      fullWidth 
      value={newSubject.name} 
      onChange={handleInputChange} 
    />
    <TextField 
      margin="dense" 
      label="Thumbnail" 
      name="thumbnail" 
      fullWidth 
      value={newSubject.thumbnail} 
      onChange={handleInputChange} 
    />
    <Select 
      label="Category" 
      name="categoryId" 
      fullWidth 
      value={newSubject.categoryId} 
      onChange={handleInputChange}
    >
      {categories.map((category) => (
        <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
      ))}
    </Select>
    <TextField 
      margin="dense" 
      label="Description" 
      name="description" 
      fullWidth 
      value={newSubject.description} 
      onChange={handleInputChange} 
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseEdit} color="secondary">Cancel</Button>
    <Button onClick={handleEditSubject} color="primary">Edit</Button> {/* Thay đổi nhãn thành "Edit" */}
  </DialogActions>
</Dialog>


      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this subject?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="secondary">Cancel</Button>
          <Button onClick={handleDeleteSubject} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SubjectManage;

