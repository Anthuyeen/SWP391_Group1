// login
export const fetchLogin = async (email, password) => {
    const response = await fetch('https://localhost:7043/api/Authentication/Login/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    // Kiểm tra nếu response không thành công (ví dụ 404 hoặc 500)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Đảm bảo rằng bạn chỉ parse JSON khi response là JSON
    const data = await response.json();
    return data.token; // Giả sử token được trả về từ trường 'token'
};
//register
// export const fetchRegister = async (userData) => {
//     const response = await fetch('https://localhost:7043/api/Authentication/Register', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//     });

//     if (!response.ok) {
//         throw new Error('Đăng ký thất bại');
//     }

//     return response.json();
// };

export const fetchRegister = async (userData) => {
    const response = await fetch('https://localhost:7043/api/Authentication/Register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorText = await response.text(); // Lấy thông báo lỗi từ response
        throw new Error(errorText); // Ném lỗi với thông báo chi tiết
    }

    return response.json();
};

//send otp to mail
export const sendOtpEmail = async (email) => {
    const url = `https://localhost:7043/api/Authentication/SendOtpEmail?email=${encodeURIComponent(email)}`;

    try {
        const response = await fetch(url, {
            method: 'POST', // Hoặc 'POST' nếu API yêu cầu
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Kiểm tra phản hồi từ server
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        // Kiểm tra xem phản hồi có phải là JSON hay không
        const contentType = response.headers.get('Content-Type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            // Nếu là JSON, phân tích cú pháp
            data = await response.json();
        } else {
            // Nếu không phải là JSON, xử lý như chuỗi văn bản
            data = await response.text();
        }

        return data; // Trả về dữ liệu phản hồi
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};
//verify otp
export const verifyOtpAndResetPassword = async (email, otp, newPassword) => {
    const url = 'https://localhost:7043/api/Authentication/VerifyOtpEmailAndResetPass';

    const body = {
        email: email,
        otp: otp,
        newPassword: newPassword,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        // Kiểm tra phản hồi từ server
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const contentType = response.headers.get('Content-Type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            // Nếu là JSON, phân tích cú pháp
            data = await response.json();
        } else {
            // Nếu không phải là JSON, xử lý như chuỗi văn bản
            data = await response.text();
        }

        return data; // Trả về dữ liệu phản hồi
    } catch (error) {
        console.error('Error verifying OTP and resetting password:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};
