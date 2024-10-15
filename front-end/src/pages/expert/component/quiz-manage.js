import React, { useEffect, useState } from "react";
import "../../../assets/css/quiz-manage.css";
import { fetchQuizzesByExpert, addQuiz, editQuiz, deleteQuiz } from "../../../service/quiz";
import { fetchSubjectsByExpert } from "../../../service/quiz"; // Sử dụng hàm mới
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { red } from "@mui/material/colors";
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';

const QuizManage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    name: "",
    durationMinutes: "",
    passRate: "",
    type: "",
    subjectId: null,
    status: ""
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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
      const expertId = localStorage.getItem("id"); // Lấy expertId từ localStorage
      const data = await fetchSubjectsByExpert(expertId); // Fetch subjects từ API
      setSubjects(data); // Giả sử data là một mảng các subject
    } catch (error) {
      console.error("Failed to load subjects", error);
    }
  };

  const openModal = (quiz = null) => {
    if (quiz) {
      setSelectedQuiz(quiz);
      setNewQuiz({
        name: quiz.name,
        durationMinutes: quiz.durationMinutes,
        passRate: quiz.passRate,
        type: quiz.type,
        subjectId: quiz.subjectId,
        status: quiz.status
      });
    } else {
      setNewQuiz({ name: "", durationMinutes: 0, passRate: 0, type: "", subjectId: null });
      setSelectedQuiz(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
    setNewQuiz({ name: "", durationMinutes: 0, passRate: 0, type: "", subjectId: null });
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
              <th>Name</th>
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
                <td>{q.name}</td>
                <td>{q.durationMinutes}</td>
                <td>{q.passRate}</td>
                <td>{q.type}</td>
                <td>{q.subjectName}</td>

                <td>
                  <IconButton onClick={() => openModal(q)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton sx={{ color: red[500] }} onClick={() => handleDelete(q.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    title="Xem các câu hỏi"
                    onClick={() => navigate(`/Expert/Home/question/${q.id}`)} // Thay đổi đường dẫn đến trang Question
                  >
                    <InfoIcon />
                  </IconButton>
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
            <input
              type="text"
              value={newQuiz.status}
              onChange={(e) => setNewQuiz({ ...newQuiz, status: e.target.value })}
              required
              placeholder="Enter status"
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
