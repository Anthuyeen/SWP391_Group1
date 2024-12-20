﻿using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Quiz
{
    public int Id { get; set; }

    public int? SubjectId { get; set; }

    public string Name { get; set; } = null!;

    public int DurationMinutes { get; set; }

    public decimal PassRate { get; set; }

    public string? Type { get; set; }

    public string Status { get; set; } = null!;

    public int? ChapterId { get; set; }

    public virtual Chapter? Chapter { get; set; }

    public virtual ICollection<Question> Questions { get; } = new List<Question>();

    public virtual ICollection<QuizAttempt> QuizAttempts { get; } = new List<QuizAttempt>();

    public virtual Subject? Subject { get; set; }
}
