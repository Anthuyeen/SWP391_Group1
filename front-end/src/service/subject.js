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
      const response = await fetch(`https://localhost:7043/api/SubjectCompletion/${userId}/${subjectId}`, {
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
// approve subject
export const updateSubjectStatus = async (subjectId, status) => {
  try {
    const response = await fetch(`https://localhost:7043/api/Subject/UpdateSubjectStatus/${subjectId}/status?status=${status}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Thêm các headers khác nếu cần, ví dụ như Authorization
      },
    });

    if (response.status === 200) {
      console.log("Subject status updated successfully.");
      return { success: true };
    } else {
      throw new Error(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error updating subject status:', error);
    throw error;
  }
};
//subject complete
export const fetchSubjectCompletion = async (userId, subjectId) => {
  const url = `https://localhost:7043/api/SubjectCompletion`;
  
  // Lấy ngày hiện tại
  const completionDate = new Date().toISOString(); // Chuyển đổi thành chuỗi ISO

  const body = JSON.stringify({ 
      userId, 
      subjectId, 
      completionDate // Thêm trường completionDate vào payload
  });

  try {
      const response = await fetch(url, {
          method: 'POST', // Hoặc 'GET' nếu API của bạn hỗ trợ
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}` // Nếu bạn cần token xác thực
          },
          body: body
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Kiểm tra và gán giá trị mặc định cho status và Certificate
      const status = data.status === true; // Đảm bảo status là boolean
      const certificate = typeof data.Certificate === 'string' ? data.Certificate : '';

      return { status, certificate }; // Trả về đối tượng với status và certificate
  } catch (error) {
      console.error('Error fetching subject completion:', error);
      return { status: false, certificate: '' }; // Trả về giá trị mặc định nếu có lỗi
  }
};
