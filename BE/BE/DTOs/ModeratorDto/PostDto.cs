namespace BE.DTOs.ModeratorDto
{
    public class PostDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? BriefInfo { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public bool IsFeatured { get; set; }
        public string? Status { get; set; }
        public List<PostImageDto> Images { get; set; } = new List<PostImageDto>();
        public List<PostContentDto> Contents { get; set; } = new List<PostContentDto>();
    }

    public class EditPostDto
    {
        public string Title { get; set; } = null!;
        public string? BriefInfo { get; set; }
        public int? CategoryId { get; set; }
        public bool IsFeatured { get; set; }
        public string Status { get; set; } = null!;
        public List<PostImageDto> Images { get; set; } = new List<PostImageDto>();
        public List<PostContentDto> Contents { get; set; } = new List<PostContentDto>();
    }

    public class PostContentDto
    {
        public int Id { get; set; }
        public string? Content { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class PostImageDto
    {
        public int Id { get; set; }
        public string Url { get; set; } = null!;
        public int DisplayOrder { get; set; }
    }
}