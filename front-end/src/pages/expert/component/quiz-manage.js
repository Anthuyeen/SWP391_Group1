import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import {
  fetchQuizzesByExpert,
  addQuiz,
  editQuiz,
  deleteQuiz,
} from "../../../service/quiz";
import { fetchSubjectsByExpert } from "../../../service/quiz";
import { fetchChaptersBySubjectId } from "../../../service/chapter";

const QuizManage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    name: "",
    durationMinutes: "",
    passRate: "",
    type: "",
    subjectId: null,
    status: "",
    chapterId: null,
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    loadSubjects();
    loadQuizzes();
  }, []);

  useEffect(() => {
    if (newQuiz.subjectId) {
      loadChapters(newQuiz.subjectId);
    } else {
      setChapters([]); // Clear chapters if no subject is selected
    }
  }, [newQuiz.subjectId]);

  const loadChapters = async (subjectId) => {
    try {
      const data = await fetchChaptersBySubjectId(subjectId); // Gọi API lấy chapters theo subjectId
      setChapters(data);
    } catch (error) {
      console.error("Failed to load chapters", error);
    }
  };

  const loadQuizzes = async () => {
    try {
      const expertId = localStorage.getItem("id");
      if (expertId) {
        const data = await fetchQuizzesByExpert(expertId);
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Failed to load quizzes", error);
    }
  };

  const loadSubjects = async () => {
    try {
      const expertId = localStorage.getItem("id");
      const data = await fetchSubjectsByExpert(expertId);
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
        durationMinutes: quiz.durationMinutes,
        passRate: quiz.passRate,
        type: quiz.type,
        subjectId: quiz.subjectId,
        status: quiz.status,
        chapterId: quiz.chapterId || null,
      });
    } else {
      setNewQuiz({ name: "", durationMinutes: 0, passRate: 0, type: "", subjectId: null, chapterId: null });
      setSelectedQuiz(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
    setNewQuiz({ name: "", durationMinutes: 0, passRate: 0, type: "", subjectId: null, chapterId: null });
  };

  const handleAddOrEdit = async () => {
    if (newQuiz.name.trim() === "") return;

    try {
      if (selectedQuiz) {
        await editQuiz(selectedQuiz.id, newQuiz);
      } else {
        await addQuiz(newQuiz);
      }
      await loadQuizzes();
    } catch (error) {
      console.error("Failed to add or edit quiz", error);
    }

    closeModal();
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuiz(id);
      await loadQuizzes();
    } catch (error) {
      console.error("Failed to delete quiz", error.message);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <h1>Quiz Management</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => openModal()}
        sx={{ marginBottom: 2 }}
      >
        + CREATE QUIZ
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Duration (minutes)</TableCell>
              <TableCell>Pass Rate (%)</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Chapter title</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quizzes.map((q) => (
              <TableRow key={q.id}>
                <TableCell>{q.name}</TableCell>
                <TableCell>{q.durationMinutes}</TableCell>
                <TableCell>{q.passRate}</TableCell>
                <TableCell>{q.type}</TableCell>
                <TableCell>{q.subjectName}</TableCell>
                <TableCell>{q.status}</TableCell>
                <TableCell>{q.chapterTitle}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openModal(q)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton sx={{ color: red[500] }} onClick={() => handleDelete(q.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    title="Xem các câu hỏi"
                    onClick={() => navigate(`/Expert/Home/question/${q.id}`)}
                  >
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog fullScreen open={isModalOpen} onClose={closeModal}>
        <DialogTitle>{selectedQuiz ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Quiz Name"
            fullWidth
            margin="normal"
            value={newQuiz.name}
            onChange={(e) => setNewQuiz({ ...newQuiz, name: e.target.value })}
          />
          <TextField
            label="Duration (minutes)"
            fullWidth
            margin="normal"
            type="number"
            value={newQuiz.durationMinutes}
            onChange={(e) =>
              setNewQuiz({ ...newQuiz, durationMinutes: e.target.value })
            }
          />
          <TextField
            label="Pass Rate (%)"
            fullWidth
            margin="normal"
            type="number"
            value={newQuiz.passRate}
            onChange={(e) => setNewQuiz({ ...newQuiz, passRate: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={newQuiz.type}
              onChange={(e) => setNewQuiz({ ...newQuiz, type: e.target.value })}
            >
              <MenuItem value="Test">Test</MenuItem>
              <MenuItem value="Practice">Practice</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Subject</InputLabel>
            <Select
              value={newQuiz.subjectId}
              onChange={(e) => setNewQuiz({ ...newQuiz, subjectId: e.target.value })}
            >
              <MenuItem value="">
                <em>Select Subject</em>
              </MenuItem>
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={newQuiz.status}
              onChange={(e) => setNewQuiz({ ...newQuiz, status: e.target.value })}
            >
              <MenuItem value="Published">Published</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Chapter</InputLabel>
            <Select
              value={newQuiz.chapterId}
              onChange={(e) => setNewQuiz({ ...newQuiz, chapterId: e.target.value })}
              disabled={!newQuiz.subjectId} // Disable if no subject is selected
            >
              <MenuItem value="">
                <em>Select Chapter</em>
              </MenuItem>
              {chapters.map((chapter) => (
                <MenuItem key={chapter.id} value={chapter.id}>
                  {chapter.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button onClick={handleAddOrEdit} variant="contained" color="primary">
            {selectedQuiz ? "Save Changes" : "Add Quiz"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuizManage;