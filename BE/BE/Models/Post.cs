using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Post
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? Thumbnail { get; set; }

    public string? BriefInfo { get; set; }

    public string? Content { get; set; }

    public int? CategoryId { get; set; }

    public bool IsFeatured { get; set; }

    public string? Status { get; set; }

    public virtual Category? Category { get; set; }
}
