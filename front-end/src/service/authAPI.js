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
