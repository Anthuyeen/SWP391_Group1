namespace BE.DTOs.ExpertDto
{
    public class SubjectDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Thumbnail { get; set; }
        public string CategoryName { get; set; }
        public bool IsFeatured { get; set; }
        public string OwnerName { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }

        public List<LessonSummaryDto> Lessons { get; set; }
        public List<DimensionSummaryDto> Dimensions { get; set; }
        public List<QuizSummaryDto> Quizzes { get; set; }
        public List<PricePackageSummaryDto> PricePackages { get; set; }      
        public List<ChapterSummaryDto> Chapters { get; set; }
    }

    public class LessonSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public string? Url { get; set; }
        public int? ChapterId { get; set; }
    }

    public class DimensionSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
    }

    public class QuizSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
        public int DurationMinutes { get; set; }
        public string Status { get; set; } = null!;
    }

    public class PricePackageSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal ListPrice { get; set; }
        public decimal SalePrice { get; set; }
        public int DurationMonths { get; set; }
    }

    public class ChapterSummaryDto
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        public string Title { get; set; } = null!;
        public string? Status { get; set; }
    }
}
