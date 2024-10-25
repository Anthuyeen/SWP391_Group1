namespace BE.DTOs.UserDto
{
    public class SubjectProgressDto
    {
        public int SubjectId { get; set; }
        public string SubjectName { get; set; }
        public decimal CompletionPercentage { get; set; }
        public bool IsCompleted { get; set; }
        public List<ChapterProgressSummaryDto> ChapterProgress { get; set; } = new();
    }

    public class ChapterProgressSummaryDto
    {
        public int ChapterId { get; set; }
        public string ChapterTitle { get; set; }
        public bool IsCompleted { get; set; }
    }
}
