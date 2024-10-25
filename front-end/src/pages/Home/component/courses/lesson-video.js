import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Paper } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useParams } from 'react-router-dom';
import { fetchSubjectById } from '../../../../service/subject';
import { fetchLessonCompletion } from '../../../../service/lesson'; // Import hàm ghi nhận hoàn thành
import ReactPlayer from 'react-player';
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const LessonLearn = () => {
  const { courseId } = useParams();
  const [subject, setSubject] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  useEffect(() => {
    const getSubjectData = async () => {
      try {
        const data = await fetchSubjectById(courseId);
        setSubject(data);
        if (data.lessons.$values.length > 0) {
          setCurrentLesson(data.lessons.$values[0]);
          setSelectedLessonId(data.lessons.$values[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch subject data:", error);
      }
    };
    getSubjectData();
  }, [courseId]);

  if (!subject) {
    return <Typography>Loading...</Typography>;
  }

  const lessons = subject.lessons.$values;

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
    setSelectedLessonId(lesson.id);
  };

  const handlePrevLesson = () => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === currentLesson.id);
    if (currentIndex > 0) {
      const prevLesson = lessons[currentIndex - 1];
      setCurrentLesson(prevLesson);
      setSelectedLessonId(prevLesson.id);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === currentLesson.id);
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      setCurrentLesson(nextLesson);
      setSelectedLessonId(nextLesson.id);
    }
  };

  const handleVideoEnd = async () => {
    try {
      const userId = localStorage.getItem('id'); // Lấy userId từ localStorage
      await fetchLessonCompletion(userId, currentLesson.id);
      console.log("Lesson completed!");
    } catch (error) {
      console.error("Error recording lesson completion:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f0f0f0' }}>
        <Box sx={{ flex: 2, p: 2 }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom>{subject.name}</Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {currentLesson && currentLesson.url && ReactPlayer.canPlay(currentLesson.url) ? (
                <ReactPlayer
                  url={currentLesson.url}
                  width="100%"
                  height="500px"
                  controls
                  onEnded={handleVideoEnd} // Gọi hàm khi video kết thúc
                />
              ) : (
                <Typography>No video available</Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" startIcon={<PlayArrowIcon />} onClick={handlePrevLesson} disabled={currentLesson.id === lessons[0].id}>
                Bài trước
              </Button>
              <Button variant="contained" endIcon={<PlayArrowIcon />} onClick={handleNextLesson} disabled={currentLesson.id === lessons[lessons.length - 1].id}>
                Bài tiếp theo
              </Button>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ flex: 1, p: 2 }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom>Nội dung khóa học</Typography>
            <List>
              {lessons.map((lesson) => (
                <React.Fragment key={lesson.id}>
                 <ListItem
  button
  onClick={() => handleLessonClick(lesson)}
  sx={{
    bgcolor: selectedLessonId === lesson.id ? 'orange' : 'transparent',
    '&:hover': {
      bgcolor: '#ffd54f',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between' // Đẩy icon sang bên phải
  }}
>
  {/* Tên bài học */}
  <ListItemText
    primary={`${lesson.id}. ${lesson.name}`}
    secondary={lesson.status}
  />
  
  {/* Icon dấu tích xanh nếu lesson đã hoàn thành */}
  {lesson.status === "true" && (
    <CheckCircleIcon style={{ color: 'green' }} />
  )}
</ListItem>
                  {lesson.subLessons && (
                    <List component="div" disablePadding>
                      {lesson.subLessons.map((subLesson) => (
                        <ListItem key={subLesson.id} button sx={{ pl: 4 }}>
                          <ListItemText
                            primary={`${lesson.id}.${subLesson.id}. ${subLesson.title}`}
                            secondary={subLesson.duration}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default LessonLearn;


