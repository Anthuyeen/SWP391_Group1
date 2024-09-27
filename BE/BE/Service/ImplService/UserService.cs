using BE.DTOs.UserDto;
using BE.Models;
using BE.Service.IService;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Crypto.Generators;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BE.Service.ImplService
{
    public class UserService : IUserService
    {
        private readonly IConfiguration _configuration;
        private readonly OnlineLearningSystemContext _onlineLearningSystemContext;
        public UserService(IConfiguration configuration, OnlineLearningSystemContext onlineLearningSystemContext)
        {
            _configuration = configuration;
            _onlineLearningSystemContext = onlineLearningSystemContext;
        }

        // This method is responsible for authenticating a user.
        public async Task<string> Authenticate(UserLoginDto loginDto)
        {
            var user = await _onlineLearningSystemContext.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null || user.Password != loginDto.Password)
            {
                return null;
            }
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(ClaimTypes.Role, user.Role ?? "User"),
                 new Claim("Id", user.Id.ToString()),
                 new Claim("Name", user.FirstName + user.MidName + user.LastName),
            }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);

        }

        public bool CheckEmailExits(string email)
        {
            return _onlineLearningSystemContext.Users.Any(u => u.Email == email);
        }

        // This method generates a JWT token for the authenticated user.
        public string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
            new Claim("Id", user.Id.ToString()),
            new Claim("FullName", user.FirstName +" "+ user.MidName +" "+ user.LastName),       
            new Claim("Email", user.Email),
            new Claim("Role", user.Role ?? "User")
        };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<User> GetUserById(int id)
        {
            var u = await _onlineLearningSystemContext.Users.FirstOrDefaultAsync(x => x.Id == id);
            return u;
        }
    }
}


