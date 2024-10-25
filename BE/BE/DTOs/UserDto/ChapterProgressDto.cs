namespace BE.DTOs.UserDto
{
    public class ChapterProgressDto
    {
        public int ChapterId { get; set; }
        public string ChapterTitle { get; set; }
        public decimal CompletionPercentage { get; set; }
        public bool IsCompleted { get; set; }
        public List<LessonProgressDto> LessonProgress { get; set; } = new();
        public List<QuizProgressDto> QuizProgress { get; set; } = new();
    }

    public class LessonProgressDto
    {
        public int LessonId { get; set; }
        public string LessonName { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class QuizProgressDto
    {
        public int QuizId { get; set; }
        public string QuizName { get; set; }
        public bool IsCompleted { get; set; }
    }
}
