namespace BE.Service.IService
{
    public interface ISMSService
    {
        Task SendSmsAsync(string phoneNumber, string message);
        string ConvertPhoneNumberToInternationalFormat(string phoneNumber);
    }
}
