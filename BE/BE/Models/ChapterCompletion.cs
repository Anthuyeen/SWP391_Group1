using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class ChapterCompletion
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ChapterId { get; set; }

    public int SubjectId { get; set; }

    public DateTime CompletionDate { get; set; }

    public bool? Status { get; set; }

    public virtual Chapter Chapter { get; set; } = null!;

    public virtual Subject Subject { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
