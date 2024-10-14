namespace BE.DTOs.UserDto
{
    public class QuizSubmissionDto
    {
        public int QuizId { get; set; }
        public int UserId { get; set; }
        public DateTime StartTime { get; set; }
        public List<UserAnswerDto> Answers { get; set; }
    }

    public class UserAnswerDto
    {
        public int QuestionId { get; set; }
        public int SelectedAnswerId { get; set; }
    }

    public class QuizSubmissionResultDto
    {
        public decimal Score { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public int AttemptId { get; set; }
        public bool IsPassed { get; set; }
    }
}
