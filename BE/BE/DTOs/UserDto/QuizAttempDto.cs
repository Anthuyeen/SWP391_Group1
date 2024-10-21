using BE.DTOs.ExpertDto;

namespace BE.DTOs.UserDto
{
    public class QuizAttemptDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int QuizId { get; set; }
        public decimal Score { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int AttemptNumber { get; set; }
        public bool IsPassed { get; set; }
        public List<UserAnswerAttempDto> UserAnswers { get; set; } = new List<UserAnswerAttempDto>();

    }

    public class UserAnswerAttempDto
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public int AnswerOptionId { get; set; }
        public bool IsCorrect { get; set; }
        public string QuestionContent { get; set; } = null!;
        public string SelectedAnswerContent { get; set; } = null!;
        public string CorrectAnswerContent { get; set; } = null!;
        public List<AnswerOptionAttempDto> AnswerOptions { get; set; } = new List<AnswerOptionAttempDto>();

    }
    public class AnswerOptionAttempDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = null!;
        public bool IsCorrect { get; set; }
    }
}
