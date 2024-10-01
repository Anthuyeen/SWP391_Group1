// import React, { useEffect, useState } from "react";
// import "../../../assets/css/quiz-manage.css";
// import { fetchQuizzes, addQuiz, editQuiz, deleteQuiz } from "../../../service/quiz";
// import { fetchAllSubjects } from "../../../service/subject"; // Giả sử bạn đã có hàm fetchSubjects từ API

// const QuizManage = () => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [subjects, setSubjects] = useState([]); // State để lưu danh sách subjects
//   const [newQuiz, setNewQuiz] = useState({
//     name: "",
//     level: "",
//     durationMinutes: 0,
//     passRate: 0,
//     type: "",
//     subjectId: null
//   });
//   const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     loadQuizzes();
//     loadSubjects(); // Load danh sách subjects
//   }, []);

//   const loadQuizzes = async () => {
//     try {
//       const data = await fetchQuizzes(); // Fetch quizzes from the API
//       setQuizzes(data);
//     } catch (error) {
//       console.error("Failed to load quizzes", error);
//     }
//   };

//   const loadSubjects = async () => {
//     try {
//       const data = await fetchAllSubjects(); // Fetch subjects từ API
//       setSubjects(data); // Cập nhật state subjects với dữ liệu trả về
//     } catch (error) {
//       console.error("Failed to load subjects", error);
//     }
//   };

//   const openModal = (quiz = null) => {
//     if (quiz) {
//       setSelectedQuiz(quiz);
//       setNewQuiz({
//         name: quiz.name,
//         level: quiz.level,
//         durationMinutes: quiz.durationMinutes,
//         passRate: quiz.passRate,
//         type: quiz.type,
//         subjectId: quiz.subjectId
//       });
//     } else {
//       setNewQuiz({ name: "", level: "", durationMinutes: 0, passRate: 0, type: "", subjectId: null });
//       setSelectedQuiz(null);
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedQuiz(null);
//     setNewQuiz({ name: "", level: "", durationMinutes: 0, passRate: 0, type: "", subjectId: null });
//   };

//   const handleAddOrEdit = async () => {
//     if (newQuiz.name.trim() === "") return;

//     try {
//       if (selectedQuiz) {
//         // Edit quiz
//         await editQuiz(selectedQuiz.id, newQuiz); // Call editQuiz API
//       } else {
//         // Add new quiz using API
//         await addQuiz(newQuiz);
//       }
//       // Reload quizzes data
//       await loadQuizzes();
//     } catch (error) {
//       console.error("Failed to add or edit quiz", error);
//     }

//     closeModal();
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteQuiz(id); // Call deleteQuiz API
//       // Reload quizzes data after deletion
//       await loadQuizzes();
//     } catch (error) {
//       console.error("Failed to delete quiz", error.message); // In ra thông báo lỗi
//     }
//   };

//   return (
//     <div className="main-container">
//       <div className="content">
//         <h1>Quiz Management</h1>
//         <button className="create-btn" onClick={() => openModal()}>
//           + CREATE QUIZ
//         </button>
//         <table className="quiz-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Level</th>
//               <th>Duration (minutes)</th>
//               <th>Pass Rate (%)</th>
//               <th>Type</th>
//               <th>Subject</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {quizzes.map((q) => (
//               <tr key={q.id}>
//                 <td>{q.id}</td>
//                 <td>{q.name}</td>
//                 <td>{q.level}</td>
//                 <td>{q.durationMinutes}</td>
//                 <td>{q.passRate}</td>
//                 <td>{q.type}</td>
//                 <td>{q.subjectName}</td>
//                 <td>
//                   <button className="edit-btn" onClick={() => openModal(q)}>
//                     Edit
//                   </button>
//                   <button
//                     className="delete-btn"
//                     onClick={() => handleDelete(q.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//    {isModalOpen && (
//   <div className="modal">
//     <div className="modal-content">
//       <h2>{selectedQuiz ? "Edit Quiz" : "Create Quiz"}</h2>

//       <input
//         type="text"
//         value={newQuiz.name}
//         onChange={(e) => setNewQuiz({ ...newQuiz, name: e.target.value })}
//         required
//         placeholder="Enter Quiz Name" // Thêm placeholder cho trường Name
//       />

//       <select
//         value={newQuiz.level}
//         onChange={(e) => setNewQuiz({ ...newQuiz, level: e.target.value })}
//         className="select-input"
//         required
//       >
//         <option value="">Select Level</option>
//         <option value="Easy">Easy</option>
//         <option value="Medium">Medium</option>
//         <option value="Hard">Hard</option>
//       </select>

//       <input
//         type="number"
//         value={newQuiz.durationMinutes}
//         onChange={(e) =>
//           setNewQuiz({ ...newQuiz, durationMinutes: e.target.value })
//         }
//         required
//         placeholder="Enter Duration (minutes)" // Thêm placeholder cho trường Duration
//       />

//       <input
//         type="number"
//         value={newQuiz.passRate}
//         onChange={(e) => setNewQuiz({ ...newQuiz, passRate: e.target.value })}
//         required
//         placeholder="Enter Pass Rate (%)" // Thêm placeholder cho trường Pass Rate
//       />

//       <select
//         value={newQuiz.type}
//         onChange={(e) => setNewQuiz({ ...newQuiz, type: e.target.value })}
//         className="select-input"
//         required
//       >
//         <option value="">Select Type</option>
//         <option value="Test">Test</option>
//         <option value="Practice">Practice</option>
//       </select>

//       <select
//         value={newQuiz.subjectId}
//         onChange={(e) => setNewQuiz({ ...newQuiz, subjectId: e.target.value })}
//         className="select-input"
//         required
//       >
//         <option value="">Select Subject</option>
//         {subjects.map((subject) => (
//           <option key={subject.id} value={subject.id}>
//             {subject.name}
//           </option>
//         ))}
//       </select>

//       <div className="modal-buttons">
//         <button onClick={handleAddOrEdit}>
//           {selectedQuiz ? "Save Changes" : "Add Quiz"}
//         </button>
//         <button className="close-btn" onClick={closeModal}>
//           Cancel
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// export default QuizManage;


import React, { useEffect, useState } from "react";
import "../../../assets/css/quiz-manage.css";
import { fetchQuizzesByExpert, addQuiz, editQuiz, deleteQuiz } from "../../../service/quiz";
import { fetchAllSubjects } from "../../../service/subject";

const QuizManage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    name: "",
    level: "",
    durationMinutes: 0,
    passRate: 0,
    type: "",
    subjectId: null
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadSubjects(); // Load danh sách subjects
    loadQuizzes(); // Load quizzes của expert
  }, []);

  const loadQuizzes = async () => {
    try {
      const expertId = localStorage.getItem("id"); // Lấy expertId từ localStorage
      if (expertId) {
        const data = await fetchQuizzesByExpert(expertId); // Fetch quizzes của expert
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Failed to load quizzes", error);
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await fetchAllSubjects(); // Fetch subjects từ API
      setSubjects(data);
    } catch (error) {
      console.error("Failed to load subjects", error);
    }
  };

  const openModal = (quiz = null) => {
    if (quiz) {
      setSelectedQuiz(quiz);
      setNewQuiz({
        name: quiz.name,
        level: quiz.level,
        durationMinutes: quiz.durationMinutes,
        passRate: quiz.passRate,
        type: quiz.type,
        subjectId: quiz.subjectId
      });
    } else {
      setNewQuiz({ name: "", level: "", durationMinutes: 0, passRate: 0, type: "", subjectId: null });
      setSelectedQuiz(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
    setNewQuiz({ name: "", level: "", durationMinutes: 0, passRate: 0, type: "", subjectId: null });
  };

  const handleAddOrEdit = async () => {
    if (newQuiz.name.trim() === "") return;

    try {
      if (selectedQuiz) {
        await editQuiz(selectedQuiz.id, newQuiz);
      } else {
        await addQuiz(newQuiz);
      }
      await loadQuizzes(); // Reload quizzes data
    } catch (error) {
      console.error("Failed to add or edit quiz", error);
    }

    closeModal();
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuiz(id);
      await loadQuizzes(); // Reload quizzes data after deletion
    } catch (error) {
      console.error("Failed to delete quiz", error.message);
    }
  };

  return (
    <div className="main-container">
      <div className="content">
        <h1>Quiz Management</h1>
        <button className="create-btn" onClick={() => openModal()}>
          + CREATE QUIZ
        </button>
        <table className="quiz-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Level</th>
              <th>Duration (minutes)</th>
              <th>Pass Rate (%)</th>
              <th>Type</th>
              <th>Subject</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((q) => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td>{q.name}</td>
                <td>{q.level}</td>
                <td>{q.durationMinutes}</td>
                <td>{q.passRate}</td>
                <td>{q.type}</td>
                <td>{q.subjectName}</td>
                <td>
                  <button className="edit-btn" onClick={() => openModal(q)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(q.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedQuiz ? "Edit Quiz" : "Create Quiz"}</h2>
            <input
              type="text"
              value={newQuiz.name}
              onChange={(e) => setNewQuiz({ ...newQuiz, name: e.target.value })}
              required
              placeholder="Enter Quiz Name"
            />
            <select
              value={newQuiz.level}
              onChange={(e) => setNewQuiz({ ...newQuiz, level: e.target.value })}
              className="select-input"
              required
            >
              <option value="">Select Level</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <input
              type="number"
              value={newQuiz.durationMinutes}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, durationMinutes: e.target.value })
              }
              required
              placeholder="Enter Duration (minutes)"
            />
            <input
              type="number"
              value={newQuiz.passRate}
              onChange={(e) => setNewQuiz({ ...newQuiz, passRate: e.target.value })}
              required
              placeholder="Enter Pass Rate (%)"
            />
            <select
              value={newQuiz.type}
              onChange={(e) => setNewQuiz({ ...newQuiz, type: e.target.value })}
              className="select-input"
              required
            >
              <option value="">Select Type</option>
              <option value="Test">Test</option>
              <option value="Practice">Practice</option>
            </select>
            <select
              value={newQuiz.subjectId}
              onChange={(e) => setNewQuiz({ ...newQuiz, subjectId: e.target.value })}
              className="select-input"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button onClick={handleAddOrEdit}>
                {selectedQuiz ? "Save Changes" : "Add Quiz"}
              </button>
              <button className="close-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManage;
