using DocumentShare.Models;
using DocumentShare.Settings;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Services
{
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        public MailService(IOptions<MailSettings> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }

        public async Task SendEmailAsync(MailRequest mailRequest, string link)
        {
            try
            {

                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
                email.From.Add(MailboxAddress.Parse("emreuluskkk@yandex.com"));
                email.To.Add(MailboxAddress.Parse(mailRequest.Email));
                var builder = new BodyBuilder();


                //var link = Url.Action(nameof(VerifyEmail), "Auth", new { userId = user.Id, code }, Request.Scheme, Request.Host.ToString());

                //builder.HtmlBody = "<p>DENEMEEEE MAAAİİİLLLL HELLOOOOOOO</p>";
                builder.HtmlBody = "<p><a href='"+ link + "'> Click Me And Verify Email! </a></p>";
                email.Body = builder.ToMessageBody();
                email.Subject = "Test Email Subject";

                using var smtp = new SmtpClient();
                
                smtp.Connect(_mailSettings.Host, _mailSettings.Port);                
                smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
            }
            catch (Exception e)
            {
                throw new NotImplementedException();
            }
        }



        public async Task SendChangePasswordAsync(MailRequest mailRequest, string link)
        {
            try
            {

                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
                email.From.Add(MailboxAddress.Parse("emreuluskkk@yandex.com"));
                email.To.Add(MailboxAddress.Parse(mailRequest.Email));
                var builder = new BodyBuilder();


                //var link = Url.Action(nameof(VerifyEmail), "Auth", new { userId = user.Id, code }, Request.Scheme, Request.Host.ToString());

                //builder.HtmlBody = "<p>DENEMEEEE MAAAİİİLLLL HELLOOOOOOO</p>";
                builder.HtmlBody = "<p><a href='" + link + "'> Click me and change password! </a></p>";
                email.Body = builder.ToMessageBody();
                email.Subject = "Change Password Email";

                using var smtp = new SmtpClient();

                smtp.Connect(_mailSettings.Host, _mailSettings.Port);
                smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
            }
            catch (Exception e)
            {
                throw new NotImplementedException();
            }
        }



    }
}
