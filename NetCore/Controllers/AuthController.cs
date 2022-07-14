using AutoMapper;
using DocumentShare.Data;
using DocumentShare.Dtos;
using DocumentShare.Helpers;
using DocumentShare.Models;
using DocumentShare.Services;
using Firebase.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace DocumentShare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private static string apiKEY = "AIzaSyDN0xahvA-cFvBsCs3MmflAGrOC4y6yhMw";

        private UserManager<AppIdentityUser> _userManager;
        private SignInManager<AppIdentityUser> _signInManager;
        private IHostingEnvironment _hostingEnvironment = null;
        private IAuthRepository _authRepository;
        IConfiguration _configuration;
        private IMapper _mapper;
        private readonly IMailService _mailService;

        public AuthController(IMailService mailService, IHostingEnvironment hostingEnvironment, IAuthRepository authRepository, IMapper mapper, IConfiguration configuration, UserManager<AppIdentityUser> userManager, SignInManager<AppIdentityUser> signInManager)
        {
            _mailService = mailService;
            _hostingEnvironment = hostingEnvironment;
            _authRepository = authRepository;
            _mapper = mapper;
            _configuration = configuration;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // GET api/users
        [HttpGet]
        public ActionResult GetUsers()
        {
            try
            {
                var users = _authRepository.GetUsers(); // Tüm alanlar döndürülür.
                return Ok(users);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        // GET api/users/count
        [HttpGet]
        [Route("count")]
        public ActionResult GetUsersCount()
        {
            try
            {
                var usersCount = _authRepository.GetUsersCount();
                return Ok(usersCount);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        // GET api/users/detail/?id=5
        [HttpGet]
        [Route("detail")]
        public ActionResult GetUserById(string id)
        {
            var user = _authRepository.GetUserById(id);
            return Ok(user);
        }

        // POST api/auth/register
        [HttpPost("register")]
        //[ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] MailRequest request)
        {
            if (!ModelState.IsValid)
            {
                return Unauthorized();
            }

            request.Role = "Customer";
            var user = new AppIdentityUser
            {
                UserName = request.UserName,
                Email = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            var resultRole = await _userManager.AddToRoleAsync(user, request.Role);

            try {
                if (result.Succeeded) {
                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    var link = Url.Action(nameof(VerifyEmail), "Auth", new { userId = user.Id, code }, Request.Scheme, Request.Host.ToString());
                    //await _mailService.SendAsync(user.Email, "your email verify", $"<a href=\"{link+ "verifyemail"}\">Verify Email</a>", true);

                    try
                    {
                        await _mailService.SendEmailAsync(request, link);
                        return Ok();
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }

                    return RedirectToAction("EmailVerification");
                }
            }
            catch (Exception e) {
                return BadRequest(""+e);
            }
            return StatusCode(201); // created
        }

        [HttpGet("verifyemail")]
        public async Task<IActionResult> VerifyEmail(string userId, string code)
        {
            String[] spearator = { "verifyemail" };
            Int32 count = 2;
            String[] newCode = code.Split(spearator, count, StringSplitOptions.RemoveEmptyEntries);

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return BadRequest();
            var result = await _userManager.ConfirmEmailAsync(user, newCode[0]);

            if (result.Succeeded)
            {
                var html = "<p>Mail dogrulama isleminiz gerceklestirildi..</p>";
                return new ContentResult
                {
                    Content = html,
                    ContentType = "text/html"
                };
            }

            return BadRequest();
        }

        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code))
                return NotFound();

            var decodedToken = WebEncoders.Base64UrlDecode(code);
            string normalToken = Encoding.UTF8.GetString(decodedToken);

            //kullanıcının kim oldugu bulunur.
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ApplicationException("Unable to find the user !");
            }

            try
            {
                var result = await _userManager.ConfirmEmailAsync(user, normalToken);

                if (result.Succeeded)
                {
                    return Redirect($"{_configuration["AppUrl"]}/ConfirmEmail.html");
                }
            }
            catch (Exception e)
            {
                return BadRequest("" + e);
            }

            return Unauthorized();
        }









        //[FromBody] UserForRegisterDto userForRegisterDto,
        // POST api/auth/register
        [HttpPost("sendchangepasswordmail")]
        //[ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> SendChangePasswordMail([FromBody] MailRequest request)
        {
            try
            {
                //var user = await _userManager.FindByEmailAsync(request.Email);
                //var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                //var link = Url.Action(nameof(ChangePassword), "Auth", new { userId = user.Id, code }, Request.Scheme, Request.Host.ToString());
                var link = "http://localhost:4200/sendChangePassword";
                //await _mailService.SendAsync(user.Email, "your email verify", $"<a href=\"{link+ "verifyemail"}\">Verify Email</a>", true);

                try
                {
                    await _mailService.SendChangePasswordAsync(request, link);
                    return Ok();
                }
                catch (Exception ex)
                {
                    throw;
                }

                return RedirectToAction("EmailVerification");
            }
            catch (Exception e)
            {
                return BadRequest("" + e);
            }
            return StatusCode(201); // created
        }





        [HttpPost("changepassword")]
        public async Task<IActionResult> ChangePassword(UserForRegisterDto userForRegisterDto)
        {
            /*String[] spearator = { "changepassword" };
            Int32 count = 2;
            String[] newCode = code.Split(spearator, count, StringSplitOptions.RemoveEmptyEntries);
            */
            var user = await _userManager.FindByEmailAsync(userForRegisterDto.Email);
            //var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            //var link = Url.Action(nameof(ChangePassword), "Auth", new { userId = user.Id, code }, Request.Scheme, Request.Host.ToString());
            if (user == null) return BadRequest();

            //var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            //var result = await _userManager.ResetPasswordAsync(user, token , userForRegisterDto.Password);
            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user,userForRegisterDto.Password);
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {

                var html = "<p>Parola değiştirme isleminiz gerceklestirildi..</p>";
                return new ContentResult
                {
                    Content = html,
                    ContentType = "text/html"
                };
            }

            return BadRequest();
        }











        // POST api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] UserForLoginDto userForLoginDto)
        {
            if(!ModelState.IsValid)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByNameAsync(userForLoginDto.UserName); // aynı görevde
            // var user = await _authRepository.Login(userForLoginDto.Id, userForLoginDto.Username, userForLoginDto.Password);
            //var user = await _authRepository.Login(userForLoginDto.Username, userForLoginDto.Password);
            if (user != null)
            {
                if(!await _userManager.IsEmailConfirmedAsync(user))
                {
                    ModelState.AddModelError(String.Empty, "Confirm Your Email !");
                    return Unauthorized();
                }
            }

            var result = await _signInManager.PasswordSignInAsync(userForLoginDto.UserName, userForLoginDto.Password, false, false);
            if(result.Succeeded)
            {
                try
                {
                    // Kullanıcıya token yollanır ve kullanıcı bundan sonra hep bu token ile istek yapar.
                    // Token geçerli olduğu sürece kullanıcı sistemde login olarak kalır, sonra out olur.
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.ASCII.GetBytes(_configuration.GetSection("AppSettings:Token").Value);

                    // Kullanıcıya atanan rol alınır.
                    var role = await _userManager.GetRolesAsync(user);
                    IdentityOptions _options = new IdentityOptions();

                    // Token üretilmeden önce bu token içinde neler tutulacağı belirlenir.
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                            // Token içinde tutulmak istenen temel bilgiler tutulur.
                            Subject = new ClaimsIdentity(new Claim[] {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(_options.ClaimsIdentity.RoleClaimType, role.FirstOrDefault()),
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.Email, user.Email)
                    }),

                        Expires = DateTime.Now.AddDays(0.1), // Bu token'in geçerlilik süresi belirlenir.
                                                             // Tokeni elde etmek için key ve hangi algoritma kullanıldığı belirtilir.
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
                    };

                    // Artık gerekli şeyler yapıldıktan sonra tokenDescriptor'a göre token create işlemi gerçekleştirilir.
                    var token = tokenHandler.CreateToken(tokenDescriptor);
                    var tokenString = tokenHandler.WriteToken(token);
                    JObject jObj = new JObject();
                    jObj.Add("token", tokenString);
                    jObj.Add("id", user.Id);
                    return Ok(jObj);
                }
                catch (Exception e)
                {

                    throw;
                }
            }

            ModelState.AddModelError(String.Empty, "Login failed !");
            return Unauthorized();
        }

        // POST api/auth/logout
        [HttpGet("logout")]
        public async Task<ActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }
    }
}
