using BE.DTOs;
using BE.DTOs.UserDto;
using BE.Models;
using BE.Service.ImplService;
using BE.Service.IService;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.UserHomeController
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class Authentication : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly OnlineLearningSystemContext _onlineLearningSystemContext;
        private readonly OtpService _otpService;
        private readonly IEmailService _emailService;


        public Authentication(IUserService userService, OnlineLearningSystemContext onlineLearningSystemContext, OtpService otpService, IEmailService emailService)
        {
            _onlineLearningSystemContext = onlineLearningSystemContext;
            _userService = userService;
            _otpService = otpService;
            _emailService = emailService;
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

        [HttpPost]
        public async Task<IActionResult> SendOtpEmail(string email)
        {
            if (email == null)
            {
                return Unauthorized("Please enter your email");
            }
            if (!_userService.CheckEmailExits(email))
            {
                return NotFound(new { Status = "Tài khoản không tồn tại." });
            }
            try
            {
                await _otpService.GenerateAndSendOtpAsync(email);
                return Ok("OTP sent successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error sending OTP: {ex.Message}");
            }
        }

        [HttpPost]
        public IActionResult VerifyOtpEmailAndResetPass([FromBody] OtpRequestEmail request)
        {

            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Otp))
            {
                return BadRequest("Email and OTP are required.");
            }

            var isValid = _otpService.VerifyOtp(request.Email, request.Otp);
            if (isValid)
            {
                var newPassword = GenerateRandomPassword();
                _emailService.SendEmailAsync(new Mailrequest { Email = request.Email, Subject = "New password", Emailbody = $"Your new password is: {newPassword}" });
                return Ok("OTP verified successfully.");
            }
            else
            {
                return Unauthorized("Invalid OTP.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Register(UserRegisterDto registerDto)
        {
            try
            {
                if (_userService.CheckEmailExits(registerDto.Email))
                {
                    return BadRequest("This email already exsit");
                }
                var account = new User
                {
                    Email = registerDto.Email,
                    Gender = registerDto.Gender,
                    FirstName = registerDto.FName,
                    LastName = registerDto.LName,
                    MidName = registerDto.MName,
                    Mobile = registerDto.Phone,
                    Role = "Student",
                    Password = registerDto.Password,
                    Status = "Active"
                };
                await _onlineLearningSystemContext.Users.AddAsync(account);
                await _onlineLearningSystemContext.SaveChangesAsync();
                return Ok(new { message = "Đăng ký thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private string GenerateRandomPassword()
        {
            // Tạo mật khẩu ngẫu nhiên, ví dụ: 8 ký tự bao gồm chữ và số
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var stringChars = new char[8];
            var random = new Random();

            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            return new String(stringChars);
        }
    }
}
