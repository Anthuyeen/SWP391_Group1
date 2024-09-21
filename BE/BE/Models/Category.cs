using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Type { get; set; }

    public virtual ICollection<Post> Posts { get; } = new List<Post>();

    public virtual ICollection<Subject> Subjects { get; } = new List<Subject>();
}
