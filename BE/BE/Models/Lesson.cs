using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Lesson
{
    public int Id { get; set; }

    public int? SubjectId { get; set; }

    public string Name { get; set; } = null!;

    public string? Content { get; set; }

    public string? Status { get; set; }

    public string? Url { get; set; }

    public virtual ICollection<LessonCompletion> LessonCompletions { get; } = new List<LessonCompletion>();

    public virtual Subject? Subject { get; set; }
}
