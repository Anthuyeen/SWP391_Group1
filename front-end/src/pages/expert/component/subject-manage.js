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
import { deleteSubject, uploadImage } from '../../../service/subject';

const SubjectManage = () => {
  const [subjects, setSubjects] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileEdit, setImageFileEdit] = useState(null); // Thêm state cho ảnh chỉnh sửa
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
  const [errors, setErrors] = useState({
    name: '',
    thumbnail: '',
    categoryId: '',
    description: ''
  });
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
    setImageFileEdit(null); // Clear previous image file if any
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

    // Clear error message when user starts typing
    setErrors({ ...errors, [name]: '' });
  };

  const handleCreateSubject = async () => {
    // Kiểm tra lỗi
    let validationErrors = {};

    if (!newSubject.name.trim()) {
      validationErrors.name = "Name is required.";
    }

    if (!imageFile) {
      validationErrors.thumbnail = "Thumbnail is required.";
    }

    if (!newSubject.categoryId) {
      validationErrors.categoryId = "Category is required.";
    }

    if (!newSubject.description.trim()) {
      validationErrors.description = "Description is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Upload image trước khi tạo subject
      const uploadedImage = await uploadImage(imageFile); // Gọi hàm upload ảnh
      const subjectToCreate = {
        ...newSubject,
        thumbnail: uploadedImage.url, // URL trả về từ API uploadImage
        status: 'Active',
      };

      const createdSubject = await createSubject(subjectToCreate);

      // Cập nhật danh sách subjects bằng cách thêm subject mới
      setSubjects((prevSubjects) => [...prevSubjects, createdSubject]);

      // Đóng dialog sau khi tạo thành công
      window.location.reload();

      handleCloseCreate();
    } catch (error) {
      console.error('Error creating subject:', error);
      setErrors({ apiError: error.message });
    }
  };




  const handleEditSubject = async () => {
    if (!newSubject.name || !newSubject.categoryId || !newSubject.description) {
      alert("All fields must be filled!");
      return;
    }
  
    try {
      let updatedSubject = { ...newSubject };
  
      // Nếu có ảnh mới, upload ảnh
      if (imageFileEdit) {
        const uploadedImage = await uploadImage(imageFileEdit); // Gọi hàm upload ảnh
        updatedSubject.thumbnail = uploadedImage.url; // Cập nhật URL ảnh
      }
  
      await editSubject(selectedSubject.id, updatedSubject);
  
      // Cập nhật danh sách subjects sau khi chỉnh sửa
      setSubjects(subjects.map((subject) =>
        subject.id === selectedSubject.id ? { ...subject, ...updatedSubject } : subject
      ));
      handleCloseEdit();
    } catch (error) {
      console.error('Error editing subject:', error);
      alert('There was an error editing the subject. Please try again.');
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
            <TableRow key={subject.id}> {/* Đảm bảo subject.id là duy nhất */}
              <TableCell>{subject.id}</TableCell>
              <TableCell>{subject.name}</TableCell>
              <TableCell>{subject.thumbnail ? subject.thumbnail : 'No Image'}</TableCell>
              <TableCell>{subject.categoryName}</TableCell> {/* Sử dụng categoryName từ JSON */}
              <TableCell>{subject.isFeatured ? 'Yes' : 'No'}</TableCell>
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
          {/* Name field */}
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={newSubject.name}
            onChange={handleInputChange}
            error={!!errors.name} // Hiển thị lỗi nếu có
            helperText={errors.name} // Dòng thông báo lỗi
          />
          {/* Thumbnail field */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])} // Lưu file vào state
          />
          {/* Category field */}
          <Select
            label="Category"
            name="categoryId"
            fullWidth
            value={newSubject.categoryId}
            onChange={handleInputChange}
            error={!!errors.categoryId}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
            ))}
          </Select>
          {errors.categoryId && <p style={{ color: 'red' }}>{errors.categoryId}</p>}

          {/* Description field */}
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            value={newSubject.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate} color="secondary">Cancel</Button>
          <Button onClick={handleCreateSubject} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subject Dialog */}
      {/* Edit Subject Dialog */}
      <Dialog fullScreen open={openEdit} onClose={handleCloseEdit}>
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
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFileEdit(e.target.files[0])} // Lưu file ảnh vào state
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




