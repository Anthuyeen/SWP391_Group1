import React, { useState } from 'react';
import { sendOtpEmail, verifyOtpAndResetPassword } from '../../service/authAPI'; // Đường dẫn tới file chứa hàm sendOtpEmail và verifyOtp
import NavBar from '../navbar/index';
import Footer from '../footer/index';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false); // Trạng thái để kiểm tra xem OTP đã được gửi hay chưa

    const handleSendOtp = async () => {
        if (!email) {
            setMessage('Vui lòng nhập email!');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await sendOtpEmail(email);
            setMessage('OTP đã được gửi thành công đến email của bạn!');
            setOtpSent(true); // Đặt trạng thái để hiển thị ô nhập OTP
        } catch (error) {
            setMessage('Gửi OTP thất bại! Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            setMessage('Vui lòng nhập OTP!');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // Gọi hàm verifyOtp để xác thực OTP
            await verifyOtpAndResetPassword(email, otp);
            setMessage('Xác thực thành công! Bạn có thể đặt lại mật khẩu.');
            // Có thể điều hướng tới trang đặt lại mật khẩu nếu cần
        } catch (error) {
            setMessage('Xác thực OTP thất bại! Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar />
            <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
                <h2>Quên Mật Khẩu</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />
                <button onClick={handleSendOtp} disabled={loading} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    {loading ? 'Đang gửi...' : 'Gửi OTP'}
                </button>
                {message && <p style={{ marginTop: '10px', color: 'red' }}>{message}</p>}

                {/* Hiển thị ô nhập OTP nếu OTP đã được gửi thành công */}
                {otpSent && (
                    <>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Nhập OTP"
                            style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                        />
                        <button onClick={handleVerifyOtp} disabled={loading} style={{ padding: '10px 15px', cursor: 'pointer' }}>
                            {loading ? 'Đang xác thực...' : 'Xác thực'}
                        </button>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ForgotPassword;
