using DocumentShare.Data;
using DocumentShare.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Services
{
    public interface IMailService
    {
        Task SendEmailAsync(MailRequest mailRequest, string link);
        //Task SendEmailChangePasswordAsync(AppIdentityUser user, string link);

        Task SendChangePasswordAsync(MailRequest mailRequest, string link);
    }
}
