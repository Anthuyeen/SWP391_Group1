// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { fetchQuestionsByQuizId, editQuestion, addQuestionsToQuiz } from '../../../service/quiz';
// import {
//     Container,
//     Typography,
//     List,
//     ListItem,
//     ListItemText,
//     Box,
//     TextField,
//     Checkbox,
//     Button,
//     IconButton,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Divider,
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import CheckIcon from '@mui/icons-material/Check';
// import AddIcon from '@mui/icons-material/Add';

// const Question = () => {
//     const { quizId } = useParams();
//     const [quiz, setQuiz] = useState(null);
//     const [questions, setQuestions] = useState([]);
//     const [isEditing, setIsEditing] = useState(false);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [newQuestion, setNewQuestion] = useState({
//         content: '',
//         mediaUrl: '',
//         status: '',
//         answers: [{ content: '', isCorrect: false }],
//     });

//     useEffect(() => {
//         const loadQuestions = async () => {
//             try {
//                 const data = await fetchQuestionsByQuizId(quizId);
//                 setQuiz(data);
//                 setQuestions(data.questions);
//             } catch (error) {
//                 console.error('Failed to fetch questions', error);
//             }
//         };

//         loadQuestions();
//     }, [quizId]);

//     const handleEditToggle = async () => {
//         if (isEditing) {
//             try {
//                 for (let question of questions) {
//                     await editQuestion(question.id, question);
//                 }
//                 console.log('Questions updated successfully');
//             } catch (error) {
//                 console.error('Failed to update questions', error);
//             }
//         }
//         setIsEditing(!isEditing);
//     };

//     const handleAddQuestionOpen = () => {
//         setOpenDialog(true);
//     };

//     const handleAddQuestionClose = () => {
//         setOpenDialog(false);
//         setNewQuestion({
//             content: '',
//             mediaUrl: '',
//             status: '',
//             answers: [{ content: '', isCorrect: false }],
//         });
//     };

//     const handleAddAnswer = () => {
//         setNewQuestion((prev) => ({
//             ...prev,
//             answers: [...prev.answers, { content: '', isCorrect: false }],
//         }));
//     };

//     const handleAnswerChange = (index, value) => {
//         const updatedAnswers = newQuestion.answers.map((answer, i) =>
//             i === index ? { ...answer, content: value } : answer
//         );
//         setNewQuestion((prev) => ({ ...prev, answers: updatedAnswers }));
//     };

//     const handleCheckboxChange = (index) => {
//         const updatedAnswers = newQuestion.answers.map((answer, i) =>
//             i === index ? { ...answer, isCorrect: !answer.isCorrect } : answer
//         );
//         setNewQuestion((prev) => ({ ...prev, answers: updatedAnswers }));
//     };

//     const handleSubmit = async () => {
//         try {
//             await addQuestionsToQuiz(quizId, [newQuestion]); // Gửi câu hỏi mới đến API
//             handleAddQuestionClose();
//             // Tải lại danh sách câu hỏi sau khi thêm thành công
//             const data = await fetchQuestionsByQuizId(quizId);
//             setQuestions(data.questions);
//         } catch (error) {
//             console.error('Error adding question:', error);
//         }
//     };

//     if (!quiz) {
//         return <Typography variant="h6">Loading...</Typography>;
//     }
//     const handleQuizChange = (field, value) => {
//         setQuiz((prevQuiz) => ({
//             ...prevQuiz,
//             [field]: value,
//         }));
//     };

//     const handleQuestionChange = (questionIndex, value) => {
//         setQuestions((prevQuestions) => {
//             const updatedQuestions = prevQuestions.map((question, qIndex) =>
//                 qIndex === questionIndex ? { ...question, content: value } : question
//             );
//             return updatedQuestions;
//         });
//     };
//     return (
//         <Container sx={{ mt: 4 }}>
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                 <TextField
//                     variant="standard"
//                     value={quiz.name}
//                     onChange={(e) => handleQuizChange('name', e.target.value)}
//                     InputProps={{
//                         readOnly: !isEditing,
//                         disableUnderline: true,
//                         sx: { fontSize: '1.5rem' },
//                     }}
//                 />
//                 <Box>
//                     <IconButton color="primary" onClick={handleEditToggle}>
//                         {isEditing ? <CheckIcon /> : <EditIcon />}
//                     </IconButton>
//                     <IconButton onClick={handleAddQuestionOpen}>
//                         <AddIcon />
//                     </IconButton>
//                 </Box>
//             </Box>

//             <Typography variant="h6">Duration:</Typography>
//             <TextField
//                 variant="standard"
//                 value={quiz.durationMinutes}
//                 onChange={(e) => handleQuizChange('durationMinutes', e.target.value)}
//                 InputProps={{
//                     readOnly: !isEditing,
//                     disableUnderline: true,
//                 }}
//                 sx={{ mb: 2 }}
//             />

//             <Typography variant="h6">Pass Rate:</Typography>
//             <TextField
//                 variant="standard"
//                 value={quiz.passRate}
//                 onChange={(e) => handleQuizChange('passRate', e.target.value)}
//                 InputProps={{
//                     readOnly: !isEditing,
//                     disableUnderline: true,
//                 }}
//                 sx={{ mb: 2 }}
//             />

//             <Divider sx={{ my: 2, borderWidth: 1 }} />
//             <Typography variant="h5" gutterBottom>
//                 Questions
//             </Typography>
//             <List>
//                 {questions.map((question, questionIndex) => (
//                     <React.Fragment key={question.id}>
//                         <ListItem alignItems="flex-start">
//                             <TextField
//                                 variant="standard"
//                                 value={question.content}
//                                 onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
//                                 InputProps={{
//                                     readOnly: !isEditing,
//                                     disableUnderline: true,
//                                 }}
//                                 sx={{ flexGrow: 1 }}
//                             />
//                         </ListItem>
//                         <ListItemText
//                             secondary={
//                                 <Box>
//                                     {question.answers.map((answer, answerIndex) => (
//                                         <ListItem key={answer.id} sx={{ paddingLeft: 4 }} dense>
//                                             <Checkbox
//                                                 checked={answer.isCorrect}
//                                                 onChange={() => isEditing && handleCheckboxChange(questionIndex, answerIndex)}
//                                                 disabled={!isEditing}
//                                             />
//                                             <TextField
//                                                 variant="standard"
//                                                 value={answer.content}
//                                                 onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
//                                                 InputProps={{
//                                                     readOnly: !isEditing,
//                                                     disableUnderline: true,
//                                                 }}
//                                                 fullWidth
//                                             />
//                                         </ListItem>
//                                     ))}
//                                 </Box>
//                             }
//                         />
//                         {questionIndex < questions.length - 1 && <Divider sx={{ my: 2, borderWidth: 2 }} />}
//                     </React.Fragment>
//                 ))}
//             </List>

//             {/* Dialog để thêm câu hỏi */}
//             <Dialog open={openDialog} onClose={handleAddQuestionClose} fullScreen>
//                 <DialogTitle>Thêm Câu Hỏi</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         label="Nội dung câu hỏi"
//                         variant="outlined"
//                         fullWidth
//                         value={newQuestion.content}
//                         onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
//                         sx={{ mb: 2 }}
//                     />
//                     <TextField
//                         label="Media URL"
//                         variant="outlined"
//                         fullWidth
//                         value={newQuestion.mediaUrl}
//                         onChange={(e) => setNewQuestion({ ...newQuestion, mediaUrl: e.target.value })}
//                         sx={{ mb: 2 }}
//                     />
//                     <TextField
//                         label="Trạng thái"
//                         variant="outlined"
//                         fullWidth
//                         value={newQuestion.status}
//                         onChange={(e) => setNewQuestion({ ...newQuestion, status: e.target.value })}
//                         sx={{ mb: 2 }}
//                     />
//                     <Typography variant="h6">Đáp án</Typography>
//                     {newQuestion.answers.map((answer, index) => (
//                         <Box display="flex" alignItems="center" key={index}>
//                             <Checkbox
//                                 checked={answer.isCorrect}
//                                 onChange={() => handleCheckboxChange(index)}
//                             />
//                             <TextField
//                                 variant="outlined"
//                                 fullWidth
//                                 value={answer.content}
//                                 onChange={(e) => handleAnswerChange(index, e.target.value)}
//                                 sx={{ mb: 2 }}
//                             />
//                         </Box>
//                     ))}
//                     <Button variant="contained" onClick={handleAddAnswer}>
//                         Thêm Đáp Án
//                     </Button>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleAddQuestionClose}>Hủy</Button>
//                     <Button onClick={handleSubmit} color="primary">
//                         Lưu
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Container>
//     );
// };

// export default Question;

















import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchQuestionsByQuizId, editQuestion, addQuestionsToQuiz } from '../../../service/quiz';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    Box,
    TextField,
    Checkbox,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';

const Question = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        content: '',
        mediaUrl: '',
        status: '',
        answers: [{ content: '', isCorrect: false }],
    });

    const [editingQuestion, setEditingQuestion] = useState(null); // Thêm biến trạng thái cho câu hỏi đang chỉnh sửa

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const data = await fetchQuestionsByQuizId(quizId);
                setQuiz(data);
                setQuestions(data.questions);
            } catch (error) {
                console.error('Failed to fetch questions', error);
            }
        };

        loadQuestions();
    }, [quizId]);

    const handleEditToggle = async () => {
        if (isEditing) {
            try {
                for (let question of questions) {
                    await editQuestion(question.id, question);
                }
                console.log('Questions updated successfully');
            } catch (error) {
                console.error('Failed to update questions', error);
            }
        }
        setIsEditing(!isEditing);
    };

    const handleAddQuestionOpen = () => {
        setOpenDialog(true);
    };

    const handleAddQuestionClose = () => {
        setOpenDialog(false);
        setNewQuestion({
            content: '',
            mediaUrl: '',
            status: '',
            answers: [{ content: '', isCorrect: false }],
        });
    };

    const handleEditQuestionOpen = (question) => {
        setEditingQuestion(question);
        setNewQuestion({
            content: question.content,
            mediaUrl: question.mediaUrl,
            status: question.status,
            answers: question.answers.map(answer => ({
                content: answer.content,
                isCorrect: answer.isCorrect,
            })),
        });
        setOpenDialog(true);
    };

    const handleAddAnswer = () => {
        setNewQuestion((prev) => ({
            ...prev,
            answers: [...prev.answers, { content: '', isCorrect: false }],
        }));
    };

    const handleAnswerChange = (index, value) => {
        const updatedAnswers = newQuestion.answers.map((answer, i) =>
            i === index ? { ...answer, content: value } : answer
        );
        setNewQuestion((prev) => ({ ...prev, answers: updatedAnswers }));
    };

    const handleCheckboxChange = (index) => {
        const updatedAnswers = newQuestion.answers.map((answer, i) =>
            i === index ? { ...answer, isCorrect: !answer.isCorrect } : answer
        );
        setNewQuestion((prev) => ({ ...prev, answers: updatedAnswers }));
    };

    const handleSubmit = async () => {
        try {
            let response;
            if (editingQuestion) {
                // Nếu đang chỉnh sửa câu hỏi
                const updatedQuestion = {
                    ...editingQuestion,
                    content: newQuestion.content,
                    mediaUrl: newQuestion.mediaUrl,
                    status: newQuestion.status,
                    answers: newQuestion.answers,
                };
                response = await editQuestion(editingQuestion.id, updatedQuestion); // Gửi câu hỏi đã chỉnh sửa đến API
            } else {
                response = await addQuestionsToQuiz(quizId, [newQuestion]); // Gửi câu hỏi mới đến API
            }
    
            // Kiểm tra mã trạng thái phản hồi
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error adding/updating question:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const message = await response.text(); // Lấy nội dung trả về như là chuỗi
            console.log(message); // In ra thông báo
    
            handleAddQuestionClose();
            // Tải lại danh sách câu hỏi sau khi thêm hoặc cập nhật thành công
            const data = await fetchQuestionsByQuizId(quizId);
            setQuestions(data.questions);
        } catch (error) {
            console.error('Error adding/updating question:', error);
        }
    };
    

    if (!quiz) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    const handleQuizChange = (field, value) => {
        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            [field]: value,
        }));
    };

    const handleQuestionChange = (questionIndex, value) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = prevQuestions.map((question, qIndex) =>
                qIndex === questionIndex ? { ...question, content: value } : question
            );
            return updatedQuestions;
        });
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <TextField
                    variant="standard"
                    value={quiz.name}
                    onChange={(e) => handleQuizChange('name', e.target.value)}
                    InputProps={{
                        readOnly: !isEditing,
                        disableUnderline: true,
                        sx: { fontSize: '1.5rem' },
                    }}
                />
                <Box>
                    <IconButton color="primary" onClick={handleEditToggle}>
                        {isEditing ? <CheckIcon /> : <EditIcon />}
                    </IconButton>
                    <IconButton onClick={handleAddQuestionOpen}>
                        <AddIcon />
                    </IconButton>
                </Box>
            </Box>

            <Typography variant="h6">Duration:</Typography>
            <TextField
                variant="standard"
                value={quiz.durationMinutes}
                onChange={(e) => handleQuizChange('durationMinutes', e.target.value)}
                InputProps={{
                    readOnly: !isEditing,
                    disableUnderline: true,
                }}
                sx={{ mb: 2 }}
            />

            <Typography variant="h6">Pass Rate:</Typography>
            <TextField
                variant="standard"
                value={quiz.passRate}
                onChange={(e) => handleQuizChange('passRate', e.target.value)}
                InputProps={{
                    readOnly: !isEditing,
                    disableUnderline: true,
                }}
                sx={{ mb: 2 }}
            />

            <Divider sx={{ my: 2, borderWidth: 1 }} />
            <Typography variant="h5" gutterBottom>
                Questions
            </Typography>
            <List>
                {questions.map((question, questionIndex) => (
                    <React.Fragment key={question.id}>
                        <ListItem alignItems="flex-start">
                            <TextField
                                variant="standard"
                                value={question.content}
                                onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                                InputProps={{
                                    readOnly: !isEditing,
                                    disableUnderline: true,
                                }}
                                sx={{ flexGrow: 1 }}
                            />
                            {isEditing && (
                                <IconButton onClick={() => handleEditQuestionOpen(question)}>
                                    <EditIcon />
                                </IconButton>
                            )}
                        </ListItem>
                        <ListItemText
                            secondary={
                                <Box>
                                    {question.answers.map((answer, answerIndex) => (
                                        <ListItem key={answer.id} sx={{ paddingLeft: 4 }} dense>
                                            <Checkbox
                                                checked={answer.isCorrect}
                                                onChange={() => isEditing && handleCheckboxChange(questionIndex, answerIndex)}
                                                disabled={!isEditing}
                                            />
                                            <TextField
                                                variant="standard"
                                                value={answer.content}
                                                onChange={(e) => handleAnswerChange(answerIndex, e.target.value)}
                                                InputProps={{
                                                    readOnly: !isEditing,
                                                    disableUnderline: true,
                                                }}
                                                fullWidth
                                            />
                                        </ListItem>
                                    ))}
                                </Box>
                            }
                        />
                        {questionIndex < questions.length - 1 && <Divider sx={{ my: 2, borderWidth: 2 }} />}
                    </React.Fragment>
                ))}
            </List>

            {/* Dialog để thêm hoặc chỉnh sửa câu hỏi */}
            <Dialog open={openDialog} onClose={handleAddQuestionClose} fullScreen>
                <DialogTitle>{editingQuestion ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nội dung câu hỏi"
                        variant="outlined"
                        fullWidth
                        value={newQuestion.content}
                        onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Media URL"
                        variant="outlined"
                        fullWidth
                        value={newQuestion.mediaUrl}
                        onChange={(e) => setNewQuestion({ ...newQuestion, mediaUrl: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Trạng thái"
                        variant="outlined"
                        fullWidth
                        value={newQuestion.status}
                        onChange={(e) => setNewQuestion({ ...newQuestion, status: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="h6">Đáp án</Typography>
                    {newQuestion.answers.map((answer, index) => (
                        <Box display="flex" alignItems="center" key={index}>
                            <Checkbox
                                checked={answer.isCorrect}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={answer.content}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                sx={{ mb: 2 }}
                            />
                        </Box>
                    ))}
                    <Button variant="contained" onClick={handleAddAnswer}>
                        Thêm Đáp Án
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddQuestionClose}>Hủy</Button>
                    <Button onClick={handleSubmit} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Question;
