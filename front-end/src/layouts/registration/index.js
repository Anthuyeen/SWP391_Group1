import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Paper, Typography } from '@mui/material';
import { fetchRegister } from '../../service/authAPI';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/index';
import Footer from '../footer/index';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [gender, setGender] = useState('');
    const [emailError, setEmailError] = useState('');
    const navigate = useNavigate();

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const onSubmit = async (data) => {
        setEmailError('');
        try {
            data.gender = gender;
            await fetchRegister(data);
            alert('Đăng ký thành công!');
            navigate('/');
        } catch (error) {
            const errorMessage = error.message;
            setEmailError(errorMessage);
        }
    };

    return (
        <>
            <Navbar />
            <Grid container justifyContent="center" style={{ padding: '2rem' }}>
                <Grid item xs={12} sm={8} md={6}>
                    <Paper elevation={3} style={{ padding: '2rem', borderRadius: '8px' }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Đăng Ký
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                label="Email"
                                fullWidth
                                margin="normal"
                                {...register('email', { required: 'Email là bắt buộc', pattern: /^\S+@\S+$/i })}
                                error={!!errors.email || !!emailError}
                                helperText={errors.email?.message || emailError}
                                FormHelperTextProps={{
                                    sx: { color: !!emailError ? 'error.main' : undefined }
                                }}
                            />
                            <TextField
                                label="Mật khẩu"
                                type="password"
                                fullWidth
                                margin="normal"
                                {...register('password', { required: 'Mật khẩu là bắt buộc', minLength: { value: 6, message: 'Mật khẩu phải ít nhất 6 ký tự' } })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                            <TextField
                                label="Họ"
                                fullWidth
                                margin="normal"
                                {...register('fName', { required: 'Họ là bắt buộc' })}
                                error={!!errors.fName}
                                helperText={errors.fName?.message}
                            />
                            <TextField
                                label="Tên đệm"
                                fullWidth
                                margin="normal"
                                {...register('mName')}
                            />
                            <TextField
                                label="Tên"
                                fullWidth
                                margin="normal"
                                {...register('lName', { required: 'Tên là bắt buộc' })}
                                error={!!errors.lName}
                                helperText={errors.lName?.message}
                            />
                            <TextField
                                label="Số điện thoại"
                                fullWidth
                                margin="normal"
                                {...register('phone', { required: 'Số điện thoại là bắt buộc', pattern: /^[0-9]+$/i })}
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Giới tính</InputLabel>
                                <Select
                                    value={gender}
                                    onChange={handleGenderChange}
                                    label="Giới tính"
                                    required
                                >
                                    <MenuItem value="Male">Nam</MenuItem>
                                    <MenuItem value="Female">Nữ</MenuItem>
                                </Select>
                            </FormControl>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                type="submit" 
                                fullWidth 
                                style={{ marginTop: '1rem' }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1976d2')}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '')}
                            >
                                Đăng ký
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
            <Footer />
        </>
    );
};

export default Register;
