using BE.DTOs.UserDto;
using BE.Models;

namespace BE.Service.IService
{
    public interface IUserService
    {
        Task<string> Authenticate(UserLoginDto loginDto);
        string GenerateJwtToken(User user);
    }
}
