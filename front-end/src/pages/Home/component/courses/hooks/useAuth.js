import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { fetchLogin } from '../../../../../service/authAPI'; // Thay đổi đường dẫn này đến nơi chứa hàm API của bạn

export const useAuth = () => {
    const [openLogin, setOpenLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        let isValid = true;

        if (!email || !validateEmail(email)) {
            setEmailError('Email không hợp lệ');
            isValid = false;
        }

        if (!password) {
            setPasswordError('Mật khẩu không được để trống');
            isValid = false;
        }

        if (isValid) {
            try {
                const token = await fetchLogin(email, password);
                const decodedToken = jwtDecode(token);
                
                localStorage.setItem('token', token);
                localStorage.setItem('expirationTime', (decodedToken.exp * 1000).toString());
                localStorage.setItem('role', decodedToken.role);
                localStorage.setItem('id', decodedToken.Id);
                localStorage.setItem('name', decodedToken.Name);

                setIsLoggedIn(true);
                setOpenLogin(false);
            } catch (error) {
                console.error('Đăng nhập thất bại:', error);
            }
        }
    };

    return {
        isLoggedIn,
        openLogin,
        email,
        password,
        emailError,
        passwordError,
        setEmail,
        setPassword,
        handleLogin,
        handleOpenLogin: () => setOpenLogin(true),
        handleCloseLogin: () => setOpenLogin(false)
    };
};
