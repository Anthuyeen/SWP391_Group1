import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, Paper } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useParams } from 'react-router-dom';
import { fetchSubjectById } from '../../../../service/subject';
import { fetchLessonCompletion } from '../../../../service/lesson';
import { fetchCompletedLessons } from '../../../../service/chapter';

import ReactPlayer from 'react-player';
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const LessonLearn = () => {
  const { courseId } = useParams();
  const [subject, setSubject] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const getSubjectData = async () => {
      try {
        const data = await fetchSubjectById(courseId);
        setSubject(data);
        if (data.lessons.$values.length > 0) {
          setCurrentLesson(data.lessons.$values[0]);
          setSelectedLessonId(data.lessons.$values[0].id);
        }
        // loadCompletedLessons();

      } catch (error) {
        console.error("Failed to fetch subject data:", error);
      }
    };
    getSubjectData();
  }, [courseId]);

  // const loadCompletedLessons = async () => {
  //   try {
  //     const userId = localStorage.getItem('id');
  //     const chapters = subject.chapters.$values; // Giả sử subject đã được load
  //     const completedLessonsPromises = chapters.map(async (chapter) => {
  //       const data = await fetchCompletedLessons(chapter.id, userId);
  //       return data.$values.filter(item => item.isCompleted).map(item => item.id); // Chỉ lấy id của các bài học đã hoàn thành
  //     });

  //     const completedResults = await Promise.all(completedLessonsPromises);
  //     const allCompletedLessons = completedResults.flat(); // Gộp tất cả các ID lại thành một mảng duy nhất
  //     setCompletedLessons(allCompletedLessons);
  //     console.log("All completed lessons:", allCompletedLessons); // Kiểm tra danh sách hoàn thành
  //   } catch (error) {
  //     console.error("Failed to fetch completed lessons:", error);
  //   }
  // };

  useEffect(() => {
    const loadCompletedLessons = async () => {
        if (!subject) return; // Kiểm tra xem subject đã được load hay chưa
        try {
            const userId = localStorage.getItem('id');
            const chapters = subject.chapters.$values;
            const completedLessonsPromises = chapters.map(async (chapter) => {
                const data = await fetchCompletedLessons(chapter.id, userId);
                return data.$values.filter(item => item.isCompleted).map(item => item.id);
            });

            const completedResults = await Promise.all(completedLessonsPromises);
            const allCompletedLessons = completedResults.flat();
            setCompletedLessons(allCompletedLessons);
            console.log("All completed lessons:", allCompletedLessons);
        } catch (error) {
            console.error("Failed to fetch completed lessons:", error);
        }
    };

    loadCompletedLessons();
}, [subject]); // Gọi khi subject thay đổi

  if (!subject) {
    return <Typography>Loading...</Typography>;
  }

  const chapters = subject.chapters.$values.map((chapter) => ({
    ...chapter,
    lessons: subject.lessons.$values.filter((lesson) => lesson.chapterId === chapter.id),
  }));

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
    setSelectedLessonId(lesson.id);
  };

  const handlePrevLesson = () => {
    const currentIndex = chapters.flatMap(c => c.lessons).findIndex(lesson => lesson.id === currentLesson.id);
    if (currentIndex > 0) {
      const prevLesson = chapters.flatMap(c => c.lessons)[currentIndex - 1];
      setCurrentLesson(prevLesson);
      setSelectedLessonId(prevLesson.id);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = chapters.flatMap(c => c.lessons).findIndex(lesson => lesson.id === currentLesson.id);
    if (currentIndex < chapters.flatMap(c => c.lessons).length - 1) {
      const nextLesson = chapters.flatMap(c => c.lessons)[currentIndex + 1];
      setCurrentLesson(nextLesson);
      setSelectedLessonId(nextLesson.id);
    }
  };

  const handleVideoEnd = async () => {
    try {
      const userId = localStorage.getItem('id');
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
                  onEnded={handleVideoEnd}
                />
              ) : (
                <Typography>No video available</Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" startIcon={<PlayArrowIcon />} onClick={handlePrevLesson} disabled={currentLesson.id === chapters.flatMap(c => c.lessons)[0].id}>
                Bài trước
              </Button>
              <Button variant="contained" endIcon={<PlayArrowIcon />} onClick={handleNextLesson} disabled={currentLesson.id === chapters.flatMap(c => c.lessons).slice(-1)[0].id}>
                Bài tiếp theo
              </Button>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ flex: 1, p: 2 }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom>Nội dung khóa học</Typography>
            <List>
              {chapters.map((chapter) => (
                <React.Fragment key={chapter.id}>
                  <Typography variant="h6" gutterBottom>{chapter.title}</Typography>
                  {chapter.lessons.map((lesson) => (
                    <ListItem
                      button
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson)}
                      sx={{
                        bgcolor: selectedLessonId === lesson.id ? 'orange' : 'transparent',
                        '&:hover': { bgcolor: '#ffd54f' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <ListItemText
                        primary={`${lesson.id}. ${lesson.name}`}
                      />
                      {completedLessons.includes(lesson.id) ? (
                        <CheckCircleIcon style={{ color: 'green' }} /> // Dấu tích xanh nếu bài học đã hoàn thành
                      ) : (
                        <CheckCircleIcon style={{ color: 'gray' }} /> // Dấu tích xám nếu chưa hoàn thành
                      )}
                    </ListItem>


                  ))}
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
