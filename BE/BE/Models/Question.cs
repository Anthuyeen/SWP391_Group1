using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Question
{
    public int Id { get; set; }

    public string Content { get; set; } = null!;

    public string? MediaUrl { get; set; }

    public string? Level { get; set; }

    public string? Status { get; set; }

    public string? Explanation { get; set; }

    public virtual ICollection<AnswerOption> AnswerOptions { get; } = new List<AnswerOption>();

    public virtual ICollection<Quiz> Quizzes { get; } = new List<Quiz>();
}
