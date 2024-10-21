using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class LessonCompletion
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int LessonId { get; set; }

    public DateTime? CompletionDate { get; set; }

    public bool Status { get; set; }

    public virtual Lesson Lesson { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
