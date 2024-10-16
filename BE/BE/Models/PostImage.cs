using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class PostImage
{
    public int Id { get; set; }

    public int PostId { get; set; }

    public string Url { get; set; } = null!;

    public int DisplayOrder { get; set; }

    public virtual Post Post { get; set; } = null!;
}
