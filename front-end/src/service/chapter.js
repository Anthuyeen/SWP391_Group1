//get all chapter
export const fetchChapters = async () => {
    try {
      const response = await fetch('https://localhost:7043/api/Chapter', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Kiểm tra nếu response thành công
      if (!response.ok) {
        throw new Error('Failed to fetch chapters');
      }
  
      // Chuyển đổi response thành JSON
      const data = await response.json();
      return data.$values;
    } catch (error) {
      console.error('Error fetching chapters:', error);
      throw error;
    }
  };
//get chapter by subject id
export const fetchChaptersBySubjectId = async (subjectId) => {
    try {
      const response = await fetch(`https://localhost:7043/api/Chapter/ViewAllChapterBySubjectId/${subjectId}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching chapters: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.$values;
    } catch (error) {
      console.error("Failed to fetch chapters", error);
      throw error;  // Propagate the error if needed for further handling
    }
  };
// get chapter detail
// src/api/chapterApi.js
export const fetchChapterDetails = async (chapterId) => {
  try {
    const response = await fetch(`https://localhost:7043/api/Chapter/ViewChapterDetails/${chapterId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching chapter details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chapter details:', error);
    throw error; // Rethrow the error so it can be handled later
  }
};
//add chapter
export const addChapter = async (chapterData) => {
  try {
      const response = await fetch('https://localhost:7043/api/Chapter/AddChapter', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(chapterData), // Chuyển đổi dữ liệu chapter thành chuỗi JSON
      });

      // Kiểm tra nếu phản hồi không thành công
      if (!response.ok) {
          throw new Error(`Error adding chapter: ${response.statusText}`);
      }

      // Kiểm tra nếu phản hồi trả về dữ liệu (không phải là mã 204)
      if (response.status !== 204) {
          const data = await response.json(); // Phân tích cú pháp phản hồi JSON
          return data; // Trả về dữ liệu từ API
      }

      // Nếu phản hồi không có dữ liệu (mã 204 No Content)
      return null;
  } catch (error) {
      console.error('Failed to add chapter:', error);
      throw error; // Ném lỗi để xử lý bên ngoài
  }
};
//edit chapter
export const editChapter = async (chapterId, chapterData) => {
  try {
      const response = await fetch(`https://localhost:7043/api/Chapter/EditChapter/${chapterId}`, {
          method: 'PUT', // Use PUT for updating
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(chapterData), // Convert chapter data to JSON string
      });

      // Check if the request was successful
      if (!response.ok) {
          throw new Error(`Error editing chapter: ${response.statusText}`);
      }

      // If the response contains data, return it
      const data = await response.json();
      return data;

  } catch (error) {
      console.error('Failed to edit chapter:', error);
      throw error; // Throw error to handle it outside
  }
};
//set chapter status
export const updateChapterStatus = async (chapterId, newStatus) => {
  try {
      const response = await fetch(`https://localhost:7043/api/Chapter/${chapterId}/status`, {
          method: 'PUT', // Thay đổi trạng thái, có thể sử dụng PUT hoặc PATCH tùy thuộc vào API
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }), // Gửi trạng thái mới
      });

      // Kiểm tra nếu phản hồi không thành công
      if (!response.ok) {
          throw new Error(`Error updating chapter status: ${response.statusText}`);
      }

      // Kiểm tra nếu phản hồi trả về dữ liệu
      const data = await response.json(); // Phân tích cú pháp phản hồi JSON
      return data; // Trả về dữ liệu từ API
  } catch (error) {
      console.error('Failed to update chapter status:', error);
      throw error; // Ném lỗi để xử lý bên ngoài
  }
};
// progress chapter
// service/chapter.js

export const fetchChapterProgress = async (userId, chapterId) => {
  const url = `https://localhost:7043/api/Chapter/GetChapterProgress/user/${userId}/chapter/${chapterId}`;
  
  try {
      const response = await fetch(url, {
          method: 'GET', // Hoặc phương thức khác nếu cần
          headers: {
              'Content-Type': 'application/json',
              // Thêm token hoặc thông tin xác thực nếu cần
          }
      });

      // Kiểm tra phản hồi từ API
      if (!response.ok) {
          throw new Error('Lỗi khi tải dữ liệu');
      }

      const data = await response.json(); // Chuyển đổi phản hồi thành JSON
      return data; // Trả về dữ liệu
  } catch (error) {
      console.error('Lỗi trong fetchChapterProgress:', error);
      throw error; // Ném lỗi để xử lý ở nơi khác
  }
};
//check lesson complete
export const fetchCompletedLessons = async (chapterId, userId) => {
  const url = `https://localhost:7043/api/Chapter/ViewCompletedLessons/${chapterId}/${userId}`;

  try {
    const response = await fetch(url, {
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
    console.error('Error fetching completed lessons:', error);
    throw error;
  }
};
//chapter complete
export const fetchChapterCompletion = async ({ userId, chapterId, subjectId, completionDate, status }) => {
  try {
      const response = await fetch("https://localhost:7043/api/ChapterCompletion", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, chapterId, subjectId, completionDate, status }),
      });
      if (response.status === 409) {
          // Ném ra lỗi với mã 409 nếu người dùng đã hoàn thành chương
          const message = await response.text(); // Đọc nội dung của phản hồi
          throw new Error(message); // Ném ra lỗi với thông điệp từ server
      }
      if (!response.ok) throw new Error("Failed to complete chapter");
      return await response.json();
  } catch (error) {
      console.error("Error completing chapter:", error);
      throw error; // Ném lỗi ra ngoài để xử lý ở nơi gọi
  }
};

