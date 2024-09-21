namespace BE.DTOs.UserDto
{
    public class ExpertAddDto
    {
        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? Mobile { get; set; }

        public string? Gender { get; set; }

        public string? Avatar { get; set; }

        public string? Role { get; set; }

        public string? Status { get; set; }
    }
}
