namespace BE.DTOs.UserDto
{
    public class UserRegisterDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string FName { get; set; } = null!;
        public string LName { get; set; } = null!;
        public string MName { get; set; } = null!;
        public string Gender { get; set; } = null!; public string Phone { get; set; }
    }
}
