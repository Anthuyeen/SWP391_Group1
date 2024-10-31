// import { useState, useEffect, useCallback, useRef } from 'react';
// import { fetchSubjectById, fetchSubjectProgress } from '../../../../../service/subject';
// import { fetchChapterProgress, fetchCompletedLessons } from '../../../../../service/chapter';
// import { fetchRegistrationStatus, fetchRegisterSubject } from '../../../../../service/enroll';

// export const useCourseData = (courseId, isLoggedIn) => {
//     const [course, setCourse] = useState(null);
//     const [error, setError] = useState(null);
//     const [registrationInfo, setRegistrationInfo] = useState(null);
//     const [isRegistered, setIsRegistered] = useState(false);
//     const [progress, setProgress] = useState(null);
//     const [chapterProgress, setChapterProgress] = useState({});
//     const [completedLessons, setCompletedLessons] = useState({});
//     const hasFetchedData = useRef(false);

//     const loadData = useCallback(async () => {
//         if (!hasFetchedData.current) {
//             try {
//                 const data = await fetchSubjectById(courseId);
//                 setCourse(data);

//                 if (isLoggedIn) {
//                     const userId = localStorage.getItem('id');
//                     const [progressData, registrationStatus] = await Promise.all([
//                         fetchSubjectProgress(userId, courseId),
//                         fetchRegistrationStatus(userId, courseId)
//                     ]);

//                     setProgress(progressData.isCompleted);
//                     setIsRegistered(registrationStatus === "Bạn đã đăng ký môn học này");
//                     setRegistrationInfo(registrationStatus);

//                     // Load chapter and lesson progress
//                     if (data.chapters?.$values) {
//                         const chapterProgressData = await Promise.all(
//                             data.chapters.$values.map(chapter =>
//                                 fetchChapterProgress(userId, chapter.id)
//                             )
//                         );

//                         setChapterProgress(
//                             chapterProgressData.reduce((acc, progress) => {
//                                 acc[progress.chapterId] = progress.isCompleted;
//                                 return acc;
//                             }, {})
//                         );

//                         const lessonsData = await Promise.all(
//                             data.chapters.$values.map(chapter =>
//                                 fetchCompletedLessons(chapter.id, userId)
//                             )
//                         );

//                         // Chuyển đổi dữ liệu để lưu trữ theo cấu trúc mới
//                         const completedLessonsMap = lessonsData.reduce((acc, lessonData, index) => {
//                             acc[data.chapters.$values[index].id] = lessonData.$values || []; // Đảm bảo luôn có một mảng
//                             return acc;
//                         }, {});
//                         setCompletedLessons(completedLessonsMap);
//                     }
//                 }
//                 hasFetchedData.current = true;
//             } catch (err) {
//                 setError('Error loading course data');
//             }
//         }
//     }, [courseId, isLoggedIn]);

//     useEffect(() => {
//         loadData(); // Gọi loadData khi courseId hoặc isLoggedIn thay đổi
//     }, [loadData]);

//     const loadLessonProgress = async (userId, chapters) => {
//         const lessonsData = await Promise.all(
//             chapters.map(async (chapter) => {
//                 const response = await fetchCompletedLessons(chapter.id, userId);
//                 return {

//                     chapterId: chapter.id,
//                     lessons: response.$values || [] // Đảm bảo luôn có một mảng
//                 };
//             })
//         );

//         // Chuyển đổi dữ liệu để lưu trữ theo cấu trúc mới
//         const completedLessonsMap = lessonsData.reduce((acc, { chapterId, lessons }) => {
//             acc[chapterId] = lessons; // Lưu trữ toàn bộ mảng lessons cho mỗi chapter
//             return acc;
//         }, {});

//         setCompletedLessons(completedLessonsMap);
//     };

//     useEffect(() => {
//         if (isLoggedIn && course?.chapters?.$values) {
//             const userId = localStorage.getItem('id');
//             loadLessonProgress(userId, course.chapters.$values);
//         }
//     }, [isLoggedIn, course]);

//     const handleRegisterClick = async () => {
//         if (isLoggedIn) {
//             try {
//                 const accId = localStorage.getItem('id');
//                 const response = await fetchRegisterSubject(accId, courseId);
//                 setRegistrationInfo(response);
//                 setIsRegistered(true);
//             } catch (error) {
//                 console.error('Đăng ký thất bại:', error);
//             }
//         }
//     };

//     const groupedLessons = course?.lessons?.$values.reduce((acc, lesson) => {
//         if (!acc[lesson.chapterId]) acc[lesson.chapterId] = [];
//         acc[lesson.chapterId].push(lesson);
//         return acc;
//     }, {});

//     return {
//         course,
//         error,
//         isRegistered,
//         registrationInfo,
//         progress,
//         chapterProgress,
//         completedLessons,
//         handleRegisterClick,
//         groupedLessons
//     };

    
// };

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSubjectById, fetchSubjectProgress } from '../../../../../service/subject';
import { fetchChapterProgress, fetchCompletedLessons } from '../../../../../service/chapter';
import { fetchRegistrationStatus, fetchRegisterSubject } from '../../../../../service/enroll';
import { fetchSubjectCompletion } from '../../../../../service/subject'; // Import hàm fetchSubjectCompletion

export const useCourseData = (courseId, isLoggedIn) => {
    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);
    const [registrationInfo, setRegistrationInfo] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [progress, setProgress] = useState(null);
    const [chapterProgress, setChapterProgress] = useState({});
    const [completedLessons, setCompletedLessons] = useState({});
    const hasFetchedData = useRef(false);

    const loadData = useCallback(async () => {
        if (!hasFetchedData.current) {
            try {
                const data = await fetchSubjectById(courseId);
                setCourse(data);

                if (isLoggedIn) {
                    const userId = localStorage.getItem('id');
                    const [progressData, registrationStatus] = await Promise.all([
                        fetchSubjectProgress(userId, courseId),
                        fetchRegistrationStatus(userId, courseId)
                    ]);

                    setProgress(progressData.isCompleted);
                    setIsRegistered(registrationStatus === "Bạn đã đăng ký môn học này");
                    setRegistrationInfo(registrationStatus);

                    // Load chapter and lesson progress
                    if (data.chapters?.$values) {
                        const chapterProgressData = await Promise.all(
                            data.chapters.$values.map(chapter =>
                                fetchChapterProgress(userId, chapter.id)
                            )
                        );

                        setChapterProgress(
                            chapterProgressData.reduce((acc, progress) => {
                                acc[progress.chapterId] = progress.isCompleted;
                                return acc;
                            }, {})
                        );

                        const lessonsData = await Promise.all(
                            data.chapters.$values.map(chapter =>
                                fetchCompletedLessons(chapter.id, userId)
                            )
                        );

                        const completedLessonsMap = lessonsData.reduce((acc, lessonData, index) => {
                            acc[data.chapters.$values[index].id] = lessonData.$values || [];
                            return acc;
                        }, {});
                        setCompletedLessons(completedLessonsMap);
                    }
                }
                hasFetchedData.current = true;
            } catch (err) {
                setError('Error loading course data');
            }
        }
    }, [courseId, isLoggedIn]);

    // Hàm kiểm tra xem tất cả các chương đã hoàn thành chưa
    const allChaptersCompleted = () => {
        return course.chapters?.$values.every(chapter => chapterProgress[chapter.id]);
    };

    // useEffect kiểm tra hoàn thành môn học
    useEffect(() => {
        const completeSubject = async () => {
            const userId = localStorage.getItem('id');
            const subjectId = courseId; // Giả định courseId là subjectId

            if (allChaptersCompleted()) {
                const { status, certificate } = await fetchSubjectCompletion(userId, subjectId);
                if (status) {
                    console.log("Subject completed successfully:", certificate);
                    // Có thể thêm logic để cập nhật trạng thái hoàn thành ở đây nếu cần
                } else {
                    console.error("Failed to complete subject");
                }
            }
        };

        if (isLoggedIn && course) {
            completeSubject();
        }
    }, [isLoggedIn, course, chapterProgress]);

    useEffect(() => {
        loadData(); // Gọi loadData khi courseId hoặc isLoggedIn thay đổi
    }, [loadData]);

    const loadLessonProgress = async (userId, chapters) => {
        const lessonsData = await Promise.all(
            chapters.map(async (chapter) => {
                const response = await fetchCompletedLessons(chapter.id, userId);
                return {
                    chapterId: chapter.id,
                    lessons: response.$values || []
                };
            })
        );

        const completedLessonsMap = lessonsData.reduce((acc, { chapterId, lessons }) => {
            acc[chapterId] = lessons;
            return acc;
        }, {});

        setCompletedLessons(completedLessonsMap);
    };

    useEffect(() => {
        if (isLoggedIn && course?.chapters?.$values) {
            const userId = localStorage.getItem('id');
            loadLessonProgress(userId, course.chapters.$values);
        }
    }, [isLoggedIn, course]);

    const handleRegisterClick = async () => {
        if (isLoggedIn) {
            try {
                const accId = localStorage.getItem('id');
                const response = await fetchRegisterSubject(accId, courseId);
                setRegistrationInfo(response);
                setIsRegistered(true);
            } catch (error) {
                console.error('Đăng ký thất bại:', error);
            }
        }
    };

    const groupedLessons = course?.lessons?.$values.reduce((acc, lesson) => {
        if (!acc[lesson.chapterId]) acc[lesson.chapterId] = [];
        acc[lesson.chapterId].push(lesson);
        return acc;
    }, {});

    return {
        course,
        error,
        isRegistered,
        registrationInfo,
        progress,
        chapterProgress,
        completedLessons,
        handleRegisterClick,
        groupedLessons
    };
};



