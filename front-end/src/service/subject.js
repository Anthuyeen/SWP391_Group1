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
      return data; // Trả về dữ liệu nhận được
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
    return data; // Return the fetched categories
} catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error; // Throw error for further handling
}
};

//create subject
// subject.js
export const createSubject = async (subjectData) => {
const response = await fetch('https://localhost:7043/api/Subject/AddSubject/AddSubject', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(subjectData),
});

if (!response.ok) {
  const errorData = await response.json(); // Lấy thông tin lỗi từ phản hồi
  throw new Error(`Error: ${response.status} ${errorData.message || response.statusText}`); // Thông báo lỗi chi tiết
}

const data = await response.json();
return data; // Trả về dữ liệu đã tạo
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
    return data;
  } catch (error) {
    console.error('Failed to fetch subjects by owner:', error);
    throw error;
  }
};
