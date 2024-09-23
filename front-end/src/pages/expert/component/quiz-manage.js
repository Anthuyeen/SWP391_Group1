import React, { useState } from "react";
import "../../../assets/css/quiz-manage.css";

const quizManage = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      name: "Introduction to Python",
      description: "Learn the basics of Python programming",
    },
    {
      id: 2,
      name: "Digital Marketing Fundamentals",
      description: "Understand core concepts of digital marketing",
    },
    {
      id: 3,
      name: "Advanced Java Programming",
      description: "Deep dive into advanced Java concepts",
    },
  ]);

  const [newQuestion, setNewQuestion] = useState({
    name: "",
    description: "",
  });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (question = null) => {
    if (question) {
      setSelectedQuestion(question);
      setNewQuestion({ name: question.name, description: question.description });
    } else {
      setNewQuestion({ name: "", description: "" });
      setSelectedQuestion(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
    setNewQuestion({ name: "", description: "" });
  };

  const handleAddOrEdit = () => {
    if (newQuestion.name.trim() === "") return;

    if (selectedQuestion) {
      // Edit 
      setQuestions(
        questions.map((q) =>
          q.id === selectedQuestion.id ? { ...q, ...newQuestion } : q
        )
      );
    } else {
      // Add 
      setQuestions([
        ...questions,
        { ...newQuestion, id: questions.length + 1 },
      ]);
    }

    closeModal();
  };

  const handleDelete = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="main-container">
      <div className="content">
        <h1>Quiz Management</h1>
        <button className="create-btn" onClick={() => openModal()}>
          + CREATE QUIZ
        </button>
        <table className="question-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td>{q.name}</td>
                <td>{q.description}</td>
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
            <h2>{selectedQuestion ? "Edit Quiz" : "Create Quiz"}</h2>
            <label>Name:</label>
            <input
              type="text"
              value={newQuestion.name}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, name: e.target.value })
              }
            />
            <label>Description:</label>
            <textarea
              value={newQuestion.description}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, description: e.target.value })
              }
            ></textarea>
            <div className="modal-buttons">
              <button onClick={handleAddOrEdit}>
                {selectedQuestion ? "Save Changes" : "Add Quiz"}
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

export default quizManage;
