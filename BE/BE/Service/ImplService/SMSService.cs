using BE.Service.IService;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace BE.Service.ImplService
{
    public class SMSService : ISMSService
    {
        private readonly string _accountSid;
        private readonly string _authToken;
        private readonly string _fromPhoneNumber;

        public SMSService(string accountSid, string authToken, string fromPhoneNumber)
        {
            _accountSid = accountSid;
            _authToken = authToken;
            _fromPhoneNumber = fromPhoneNumber;
        }

        public string ConvertPhoneNumberToInternationalFormat(string phoneNumber)
        {
            if (phoneNumber.StartsWith("0"))
            {
                return "+84" + phoneNumber.Substring(1);
            }
            return phoneNumber;
        }

        public async Task SendSmsAsync(string phoneNumber, string message)
        {
            TwilioClient.Init(_accountSid, _authToken);

            var messageResource = await MessageResource.CreateAsync(
                body: message,
                from: new Twilio.Types.PhoneNumber(_fromPhoneNumber),
                to: new Twilio.Types.PhoneNumber(phoneNumber)
            );

            Console.WriteLine(messageResource.Sid);
        }
    }
}
