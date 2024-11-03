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
//add post
export const fetchAddPost = async (postData) => {
    const url = "https://localhost:7043/api/Post/AddPost/AddPost";

    try {
        const response = await fetch(url, {
            method: "POST", // Phương thức gửi là POST
            headers: {
                "Content-Type": "application/json", // Định dạng dữ liệu là JSON
            },
            body: JSON.stringify(postData), // Chuyển đổi dữ liệu sang chuỗi JSON
        });

        // Kiểm tra phản hồi từ API
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json(); // Phân tích dữ liệu JSON từ phản hồi
        return data; // Trả về dữ liệu
    } catch (error) {
        console.error("Error adding post:", error);
        throw error; // Ném lỗi ra ngoài nếu cần thiết
    }
};
//get all post category
export const fetchAllCategories = async () => {
    const url = "https://localhost:7043/api/Category/ListAllCategory/ListAllCategory"; // Đường dẫn đến API danh mục

    try {
        const response = await fetch(url, {
            method: "GET", // Sử dụng phương thức GET
            headers: {
                "Content-Type": "application/json", // Định dạng dữ liệu là JSON
            },
        });

        // Kiểm tra phản hồi từ API
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json(); // Phân tích dữ liệu JSON từ phản hồi
        return data; // Trả về dữ liệu
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error; // Ném lỗi ra ngoài nếu cần thiết
    }
};
