namespace BE.DTOs.ExpertDto
{
    public class LessonDto
    {
        public int Id { get; set; }
        public int? SubjectId { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        public string Status { get; set; }
        public string SubjectName { get; set; }
        public string? Url { get; set; }

    }

    public class EditLessonDto
    {
        public int? SubjectId { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        public string Status { get; set; }
        public string? Url { get; set; }

    }
}
