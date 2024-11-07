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
//delete post
// post.js
export const fetchDeletePost = async (postId) => {
    const response = await fetch(`https://localhost:7043/api/Post/DeletePost/DeletePost/${postId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            // Thêm các header khác nếu cần (ví dụ: Authorization)
        },
    });

    if (!response.ok) {
        const errorText = await response.text(); // Đọc nội dung phản hồi
        throw new Error(`Failed to delete post: ${errorText}`);
    }

    // Kiểm tra xem phản hồi có nội dung không trước khi phân tích cú pháp
    if (response.status !== 204) { // Nếu trả về No Content (204), không cần phân tích cú pháp
        const data = await response.json(); // Chỉ phân tích cú pháp nếu có dữ liệu
        return data;
    }
    
    return; // Trả về undefined nếu không có dữ liệu
};
//edit post
export const fetchEditPost = async (postId, postData) => {
    const response = await fetch(`https://localhost:7043/api/Post/EditPost/EditPost/${postId}`, {
        method: 'PUT', // Sử dụng PUT để chỉnh sửa dữ liệu
        headers: {
            'Content-Type': 'application/json', // Đặt header cho định dạng JSON
        },
        body: JSON.stringify(postData), // Chuyển đổi dữ liệu thành chuỗi JSON
    });

    if (!response.ok) {
        throw new Error('Failed to edit post');
    }

    return await response.json(); // Trả về dữ liệu phản hồi (nếu có)
};

