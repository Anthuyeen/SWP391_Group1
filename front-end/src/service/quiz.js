//view all quiz
export const fetchQuizzes = async () => {
    try {
        const response = await fetch('https://localhost:7043/api/Quiz/ViewAllQuiz/ViewAllQuiz');
        if (!response.ok) {
            throw new Error('Failed to fetch quizzes');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
    }
};
// add quiz
export const addQuiz = async (quizData) => {
    try {
      const response = await fetch("https://localhost:7043/api/Quiz/AddQuiz/AddQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add quiz");
      }
    } catch (error) {
      console.error("Failed to add quiz", error);
      throw error;
    }
  };
//delete quiz
  export const deleteQuiz = async (id) => {
    const response = await fetch(`https://localhost:7043/api/Quiz/DeleteQuiz/DeleteQuiz/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error("Failed to delete quiz");
    }
  
    // Không phân tích cú pháp phản hồi nếu không có nội dung
    if (response.status === 204) { // 204 No Content
      return; // Không cần trả về gì cả
    }
  
    return await response.json(); // Nếu có nội dung, phân tích cú pháp nó
  };
//edit quiz
export const editQuiz = async (id, quiz) => {
    const response = await fetch(`https://localhost:7043/api/Quiz/EditQuiz/EditQuiz/${id}`, {
      method: 'PUT', // Hoặc 'PATCH' nếu API yêu cầu
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quiz),
    });
  
    if (!response.ok) {
      throw new Error("Failed to edit quiz");
    }
    
    return await response.json(); // Nếu có nội dung trả về
  }; 