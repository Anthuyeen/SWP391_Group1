using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class UserAnswer
{
    public int Id { get; set; }

    public int QuizAttemptId { get; set; }

    public int QuestionId { get; set; }

    public int AnswerOptionId { get; set; }

    public bool IsCorrect { get; set; }

    public virtual AnswerOption AnswerOption { get; set; } = null!;

    public virtual Question Question { get; set; } = null!;

    public virtual QuizAttempt QuizAttempt { get; set; } = null!;
}
