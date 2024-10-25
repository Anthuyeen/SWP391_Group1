namespace BE.DTOs.UserDto
{
    public class CompleteSubjectDto
    {
        public int UserId { get; set; }
        public int SubjectId { get; set; }
        public DateTime CompletionDate { get; set; }
        public bool? Status { get; set; }
        public string? CertificateUrl { get; set; }
    }
}
