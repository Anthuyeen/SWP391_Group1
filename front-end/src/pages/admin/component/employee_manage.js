import React, { useEffect, useState } from 'react';
import { fetchUsers, addUser, setActiveExpert } from '../../../service/employee-fetch'; // Import hàm toggleUserStatus
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';

const Employee = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        password: '',
        mobile: '',
        gender: '',
        avatar: '',
        role: 'Teacher', // Giả sử mặc định là Teacher
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
            fullName: '',
            email: '',
            password: '',
            mobile: '',
            gender: '',
            avatar: '',
            role: 'Teacher',
            status: 'active',
        });
    };
  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const result = await addUser(newUser);
        if (result) {
            setUsers((prev) => [...prev, result]); // Thêm người dùng mới vào danh sách
            handleClose();
        }
    };

    // Hàm đổi trạng thái người dùng
    const handleToggleStatus = async (user) => {
        const updatedStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        const result = await setActiveExpert(user.id, updatedStatus); // Gọi API cập nhật trạng thái
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

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thêm User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="fullName"
                        label="Họ và Tên"
                        type="text"
                        fullWidth
                        value={newUser.fullName}
                        onChange={handleInputChange}
                        style={{ marginBottom: '1rem' }}
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
                    </FormControl>
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
