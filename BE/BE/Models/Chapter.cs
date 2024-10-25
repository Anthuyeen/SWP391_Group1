using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Chapter
{
    public int Id { get; set; }

    public int SubjectId { get; set; }

    public string Title { get; set; } = null!;

    public string? Status { get; set; }

    public virtual ICollection<ChapterCompletion> ChapterCompletions { get; } = new List<ChapterCompletion>();

    public virtual ICollection<Lesson> Lessons { get; } = new List<Lesson>();

    public virtual ICollection<Quiz> Quizzes { get; } = new List<Quiz>();

    public virtual Subject Subject { get; set; } = null!;
}
