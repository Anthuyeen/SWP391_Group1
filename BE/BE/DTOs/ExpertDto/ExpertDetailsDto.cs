namespace BE.DTOs.ExpertDto
{
    public class ExpertDetailsDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string MidName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Gender { get; set; }
        public string Avatar { get; set; }
        public string Role { get; set; }
        public string Status { get; set; }
        public List<SubjectSummaryDto> Subjects { get; set; }
    }

    public class SubjectSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
    }
}
