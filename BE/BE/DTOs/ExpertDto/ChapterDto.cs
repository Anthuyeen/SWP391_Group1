namespace BE.DTOs.ExpertDto
{
    public class ChapterDto
    {
        public int Id { get; set; }

        public int SubjectId { get; set; }

        public string Title { get; set; } = null!;

        public string? Status { get; set; }
    }

    public class ChapterDetailsDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Status { get; set; }
        public int SubjectId { get; set; }
        public string SubjectName { get; set; } = null!;
        public List<LessonDto> Lessons { get; set; } = new();
        public List<QuizDto> Quizzes { get; set; } = new();
    }

    public class EditChapterDto
    {
        public string Title { get; set; } = null!;
        public string Status { get; set; } = null!;
        public int SubjectId { get; set; }
    }
}
