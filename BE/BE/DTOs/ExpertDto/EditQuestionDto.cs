namespace BE.DTOs.ExpertDto
{
    public class EditQuestionDto
    {
        public string Content { get; set; }
        public string? MediaUrl { get; set; }
        public string Status { get; set; }
        public List<EditAnswerDto> Answers { get; set; }
    }

    public class EditAnswerDto
    {
        public int? Id { get; set; }
        public string Content { get; set; }
        public bool IsCorrect { get; set; }
        public bool Status { get; set; }
    }
}
