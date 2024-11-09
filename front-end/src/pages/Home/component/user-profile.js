import React, { useEffect, useState } from 'react';
import { TextField, Typography, Container, Button, Box, IconButton, InputAdornment } from '@mui/material';
import { fetchUserById, updateUser } from '../../../service/profile-manage'; // Cập nhật đường dẫn
import { uploadImage } from '../../../service/subject'
import Navbar from '../../../layouts/navbar';
import Footer from '../../../layouts/footer';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Trạng thái để kiểm soát ẩn/hiện mật khẩu

    const userId = localStorage.getItem("id");

    useEffect(() => {
        const getUserData = async () => {
            try {
                console.log("Fetching user with ID:", userId);
                const data = await fetchUserById(userId);
                console.log("User data received:", data);
                setUser(data);
            } catch (err) {
                setError('Không thể lấy thông tin người dùng.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            getUserData();
        } else {
            setError('ID người dùng không hợp lệ.');
            setLoading(false);
        }
    }, [userId]);

    const handleEditClick = async () => {
        if (isEditing) {
            await updateUser(userId, user); // Gọi hàm cập nhật
            setSuccessMessage('Cập nhật thành công!'); // Hiển thị thông báo thành công
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]; // Lấy file từ input
        if (file) {
            try {
                const uploadedImage = await uploadImage(file); // Gọi hàm upload
                setUser((prevUser) => ({
                    ...prevUser,
                    avatar: uploadedImage.url || '', // Cập nhật URL ảnh
                }));
            } catch (error) {
                setError('Không thể tải ảnh lên.');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState); // Chuyển trạng thái ẩn/hiện mật khẩu
    };

    if (loading) return <Typography variant="body1">Đang tải...</Typography>;
    if (error) return <Typography variant="body1" color="error">{error}</Typography>;

    return (
        <div>
            <Navbar />
            <Container>
                {successMessage && (
                    <Typography variant="body1" color="success.main">{successMessage}</Typography>
                )}
                {user && (
                    <div>
                        <img src={user.avatar || 'default-avatar.png'} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                        {isEditing && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ marginBottom: '20px' }}
                            />
                        )}
                        <TextField
                            label="Họ"
                            name="firstName"
                            value={user.firstName || ''}
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            InputProps={{
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            label="Tên đệm"
                            name="midName"
                            value={user.midName || ''}
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            InputProps={{
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            label="Tên"
                            name="lastName"
                            value={user.lastName || ''}
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            InputProps={{
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={user.email || ''}
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            InputProps={{
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            label="Số điện thoại"
                            name="mobile"
                            value={user.mobile || ''}
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            InputProps={{
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            label="Giới tính"
                            name="gender"
                            value={user.gender || ''}
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            InputProps={{
                                readOnly: !isEditing,
                            }}
                        />
                        {/* Trường mật khẩu */}
                        <TextField
                            label="Mật khẩu"
                            name="password"
                            type={showPassword ? 'text' : 'password'} // Điều chỉnh kiểu input
                            value={user.password || ''}
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            InputProps={{
                                readOnly: !isEditing,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box display="flex" alignItems="center" justifyContent="flex-end">
                            <Button variant="contained" onClick={handleEditClick}>
                                {isEditing ? 'Lưu' : 'Chỉnh sửa'}
                            </Button>
                        </Box>
                    </div>
                )}
            </Container>
            <Footer />
        </div>
    );
};

export default UserProfile;
