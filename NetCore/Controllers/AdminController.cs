using DocumentShare.Data;
using DocumentShare.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private IHostingEnvironment _hostingEnvironment = null;
        private IAppRepository _appRepository;
        private IAuthRepository _authRepository;
        private UserManager<AppIdentityUser> _userManager;
        private SignInManager<AppIdentityUser> _signInManager;
        AppIdentityDbContext _context;

        public AdminController(IHostingEnvironment hostingEnvironment, AppIdentityDbContext context, UserManager<AppIdentityUser> userManager, SignInManager<AppIdentityUser> signInManager, IAuthRepository authRepository, /*IHostingEnvironment hostingEnvironment, */IAppRepository appRepository/*, IMapper mapper, AppIdentityDbContext context*/)
        {
            _hostingEnvironment = hostingEnvironment;
            _authRepository = authRepository;
            _appRepository = appRepository;
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }

        // GET api/admin/getfiles
        [HttpGet]
        [Route("getfiles")]
        public ActionResult GetFiles()
        {
            try
            {
                var files = _appRepository.GetFiles(); // Tüm alanlar döndürülür.
                var filesToReturn = _appRepository.GetFiles().Select(f => new { f.Id, f.UserId, f.Name, f.Path, f.ContentType, f.Category, f.Length, f.Likes, f.DownloadCount, f.AdminConfirmed });
                return Ok(filesToReturn);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        // GET api/admin/getusers
        [HttpGet]
        [Route("getusers")]
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

        // GET api/admin/deleteusers
        [HttpGet]
        [Route("deleteusers")]
        public async Task<ActionResult> DeleteUsers(string id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if(user == null)
                {
                    return NotFound();
                }
                var result = await _userManager.DeleteAsync(user);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        // POST api/admin/confirmed
        [HttpPost]
        [Route("confirmed")]
        public async Task<ActionResult> AdminConfirmed(FileClass confirmedFile)
        {
            try
            {
                var file = await _context.FileClasses.FindAsync(confirmedFile.Id);
                if (file != null)
                {
                    file.AdminConfirmed = true;
                    _context.SaveChanges();
                }
                return StatusCode(201);
            }
            catch (Exception)
            {
                return Content("Dosya onaylanma işlemi başarısız.");
            }
        }

        // POST api/admin/denied
        [HttpPost]
        [Route("denied")]
        public async Task<ActionResult> AdminDenied(FileClass rejectedFile)
        {
            try
            {
                var file = await _context.FileClasses.FindAsync(rejectedFile.Id);
                if (file != null)
                {
                    file.AdminConfirmed = false;
                    _context.SaveChanges();
                }
                var fileUpload = Path.Combine(_hostingEnvironment.WebRootPath, "files", rejectedFile.Name);
                FileInfo fi = new FileInfo(fileUpload);
                if(fi != null)
                {
                    System.IO.File.Delete(fileUpload);
                    fi.Delete();
                }
                var fileUploadGz = Path.Combine(_hostingEnvironment.WebRootPath, "files", rejectedFile.Name+".gz");
                FileInfo fiGz = new FileInfo(fileUploadGz);
                if (fiGz != null)
                {
                    System.IO.File.Delete(fileUploadGz);
                    fiGz.Delete();
                }

                _appRepository.Delete(file);
                _context.SaveChanges();
                return Ok("Dosya reddedilme işlemi başarılı.");
            }
            catch (Exception)
            {
                return Ok("Dosya reddedilme işlemi başarısız.");
            }
        }
    }
}
