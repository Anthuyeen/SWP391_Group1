//viwe list
export const fetchUsers = async () => {
    try {
        const response = await fetch('https://localhost:7043/api/UserManagement/ViewListUser', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was an error fetching the users:', error);
        return null; 
    }
};
//post
export const addUser = async (userData) => {
    try {
        const response = await fetch('https://localhost:7043/api/UserManagement/AddExpert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`, // Nếu cần xác thực
            },
            body: JSON.stringify(userData), // Chuyển đổi dữ liệu người dùng thành chuỗi JSON
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Trả về dữ liệu JSON từ API
    } catch (error) {
        console.error('There was an error adding the user:', error);
        return null; // Trả về null hoặc bạn có thể quyết định trả về một giá trị khác khi xảy ra lỗi
    }
};
