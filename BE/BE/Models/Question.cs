using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Question
{
    public int Id { get; set; }

    public int? QuizId { get; set; }

    public string Content { get; set; } = null!;

    public string? MediaUrl { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<AnswerOption> AnswerOptions { get; } = new List<AnswerOption>();

    public virtual Quiz? Quiz { get; set; }

    public virtual ICollection<UserAnswer> UserAnswers { get; } = new List<UserAnswer>();


    public void AddAnswerOption(AnswerOption option)
    {
        AnswerOptions.Add(option); 
    }
}
