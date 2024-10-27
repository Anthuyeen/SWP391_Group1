namespace BE.DTOs.UserDto
{
    public class CompleteLessonDto
    {
        public int UserId { get; set; }

        public int LessonId { get; set; }

        public DateTime? CompletionDate { get; set; }

        public bool Status { get; set; } = true;
    }

    public class SimpleLessonCompletionDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsCompleted { get; set; }
    }
}
