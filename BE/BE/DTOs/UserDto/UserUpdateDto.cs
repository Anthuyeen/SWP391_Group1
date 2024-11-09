public class UserProfileDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string MidName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Mobile { get; set; }
    public string Gender { get; set; }
    public string Avatar { get; set; }
    public string Password { get; set; } = null!;

}
