using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class PricePackage
{
    public int Id { get; set; }

    public int? SubjectId { get; set; }

    public string Name { get; set; } = null!;

    public int DurationMonths { get; set; }

    public decimal ListPrice { get; set; }

    public decimal SalePrice { get; set; }

    public string? Description { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<Registration> Registrations { get; } = new List<Registration>();

    public virtual Subject? Subject { get; set; }
}
