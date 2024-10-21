namespace BE.DTOs.UserDto
{
    public class CompleteLessonDto
    {
        public int UserId { get; set; }

        public int LessonId { get; set; }

        public DateTime? CompletionDate { get; set; }

        public bool Status { get; set; } = true;
    }
}
