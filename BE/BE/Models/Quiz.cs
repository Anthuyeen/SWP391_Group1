using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Quiz
{
    public int Id { get; set; }

    public int? SubjectId { get; set; }

    public string Name { get; set; } = null!;

    public string? Level { get; set; }

    public int DurationMinutes { get; set; }

    public decimal PassRate { get; set; }

    public string? Type { get; set; }

    public virtual Subject? Subject { get; set; }

    public virtual ICollection<Question> Questions { get; } = new List<Question>();
}
