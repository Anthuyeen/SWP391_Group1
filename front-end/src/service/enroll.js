// enrollAPI.js
export const fetchRegisterSubject = async (accId, subId) => {
    const url = `https://localhost:7043/api/Enroll/RegisterSubject?accid=${accId}&subid=${subId}`;

    try {
        const response = await fetch(url, {
            method: 'POST', // Hoặc 'GET', tùy thuộc vào cách API của bạn được thiết kế
            headers: {
                'Content-Type': 'application/json',
                // Thêm header Authorization nếu cần
                // 'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching register subject:', error);
        throw error; // Ném lỗi ra ngoài để xử lý ở nơi gọi hàm
    }
};
