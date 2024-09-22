using BE.DTOs.UserDto;
using BE.Models;

namespace BE.Service.IService
{
    public interface IUserService
    {
        Task<string> Authenticate(UserLoginDto loginDto);
        string GenerateJwtToken(User user);
        Task<User> GetUserById(int id);
        bool CheckEmailExits(string email);
    }
}
