using AutoMapper.Internal;
using BE.DTOs;

namespace BE.Service.IService
{
    public interface IEmailService
    {
        Task SendEmailAsync(Mailrequest mailrequest);

    }
}
