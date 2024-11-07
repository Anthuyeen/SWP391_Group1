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
//check reghis status
export const fetchRegistrationStatus = async (accId, subId) => {
    const apiUrl = `https://localhost:7043/api/Enroll/CheckStatusSubject?accid=${accId}&subid=${subId}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text(); // Lấy chuỗi trả về từ API
        return data; // Trả về kết quả là chuỗi
    } catch (error) {
        console.error('Error fetching registration status:', error);
        throw error;
    }
};

// export const fetchRegistrationStatus = async (accId, subId) => {
//     const apiUrl = `https://localhost:7043/api/Enroll/CheckStatusSubject?accid=${accId}&subid=${subId}`;

//     try {
//         const response = await fetch(apiUrl, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.text(); // Lấy chuỗi trả về từ API

//         if (data === "Bạn đã đăng ký môn học này") {
//             return { registered: true, message: data }; // Đã đăng ký môn học
//         } else {
//             return { registered: false, price: data }; // Chưa đăng ký, trả về giá tiền
//         }
//     } catch (error) {
//         console.error('Error fetching registration status:', error);
//         throw error;
//     }
// };
