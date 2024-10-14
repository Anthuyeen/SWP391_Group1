//get profile
const API_URL = 'https://localhost:7043/api/UserUpdate'; // Thay đổi đường dẫn đến API của bạn

export const fetchUserById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error('Không thể lấy thông tin người dùng'); // Xử lý lỗi nếu response không thành công
        }

        const data = await response.json(); // Chuyển đổi phản hồi thành JSON
        return data; // Giả sử response.data chứa thông tin user
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Ném lỗi để có thể xử lý ở nơi gọi
    }
};
//update profile
export const updateUser = async (userId, userData) => {
    try {
        const response = await fetch(`https://localhost:7043/api/UserUpdate/${userId}`, {
            method: 'PUT', // Phương thức PUT
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`, // Nếu có token
            },
            body: JSON.stringify(userData), // Chuyển đổi dữ liệu thành JSON
        });

        // Kiểm tra mã trạng thái
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`); // Ném lỗi nếu không thành công
        }

        // Nếu mã trạng thái là 204, không có nội dung để phân tích cú pháp
        // Trả về một thông điệp hoặc giá trị mặc định, ví dụ:
        return null; // Hoặc một giá trị khác bạn muốn
    } catch (error) {
        console.error("Error updating user data:", error);
        throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
    }
};
