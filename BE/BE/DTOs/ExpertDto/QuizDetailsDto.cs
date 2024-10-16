namespace BE.DTOs.ExpertDto
{
    public class QuizDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int DurationMinutes { get; set; }
        public  decimal PassRate { get; set; }
        public string Type { get; set; }
        public List<QuestionDto> Questions { get; set; }
    }

    public class QuestionDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string? MediaUrl { get; set; }
        public string Status { get; set; }
        public List<AnswerDto> Answers { get; set; }
    }

    public class AnswerDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public bool IsCorrect { get; set; }

    }
}
