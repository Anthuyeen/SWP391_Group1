import React, { useEffect, useState } from 'react';
import { fetchUsers, addUser } from '../../../service/employee-fetch'; // Đường dẫn tới hàm fetch
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
            const data = await fetchUsers();
            if (data) {
                setUsers(data);
            } else {
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
        }
        handleClose();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <Button
                variant="contained"
                style={{
                    backgroundColor: '#ff5722',
                    marginBottom: '1rem',
                }}
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
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.mobile}</TableCell>
                                <TableCell>{user.gender}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.status}</TableCell>
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
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={newUser.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        fullWidth
                        value={newUser.password}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="mobile"
                        label="Điện thoại"
                        type="text"
                        fullWidth
                        value={newUser.mobile}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="gender"
                        label="Giới tính"
                        type="text"
                        fullWidth
                        value={newUser.gender}
                        onChange={handleInputChange}
                    />
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
