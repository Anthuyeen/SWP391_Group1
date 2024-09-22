namespace BE.DTOs.ExpertDto
{
    public class SubjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Thumbnail { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public bool IsFeatured { get; set; }
        public int? OwnerId { get; set; }
        public string? OwnerName { get; set; }
        public string? Status { get; set; }
        public string? Description { get; set; }
    }

    public class EditSubjectDto
    {
        public string Name { get; set; }
        public string? Thumbnail { get; set; }
        public int? CategoryId { get; set; }
        public bool IsFeatured { get; set; }
        public int? OwnerId { get; set; }
        public string Status { get; set; }
        public string? Description { get; set; }
    }
}
