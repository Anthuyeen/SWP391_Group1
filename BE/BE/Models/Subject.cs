using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Subject
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Thumbnail { get; set; }

    public int? CategoryId { get; set; }

    public bool IsFeatured { get; set; }

    public int? OwnerId { get; set; }

    public string? Status { get; set; }

    public string? Description { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<Chapter> Chapters { get; } = new List<Chapter>();

    public virtual ICollection<Lesson> Lessons { get; } = new List<Lesson>();

    public virtual User? Owner { get; set; }

    public virtual ICollection<PricePackage> PricePackages { get; } = new List<PricePackage>();

    public virtual ICollection<Quiz> Quizzes { get; } = new List<Quiz>();

    public virtual ICollection<Registration> Registrations { get; } = new List<Registration>();
}
