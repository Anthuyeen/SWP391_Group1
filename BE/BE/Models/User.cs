﻿using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class User
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? Mobile { get; set; }

    public string? Gender { get; set; }

    public string? Avatar { get; set; }

    public string? Role { get; set; }

    public string? Status { get; set; }

    public string? FirstName { get; set; }

    public string? MidName { get; set; }

    public string? LastName { get; set; }

    public virtual ICollection<ChapterCompletion> ChapterCompletions { get; } = new List<ChapterCompletion>();

    public virtual ICollection<LessonCompletion> LessonCompletions { get; } = new List<LessonCompletion>();

    public virtual ICollection<QuizAttempt> QuizAttempts { get; } = new List<QuizAttempt>();

    public virtual ICollection<Registration> Registrations { get; } = new List<Registration>();

    public virtual ICollection<SubjectCompletion> SubjectCompletions { get; } = new List<SubjectCompletion>();

    public virtual ICollection<Subject> Subjects { get; } = new List<Subject>();
}
