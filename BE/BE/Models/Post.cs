using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Post
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string? BriefInfo { get; set; }

    public int? CategoryId { get; set; }

    public bool IsFeatured { get; set; }

    public string? Status { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<PostContent> PostContents { get; } = new List<PostContent>();

    public virtual ICollection<PostImage> PostImages { get; } = new List<PostImage>();
}
