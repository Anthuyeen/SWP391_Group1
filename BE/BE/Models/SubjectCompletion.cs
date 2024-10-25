using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class SubjectCompletion
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int SubjectId { get; set; }

    public DateTime CompletionDate { get; set; }

    public bool? Status { get; set; }

    public string? CertificateUrl { get; set; }

    public virtual Subject Subject { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
