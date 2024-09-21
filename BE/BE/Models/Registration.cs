using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class Registration
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int? SubjectId { get; set; }

    public int? PackageId { get; set; }

    public DateTime RegistrationTime { get; set; }

    public decimal TotalCost { get; set; }

    public string? Status { get; set; }

    public DateTime ValidFrom { get; set; }

    public DateTime ValidTo { get; set; }

    public virtual PricePackage? Package { get; set; }

    public virtual Subject? Subject { get; set; }

    public virtual User? User { get; set; }
}
