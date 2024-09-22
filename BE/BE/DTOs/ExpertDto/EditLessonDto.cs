namespace BE.DTOs.ExpertDto
{
    public class EditLessonDto
    {
        public int? SubjectId { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        public string Status { get; set; }
    }
}
