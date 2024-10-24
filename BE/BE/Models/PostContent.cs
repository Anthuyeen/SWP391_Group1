﻿using System;
using System.Collections.Generic;

namespace BE.Models;

public partial class PostContent
{
    public int Id { get; set; }

    public int PostId { get; set; }

    public string? Content { get; set; }

    public int DisplayOrder { get; set; }

    public virtual Post Post { get; set; } = null!;
}
