using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class QuizAttempt
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int QuizId { get; set; }

    public decimal Score { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public int AttemptNumber { get; set; }

    public bool IsPassed { get; set; }

    public virtual Quiz Quiz { get; set; } = null!;

    public virtual User User { get; set; } = null!;

    public virtual ICollection<UserAnswer> UserAnswers { get; } = new List<UserAnswer>();
}
