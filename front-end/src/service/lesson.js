// get lesson by subject id
export const fetchLessonsBySubjectId = async (subjectId) => {
    const url = `https://localhost:7043/api/Subject/GetLessonsBySubjectId/GetLessonsBySubjectId/${subjectId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch lessons:', error);
        throw error;
    }
};
//delete lesson
export const deleteLesson = async (lessonId) => {
    const response = await fetch(`https://localhost:7043/api/Lesson/DeleteLesson/DeleteLesson/${lessonId}`, {
        method: 'DELETE',
    });

    // Nếu mã trạng thái không phải là 2xx, ném lỗi
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    // Không phân tích cú pháp JSON nếu không có nội dung
    return response.status === 204 ? null : await response.json();
};
