using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class AnswerOption
{
    public int Id { get; set; }

    public int? QuestionId { get; set; }

    public string Content { get; set; } = null!;

    public bool IsCorrect { get; set; }

    public bool Status { get; set; }

    public virtual Question? Question { get; set; }

    public virtual ICollection<UserAnswer> UserAnswers { get; } = new List<UserAnswer>();
}
