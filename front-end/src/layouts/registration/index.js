// import React, { useState } from 'react';
// import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
// import { fetchRegister } from '../../service/authAPI'; // Import hàm fetch từ file khác
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate

// const Register = () => {
//     const { register, handleSubmit, formState: { errors } } = useForm();
//     const [gender, setGender] = useState('');
//     const navigate = useNavigate(); // Khởi tạo useNavigate

//     const handleGenderChange = (event) => {
//         setGender(event.target.value);
//     };

//     const onSubmit = async (data) => {
//         try {
//             data.gender = gender; // Gán giá trị gender
//             await fetchRegister(data);
//             alert('Đăng ký thành công!');
//             navigate('/'); // Điều hướng về trang chủ
//         } catch (error) {
//             console.error('Đăng ký thất bại:', error);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400, margin: 'auto' }}>
//             <TextField
//                 label="Email"
//                 fullWidth
//                 margin="normal" // Thêm margin
//                 {...register('email', { required: 'Email là bắt buộc', pattern: /^\S+@\S+$/i })}
//                 error={!!errors.email}
//                 helperText={errors.email?.message}
//             />
//             <TextField
//                 label="Password"
//                 type="password"
//                 fullWidth
//                 margin="normal" // Thêm margin
//                 {...register('password', { required: 'Mật khẩu là bắt buộc', minLength: { value: 6, message: 'Mật khẩu phải ít nhất 6 ký tự' } })}
//                 error={!!errors.password}
//                 helperText={errors.password?.message}
//             />
//             <TextField
//                 label="First Name"
//                 fullWidth
//                 margin="normal" // Thêm margin
//                 {...register('fName', { required: 'First Name là bắt buộc' })}
//                 error={!!errors.fName}
//                 helperText={errors.fName?.message}
//             />
//             <TextField
//                 label="Middle Name"
//                 fullWidth
//                 margin="normal" // Thêm margin
//                 {...register('mName')}
//             />
//             <TextField
//                 label="Last Name"
//                 fullWidth
//                 margin="normal" // Thêm margin
//                 {...register('lName', { required: 'Last Name là bắt buộc' })}
//                 error={!!errors.lName}
//                 helperText={errors.lName?.message}
//             />
//             <TextField
//                 label="Phone"
//                 fullWidth
//                 margin="normal" // Thêm margin
//                 {...register('phone', { required: 'Phone là bắt buộc', pattern: /^[0-9]+$/i })}
//                 error={!!errors.phone}
//                 helperText={errors.phone?.message}
//             />
//             <FormControl fullWidth margin="normal"> {/* Thêm margin */}
//                 <InputLabel>Gender</InputLabel>
//                 <Select
//                     value={gender}
//                     onChange={handleGenderChange}
//                     label="Gender"
//                     required
//                 >
//                     <MenuItem value="Male">Nam</MenuItem>
//                     <MenuItem value="Female">Nữ</MenuItem>
//                 </Select>
//             </FormControl>
//             <Button variant="contained" color="primary" type="submit" fullWidth>
//                 Đăng ký
//             </Button>
//         </form>
//     );
// };

// export default Register;



import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { fetchRegister } from '../../service/authAPI'; // Import hàm fetch từ file khác
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [gender, setGender] = useState('');
    const [emailError, setEmailError] = useState(''); // Thêm state để lưu thông báo lỗi email
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const onSubmit = async (data) => {
        setEmailError(''); // Reset thông báo lỗi email khi bắt đầu gửi form
        try {
            data.gender = gender; // Gán giá trị gender
            await fetchRegister(data);
            alert('Đăng ký thành công!');
            navigate('/'); // Điều hướng về trang chủ
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data; // Lấy thông điệp lỗi từ response
                if (errorMessage === "This email already exist") {
                    setEmailError('Email đã tồn tại'); // Thiết lập thông báo lỗi
                } else {
                    setEmailError('Lỗi không xác định'); // Thông báo lỗi khác
                }
            } else {
                console.error('Đăng ký thất bại:', error);
            }
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400, margin: 'auto' }}>
            <TextField
                label="Email"
                fullWidth
                margin="normal" // Thêm margin
                {...register('email', { required: 'Email là bắt buộc', pattern: /^\S+@\S+$/i })}
                error={!!errors.email || !!emailError} // Kiểm tra lỗi từ react-hook-form hoặc emailError
                helperText={errors.email?.message || emailError} // Hiển thị thông báo lỗi
                FormHelperTextProps={{
                    sx: { color: !!emailError ? 'error.main' : undefined } // Đặt màu cho helperText nếu có lỗi
                }}
            />
            <TextField
                label="Password"
                type="password" 
                fullWidth
                margin="normal"
                {...register('password', { required: 'Mật khẩu là bắt buộc', minLength: { value: 6, message: 'Mật khẩu phải ít nhất 6 ký tự' } })}
                error={!!errors.password}
                helperText={errors.password?.message}
            />
            <TextField
                label="First Name"
                fullWidth
                margin="normal"
                {...register('fName', { required: 'First Name là bắt buộc' })}
                error={!!errors.fName}
                helperText={errors.fName?.message}
            />
            <TextField
                label="Middle Name"
                fullWidth
                margin="normal"
                {...register('mName')}
            />
            <TextField
                label="Last Name"
                fullWidth
                margin="normal"
                {...register('lName', { required: 'Last Name là bắt buộc' })}
                error={!!errors.lName}
                helperText={errors.lName?.message}
            />
            <TextField
                label="Phone"
                fullWidth
                margin="normal"
                {...register('phone', { required: 'Phone là bắt buộc', pattern: /^[0-9]+$/i })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                    value={gender}
                    onChange={handleGenderChange}
                    label="Gender"
                    required
                >
                    <MenuItem value="Male">Nam</MenuItem>
                    <MenuItem value="Female">Nữ</MenuItem>
                </Select>
            </FormControl>
            <Button variant="contained" color="primary" type="submit" fullWidth>
                Đăng ký
            </Button>
        </form>
    );
};

export default Register;