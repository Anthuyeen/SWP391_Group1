//view all quiz
export const fetchQuizzes = async () => {
    try {
        const response = await fetch('https://localhost:7043/api/Quiz/ViewAllQuiz/ViewAllQuiz');
        if (!response.ok) {
            throw new Error('Failed to fetch quizzes');
        }
        const data = await response.json();
        return data.$values;
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
  //view quiz by expert
  export const fetchQuizzesByExpert = async (expertId) => {
    try {
      const response = await fetch(`https://localhost:7043/api/Quiz/GetQuizzesByExpert/GetQuizzesByExpert/${expertId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Thêm các headers khác nếu cần, ví dụ như Authorization nếu có token
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json(); // Parse JSON từ response
      return data.$values; // Trả về dữ liệu quiz từ API
    } catch (error) {
      console.error("Failed to fetch quizzes by expert:", error);
      throw error; // Ném lỗi để có thể xử lý ngoài
    }
  };
  //view subject by expert
  // service/subject.js

export const fetchSubjectsByExpert = async (expertId) => {
  try {
    const response = await fetch(`https://localhost:7043/api/Subject/ViewSubjectsByOwner/ViewSubjectsByOwner/${expertId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.$values; // Giả sử data là một mảng các subject
  } catch (error) {
    console.error('Error fetching subjects by expert:', error);
    throw error;
  }
};
//get question by quiz id
// questionService.js
// src/service/quiz.js
export const fetchQuestionsByQuizId = async (quizId) => {
  try {
    const response = await fetch(`https://localhost:7043/api/QA/GetQuizDetails/GetQuizDetails/${quizId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Trả về dữ liệu câu hỏi
  } catch (error) {
    console.error("Failed to fetch questions", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};



// export const fetchQuestionsByQuizId = async (quizId) => {
//   try {
//     const response = await fetch(`https://localhost:7043/api/QA/GetQuizDetails/GetQuizDetails/${quizId}`);

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();

//     // Kiểm tra xem data.questions có tồn tại và là mảng không
//     if (data.questions && data.questions.$values) {
//       // Trả về dữ liệu câu hỏi và xử lý các câu trả lời
//       return data.questions.$values.map(question => ({
//         id: question.id,
//         content: question.content,
//         mediaUrl: question.mediaUrl,
//         status: question.status,
//         answers: question.answers.$values.map(answer => ({
//           id: answer.id,
//           content: answer.content,
//           isCorrect: answer.isCorrect
//         }))
//       }));
//     } else {
//       throw new Error("Questions data is not available");
//     }
//   } catch (error) {
//     console.error("Failed to fetch questions", error);
//     throw error; // Ném lỗi để xử lý ở nơi gọi
//   }
// };


//edit question
// export const editQuestion = async (questionId, updatedQuestion) => {
//   const url = `https://localhost:7043/api/QA/EditQuestion/EditQuestion/${questionId}`;
  
//   try {
//       const response = await fetch(url, {
//           method: 'PUT',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(updatedQuestion),
//       });

//       console.log('Response Status:', response.status); // In mã trạng thái

//       if (!response.ok) {
//           const errorText = await response.text();
//           console.error('Error response:', errorText);
//           throw new Error('Failed to update question');
//       }

//       // Đọc phản hồi như văn bản
//       const successMessage = await response.text();
//       return successMessage;
//   } catch (error) {
//       console.error('Error updating question:', error);
//       throw error; 
//   }
// };


export const editQuestion = async (questionId, updatedQuestion) => {
  const url = `https://localhost:7043/api/QA/EditQuestion/EditQuestion/${questionId}`;
  
  try {
      const response = await fetch(url, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedQuestion),
      });

      // Kiểm tra mã trạng thái
      if (!response.ok) {
          throw new Error('Failed to update question');
      }

      // Trả về true nếu cập nhật thành công
      return true;
  } catch (error) {
      console.error('Error updating question:', error);
      throw error; 
  }
};




//add question
// export const addQuestionsToQuiz = async (quizId, newQuestions) => {
//   const url = `https://localhost:7043/api/QA/AddQuestionsToQuiz/AddQuestionsToQuiz/${quizId}`;
  
//   try {
//       const response = await fetch(url, {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(newQuestions), // Chuyển đổi đối tượng câu hỏi mới thành JSON
//       });

//       // Lấy nội dung phản hồi dưới dạng văn bản
//       const text = await response.text(); 

//       if (!response.ok) {
//           throw new Error(`Failed to add questions to the quiz: ${text}`); // Bao gồm nội dung phản hồi
//       }

//       // Trả về nội dung phản hồi như một chuỗi
//       return text; 
//   } catch (error) {
//       console.error('Error adding questions to quiz:', error);
//       throw error; // Ném lại lỗi để xử lý ở nơi khác nếu cần
//   }
// };

export const addQuestionsToQuiz = async (quizId, newQuestions) => {
  const url = `https://localhost:7043/api/QA/AddQuestionsToQuiz/AddQuestionsToQuiz/${quizId}`;
  
  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(newQuestions), // Chuyển đổi đối tượng câu hỏi mới thành JSON
      });

      console.log('Response Status:', response.status); // In mã trạng thái

      if (!response.ok) {
          // Kiểm tra phản hồi có thể không phải là JSON
          const errorText = await response.text(); // Đọc phản hồi như văn bản
          throw new Error(`Failed to add questions to the quiz: ${errorText}`);
      }

      // Đọc phản hồi như văn bản khi thành công
      const successMessage = await response.text();
      return successMessage; 
  } catch (error) {
      console.error('Error adding questions to quiz:', error);
      throw error; 
  }
};

//quiz detail
export const fetchQuizDetails = async (quizId) => {
  try {
      const response = await fetch(`https://localhost:7043/api/QA/GetQuizDetails/GetQuizDetails/${quizId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              // Nếu API yêu cầu token để xác thực, thêm Authorization header
              // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      });

      if (!response.ok) {
          throw new Error(`Error fetching quiz details: ${response.statusText}`);
      }

      const data = await response.json();
      return data; // Trả về dữ liệu quiz
  } catch (error) {
      console.error('Lỗi khi gọi API lấy chi tiết quiz:', error);
      throw error; // Ném lỗi để xử lý tiếp ở component gọi hàm này
  }
};

//submit quiz
export const submitQuiz = async (quizId, userId, startTime, answers) => {
  try {
    const response = await fetch('https://localhost:7043/api/Quiz/SubmitQuiz/SubmitQuiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quizId,
        userId,
        startTime,
        answers
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to submit quiz:', response.status);
    }
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
};
// get quiz attemp
export const fetchQuizAttemptsByUserId = async (userId) => {
  try {
      const response = await fetch(`https://localhost:7043/api/Quiz/GetQuizAttemptsByUserId/user/${userId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              // Thêm các header khác nếu cần, ví dụ: Authorization
          },
      });

      // Kiểm tra nếu phản hồi không thành công
      if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      // Chuyển đổi phản hồi thành JSON
      const data = await response.json();
      return data.$values;
  } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
  }
};

//get quiz user take by attemp id
export const fetchQuizAttemptById = async (quizAttemptId) => {
  try {
      const response = await fetch(`https://localhost:7043/api/Quiz/GetQuizAttemptById/${quizAttemptId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              // Nếu cần token hoặc bất kỳ header nào khác, thêm vào đây
              // 'Authorization': `Bearer ${token}`
          },
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data; // Trả về dữ liệu
  } catch (error) {
      console.error('Failed to fetch quiz attempt:', error);
      throw error; // Ném lỗi ra ngoài để xử lý ở nơi gọi
  }
};
//import quiz
export const fetchImportQuestions = async (quizId, file) => {
  const url = `https://localhost:7043/api/Quiz/ImportQuestions/import/${quizId}`;

  // Tạo FormData để chứa file
  const formData = new FormData();
  formData.append('file', file);

  try {
      const response = await fetch(url, {
          method: 'POST',
          body: formData
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to import questions: ${errorText}`);
      }

      // Parse dữ liệu JSON từ phản hồi của API
      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error importing questions:", error);
      throw error; // Ném lỗi để xử lý ở component gọi hàm
  }
};

