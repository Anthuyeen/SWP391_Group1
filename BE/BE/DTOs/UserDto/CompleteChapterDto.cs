namespace BE.DTOs.UserDto
{
    public class CompleteChapterDto
    {
        public int UserId { get; set; }
        public int ChapterId { get; set; }
        public int SubjectId { get; set; }
        public DateTime CompletionDate { get; set; }
        public bool? Status { get; set; }
    }
}
