import React, { useEffect, useState } from "react";
import "../../../assets/css/quiz-manage.css";
import { fetchQuizzes, addQuiz, editQuiz, deleteQuiz } from "../../../service/quiz";

const QuizManage = () => {
  const [quizzes, setQuizzes] = useState([]);
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
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await fetchQuizzes(); // Fetch quizzes from the API
      setQuizzes(data);
    } catch (error) {
      console.error("Failed to load quizzes", error);
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
        // Edit quiz
        await editQuiz(selectedQuiz.id, newQuiz); // Call editQuiz API
      } else {
        // Add new quiz using API
        await addQuiz(newQuiz);
      }
      // Reload quizzes data
      await loadQuizzes();
    } catch (error) {
      console.error("Failed to add or edit quiz", error);
    }

    closeModal();
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuiz(id); // Call deleteQuiz API
      // Reload quizzes data after deletion
      await loadQuizzes();
    } catch (error) {
      console.error("Failed to delete quiz", error.message); // In ra thông báo lỗi
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
            <label>Name:</label>
            <input
              type="text"
              value={newQuiz.name}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, name: e.target.value })
              }
            />
            <label>Level:</label>
            <select
              value={newQuiz.level}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, level: e.target.value })
              }
              className="select-input"
            >
              <option value="">Select Level</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <label>Duration (minutes):</label>
            <input
              type="number"
              value={newQuiz.durationMinutes}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, durationMinutes: e.target.value })
              }
            />
            <label>Pass Rate (%):</label>
            <input
              type="number"
              value={newQuiz.passRate}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, passRate: e.target.value })
              }
            />
            <label>Type:</label>
            <select
              value={newQuiz.type}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, type: e.target.value })
              }
              className="select-input"
            >
              <option value="">Select Type</option>
              <option value="Test">Test</option>
              <option value="Practice">Practice</option>
            </select>
            <label>Subject ID:</label>
            <input
              type="number"
              value={newQuiz.subjectId}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, subjectId: e.target.value })
              }
            />
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

