//List All Subject
export const fetchAllSubjects = async () => {
  const url = 'https://localhost:7043/api/Subject/ViewAllSubject/ViewAllSubject';

  try {
      const response = await fetch(url, {
          method: 'GET', // Sử dụng phương thức GET
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.$values; // Trả về dữ liệu nhận được
  } catch (error) {
      console.error('Failed to fetch subjects:', error);
      throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
}; 

//list Category
export const fetchCategories = async () => {
const url = 'https://localhost:7043/api/Category/ListAllCategory/ListAllCategory'; // Replace with your actual API endpoint

try {
    const response = await fetch(url, {
        method: 'GET', // Using GET method
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.$values; // Return the fetched categories
} catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error; // Throw error for further handling
}
};

//create subject
// subject.js
// export const createSubject = async (subjectData) => {
//   const response = await fetch('https://localhost:7043/api/Subject/AddSubject/AddSubject', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(subjectData),
//   });

//   // Kiểm tra nếu phản hồi không thành công
//   if (!response.ok) {
//     let errorMessage = `Error: ${response.status} ${response.statusText}`;

//     // Không cố parse JSON nếu server chỉ trả về mã trạng thái
//     throw new Error(errorMessage); 
//   }

//   // Nếu phản hồi thành công mà không có nội dung trả về (trường hợp chỉ trả về mã trạng thái)
//   return { success: true };
// };
export const createSubject = async (subjectData) => {
  const response = await fetch('https://localhost:7043/api/Subject/AddSubject/AddSubject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subjectData),
  });

  // Kiểm tra nếu phản hồi không thành công
  if (!response.ok) {
    let errorMessage = `Error: ${response.status} ${response.statusText}`;

    // Không cố parse JSON nếu server chỉ trả về mã trạng thái
    throw new Error(errorMessage); 
  }

  // Nếu phản hồi thành công nhưng không có nội dung JSON trả về
  // Bạn có thể trả về ID hoặc bất kỳ thông tin nào mà bạn mong muốn
  // Nếu API trả về một thông điệp thành công bạn cũng có thể muốn lấy nó từ headers hoặc trạng thái
  return {
    success: true,
    message: 'Subject created successfully',
    // Nếu có ID mới từ API, bạn có thể thêm nó vào đối tượng trả về, nếu không bạn có thể để lại trống
    // id: response.headers.get('Location') // Nếu API trả về URL của tài nguyên mới
  };
};


//edit subject
// Hàm editSubject trong subject.js
export const editSubject = async (id, subjectData) => {
const response = await fetch(`https://localhost:7043/api/Subject/EditSubject/EditSubject/${id}`, {
  method: 'PUT', // Hoặc POST tùy thuộc vào API
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(subjectData),
});

if (!response.ok) {
  throw new Error(`Error: ${response.statusText}`);
}

// Chỉ phân tích phản hồi nếu nó có nội dung
const data = await response.text();
return data ? JSON.parse(data) : {}; // Trả về đối tượng rỗng nếu không có nội dung
};


//delete subject
export const deleteSubject = async (subjectId) => {
try {
    const response = await fetch(`https://localhost:7043/api/Subject/DeleteSubject/DeleteSubject/${subjectId}`, {
        method: 'DELETE', // Sử dụng DELETE cho việc xóa
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - Unable to delete subject`);
    }

    return 'Subject deleted successfully';
} catch (error) {
    console.error('Error deleting subject:', error);
    throw error;
}
};



// get subject by owner id
export const fetchSubjectsByOwner = async (ownerId) => {
  try {
    const response = await fetch(`https://localhost:7043/api/Subject/ViewSubjectsByOwner/ViewSubjectsByOwner/${ownerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching subjects: ${response.statusText}`);
    }

    const data = await response.json();
    return data.$values;
  } catch (error) {
    console.error('Failed to fetch subjects by owner:', error);
    throw error;
  }
};
//get subject by id
export const fetchSubjectById = async (subjectId) => {
  try {
      const response = await fetch(`https://localhost:7043/api/Subject/GetSubjectById/GetSubjectById/${subjectId}`, {
          method: 'GET', // phương thức HTTP, trong trường hợp này là GET
          headers: {
              'Content-Type': 'application/json', // chỉ định kiểu dữ liệu gửi đi là JSON
              // thêm Authorization nếu cần, ví dụ nếu cần token để truy cập
              // 'Authorization': `Bearer ${yourToken}`,
          }
      });

      // Kiểm tra xem yêu cầu có thành công không
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse JSON từ response
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching subject by id:', error);
      throw error; // nếu muốn bắt lỗi ở nơi khác có thể ném lỗi này ra
  }
};

// uplaod image
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file); // Thêm file vào formData

    const response = await fetch('https://localhost:7043/api/Upload/upload', {
      method: 'POST',
      body: formData, // Gửi dữ liệu file
      headers: {
        // Có thể thêm Authorization hoặc headers khác nếu cần
      }
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json(); // Kết quả sau khi ảnh được upload lên Cloudinary
    return data; // Trả về thông tin URL hoặc id của ảnh trên Cloudinary
  } catch (error) {
    console.error('Error during upload:', error);
    throw error;
  }
};

//get progress subject
export const fetchSubjectProgress = async (userId, subjectId) => {
  try {
      const response = await fetch(`https://localhost:7043/api/Subject/GetSubjectProgress/GetSubjectProgress/user/${userId}/subject/${subjectId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}` // nếu cần token để xác thực
          }
      });

      if (!response.ok) {
          throw new Error('Failed to fetch subject progress');
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching subject progress:', error);
      throw error;
  }
};
