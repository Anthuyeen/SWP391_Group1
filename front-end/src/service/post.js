// service/post.js

export const fetchAllPosts = async () => {
    try {
        const response = await fetch('https://localhost:7043/api/Post/ListAllPosts/ListAllPosts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Thêm các header khác nếu cần, ví dụ: Authorization
            },
        });

        // Kiểm tra nếu phản hồi không phải 2xx
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Chuyển đổi phản hồi thành JSON
        const data = await response.json();
        return data.$values; // Trả về dữ liệu
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};
//fetch post by id
export const fetchPostById = async (id) => {
    try {
        const response = await fetch(`https://localhost:7043/api/Post/GetPost/GetPost/${id}`);

        // Kiểm tra xem phản hồi có thành công hay không
        if (!response.ok) {
            throw new Error('Lỗi khi tải bài viết: ' + response.statusText);
        }

        // Chuyển đổi phản hồi thành JSON
        const data = await response.json();
        return data; // Trả về dữ liệu bài viết
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

