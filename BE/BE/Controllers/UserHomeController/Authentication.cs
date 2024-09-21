using BE.DTOs.UserDto;
using BE.Models;
using BE.Service.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.UserHomeController
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class Authentication : ControllerBase
    {
        private readonly IUserService _userService;

        public Authentication(IUserService userService)
        {
            _userService = userService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            var token = _userService.Authenticate(userLoginDto);

            if (token.Result == null)
            {
                return Unauthorized();
            }
            return Ok(new { Token = token.Result });
        }
    }
}
