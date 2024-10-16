namespace BE.DTOs.ExpertDto
{
    public class QuestionWithAnswersDto
    {
        public string Content { get; set; }
        public string? MediaUrl { get; set; }
        public string Status { get; set; }
        public List<AnswerOptionDto> Answers { get; set; }
    }

    public class AnswerOptionDto
    {
        public string Content { get; set; }
        public bool IsCorrect { get; set; }
    }
}
