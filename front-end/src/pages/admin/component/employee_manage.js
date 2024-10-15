import React, { useEffect, useState } from 'react';
import { fetchUsers, addUser, setActiveExpert } from '../../../service/employee-fetch';
import { uploadImage } from '../../../service/subject'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';

const Employee = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [newUser, setNewUser] = useState({
        firstName: '',
        midName: '',
        lastName: '',
        email: '',
        password: '',
        mobile: '',
        gender: '',
        avatar: '', // Avatar field
        role: 'Teacher',
        status: 'Active',
    });

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (e) {
                setError('Unable to fetch users');
            }
            setLoading(false);
        };

        loadUsers();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewUser({
            firstName: '',
            midName: '',
            lastName: '',
            email: '',
            password: '',
            mobile: '',
            gender: '',
            avatar: '', // Reset avatar
            role: 'Teacher',
            status: 'Active',
        });
        setFormErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const uploadedImage = await uploadImage(file); // Assuming the service handles the upload
                setNewUser((prev) => ({ ...prev, avatar: uploadedImage.url }));
            } catch (err) {
                console.error("Image upload failed", err);
            }
        }
    };

    const validateForm = () => {
        let errors = {};

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newUser.email)) {
            errors.email = 'Email không hợp lệ';
        }

        // Validate password
        // const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        // if (!passwordRegex.test(newUser.password)) {
        //     errors.password =
        //         'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa và số';
        // }

        // Check required fields
        if (!newUser.firstName) errors.firstName = 'Họ là bắt buộc';
        if (!newUser.lastName) errors.lastName = 'Tên là bắt buộc';
        if (!newUser.mobile) errors.mobile = 'Số điện thoại là bắt buộc';
        if (!newUser.gender) errors.gender = 'Giới tính là bắt buộc';

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            const result = await addUser(newUser);
            if (result) {
                setUsers((prev) => [...prev, result]); // Add new user to list
                handleClose();
            }
        }
    };

    const handleToggleStatus = async (user) => {
        const updatedStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        const result = await setActiveExpert(user.id, updatedStatus);
        if (result) {
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, status: updatedStatus } : u))
            );
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <Button
                variant="contained"
                style={{ backgroundColor: '#ff5722', marginBottom: '1rem' }}
                onClick={handleClickOpen}
            >
                Thêm User
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Họ và Tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Điện thoại</TableCell>
                            <TableCell>Giới tính</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{`${user.firstName} ${user.midName} ${user.lastName}`}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.mobile}</TableCell>
                                <TableCell>{user.gender === 'Male' ? 'Nam' : 'Nữ'}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color={user.status === 'Active' ? 'success' : 'secondary'}
                                        onClick={() => handleToggleStatus(user)}
                                    >
                                        {user.status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog fullScreen open={open} onClose={handleClose}>
                <DialogTitle>Thêm User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="firstName"
                        label="First Name"
                        type="text"
                        fullWidth
                        value={newUser.firstName}
                        onChange={handleInputChange}
                        style={{ marginBottom: '1rem' }}
                        error={!!formErrors.firstName}
                        helperText={formErrors.firstName}
                    />
                    <TextField
                        margin="dense"
                        name="midName"
                        label="Middle Name"
                        type="text"
                        fullWidth
                        value={newUser.midName}
                        onChange={handleInputChange}
                        style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                        margin="dense"
                        name="lastName"
                        label="Last Name"
                        type="text"
                        fullWidth
                        value={newUser.lastName}
                        onChange={handleInputChange}
                        style={{ marginBottom: '1rem' }}
                        error={!!formErrors.lastName}
                        helperText={formErrors.lastName}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={newUser.email}
                        onChange={handleInputChange}
                        style={{ marginBottom: '1rem' }}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                    />
                    <TextField
                        margin="dense"
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        fullWidth
                        value={newUser.password}
                        onChange={handleInputChange}
                        style={{ marginBottom: '1rem' }}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                    />
                    <TextField
                        margin="dense"
                        name="mobile"
                        label="Điện thoại"
                        type="text"
                        fullWidth
                        value={newUser.mobile}
                        onChange={handleInputChange}
                        style={{ marginBottom: '1rem' }}
                        error={!!formErrors.mobile}
                        helperText={formErrors.mobile}
                    />
                    <FormControl fullWidth margin="dense" style={{ marginBottom: '1rem' }}>
                        <InputLabel id="gender-label">Giới tính</InputLabel>
                        <Select
                            labelId="gender-label"
                            name="gender"
                            value={newUser.gender}
                            onChange={handleInputChange}
                            displayEmpty
                        >
                            <MenuItem value="Male">Nam</MenuItem>
                            <MenuItem value="Female">Nữ</MenuItem>
                        </Select>
                        {formErrors.gender && <FormHelperText error>{formErrors.gender}</FormHelperText>}
                    </FormControl>

                    {/* Avatar Upload */}
                    <Button variant="contained" component="label" fullWidth>
                        Chọn ảnh
                        <input
                            type="file"
                            hidden
                            onChange={handleImageUpload}
                        />
                    </Button>
                    {newUser.avatar && <div>Ảnh đã tải lên: {newUser.avatar}</div>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Thêm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Employee;
