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
