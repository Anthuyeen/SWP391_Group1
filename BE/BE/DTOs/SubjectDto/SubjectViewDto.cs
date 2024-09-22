using BE.Models;

namespace BE.DTOs.SubjectDto
{
    public class SubjectViewDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string? Thumbnail { get; set; }

        public int? CategoryId { get; set; }

        public bool IsFeatured { get; set; }

        public int? OwnerId { get; set; }

        public string? Status { get; set; }

        public string? Description { get; set; }
        public string? Category { get; set; }
    }
}
