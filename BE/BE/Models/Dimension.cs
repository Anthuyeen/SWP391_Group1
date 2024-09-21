using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Dimension
{
    public int Id { get; set; }

    public int? SubjectId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? Type { get; set; }

    public virtual Subject? Subject { get; set; }
}
