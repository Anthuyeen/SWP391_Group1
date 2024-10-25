namespace BE.DTOs.ExpertDto
{
    public class QuizDto
    {
        public int Id { get; set; }
        public int? SubjectId { get; set; }
        public string Name { get; set; } = null!;
        public int DurationMinutes { get; set; }
        public decimal PassRate { get; set; }
        public string? Type { get; set; }
        public string? SubjectName { get; set; }
        public string Status { get; set; } = null!;
        public int? ChapterId { get; set; }
        public string ChapterTitle { get; set; } = null!;

    }

    public class EditQuizDto
    {
        public int? SubjectId { get; set; }
        public string Name { get; set; } = null!;
        public string? Level { get; set; }
        public int DurationMinutes { get; set; }
        public decimal PassRate { get; set; }
        public string? Type { get; set; }
        public string Status { get; set; } = null!;
        public int? ChapterId { get; set; }
    }
}