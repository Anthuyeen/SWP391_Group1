using BE.DTOs;
using BE.Service.IService;
using Microsoft.Extensions.Caching.Memory;

namespace BE.Service.ImplService
{
    public class OtpService
    {
        private readonly Dictionary<string, string> _otpStore = new Dictionary<string, string>();
        private readonly IEmailService _emailService;
        private readonly IMemoryCache _memoryCache;

        public OtpService(IEmailService emailService, IMemoryCache memoryCache)
        {
            _emailService = emailService;
            _memoryCache = memoryCache;
        }

        public async Task<string> GenerateAndSendOtpAsync(string email)
        {
            var otp = GenerateOtp();
            _otpStore[email] = otp;

            var mailRequest = new Mailrequest
            {
                Email = email,
                Subject = "Your OTP Code",
                Emailbody = $"Your OTP code is {otp}"
            };

            await _emailService.SendEmailAsync(mailRequest);

            return otp;
        }

        public bool VerifyOtp(string email, string otp)
        {
            return _otpStore.TryGetValue(email, out var storedOtp) && storedOtp == otp;
        }

        private string GenerateOtp()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        public void StoreOtp(string phoneNumber, string otp)
        {
            // Lưu trữ OTP với thời gian sống là 5 phút
            var cacheEntryOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromMinutes(5)); // OTP sẽ hết hạn sau 5 phút

            _memoryCache.Set(phoneNumber, otp, cacheEntryOptions);
        }

        public string GetStoredOtp(string phoneNumber)
        {
            _memoryCache.TryGetValue(phoneNumber, out string otp);
            return otp;
        }

        public void RemoveOtp(string phoneNumber)
        {
            _memoryCache.Remove(phoneNumber);
        }
    }

}
