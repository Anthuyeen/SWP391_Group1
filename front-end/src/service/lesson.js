// get lesson by subject id
export const fetchLessonsBySubjectId = async (subjectId) => {
    const url = `https://localhost:7043/api/Subject/GetLessonsBySubjectId/GetLessonsBySubjectId/${subjectId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data.$values;
    } catch (error) {
        console.error('Failed to fetch lessons:', error);
        throw error;
    }
};
//delete lesson
export const deleteLesson = async (lessonId) => {
    const response = await fetch(`https://localhost:7043/api/Lesson/DeleteLesson/DeleteLesson/${lessonId}`, {
        method: 'DELETE',
    });

    // Nếu mã trạng thái không phải là 2xx, ném lỗi
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    // Không phân tích cú pháp JSON nếu không có nội dung
    return response.status === 204 ? null : await response.json();
};
//add lesson
export const addLesson = async (lessonData) => {
    try {
        const response = await fetch('https://localhost:7043/api/Lesson/AddLesson/AddLesson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lessonData), // Chuyển đổi dữ liệu bài học thành chuỗi JSON
        });

        if (!response.ok) {
            throw new Error(`Error adding lesson: ${response.statusText}`);
        }

        // Kiểm tra nếu trạng thái không phải 204, mới phân tích cú pháp JSON
        if (response.status !== 204) {
            const data = await response.json();
            return data; // Trả về dữ liệu từ phản hồi
        }
        // Nếu trạng thái là 204, không có dữ liệu để trả về
        return null; // Hoặc có thể trả về một giá trị mặc định nào đó
    } catch (error) {
        console.error('Failed to add lesson:', error);
        throw error;
    }
};
//edit lesson
export const editLesson = async (lessonId, updatedLessonData) => {
    try {
      const response = await fetch(`https://localhost:7043/api/Lesson/EditLesson/EditLesson/${lessonId}`, {
        method: 'PUT', // Use PUT method for updating data
        headers: {
          'Content-Type': 'application/json', // Specify that the data being sent is JSON
        },
        body: JSON.stringify(updatedLessonData), // Convert the lesson data to JSON
      });
  
      if (!response.ok) {
        throw new Error('Failed to update the lesson');
      }
  
      // Assuming the response may not include a JSON payload (as per previous API behavior)
      return { success: true };
    } catch (error) {
      console.error('Error updating lesson:', error);
      return { success: false, error: error.message };
    }
  };
// set status lesson
export const updateLessonStatus = async (lessonId, status) => {
    try {
        const response = await fetch(`https://localhost:7043/api/Lesson/UpdateLessonStatus/${lessonId}/status`, {
            method: 'PUT', // Hoặc 'PATCH' tùy thuộc vào API
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to update lesson status');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating lesson status:', error);
        throw error;
    }
};
//finish lesson
export const fetchLessonCompletion = async (userId, lessonId) => {
    try {
      const response = await fetch('https://localhost:7043/api/LessonCompletion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          lessonId: lessonId,
          completionDate: new Date().toISOString(), // Ngày hoàn thành hiện tại
          status: true, // Cờ đánh dấu hoàn thành
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to complete lesson');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw error;
    }
  };
//get lesson finish
export const fetchLessonCompletionList = async (subjectId, userId) => {
    try {
      const response = await fetch(`https://localhost:7043/api/Lesson/ListAllLessonComplete?subjectId=${subjectId}&userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch lesson completion list');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching lesson completion list:", error);
      return null;
    }
  };
  
  