using AutoMapper;
using DocumentShare.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DocumentShare.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Microsoft.AspNetCore.Cors;
using DocumentShare.Dtos;
using System.IO.Compression;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.StaticFiles;
using System.Text;

namespace DocumentShare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class FilesController : Controller
    {
        private IHostingEnvironment _hostingEnvironment = null;
        private IAppRepository _appRepository;
        private IMapper _mapper;
        private AppIdentityDbContext _context;
        private IAuthRepository _authRepository;

        public FilesController(IAuthRepository authRepository, IHostingEnvironment hostingEnvironment, IAppRepository appRepository, IMapper mapper, AppIdentityDbContext context)
        {
            _authRepository = authRepository;
            _hostingEnvironment = hostingEnvironment;
            _appRepository = appRepository;
            _mapper = mapper;
            _context = context;
        }

        //[HttpGet]
        public IActionResult Index(string fileName)
        {
            FileClass fileObj = new FileClass();
            fileObj.Name = fileName;
            string path = $"{_hostingEnvironment.WebRootPath}\\files\\";
            int nId = 1;

            foreach (string pdfPath in Directory.EnumerateFiles(path, "*.pdf"))
            {/*
                fileObj.FileClasses.Add(new FileClass()
                {
                    Id = nId++,
                    Name = Path.GetFileName(pdfPath),
                    Path = pdfPath
                });*/
            }

            return View(fileObj);
        }

        [HttpPost]
        public IActionResult Index(IFormFile file, [FromServices] IHostingEnvironment hostingEnvironment)
        {
            string fileName = $"{hostingEnvironment.WebRootPath}\\files\\{file.FileName}";
            using (FileStream fileStream = System.IO.File.Create(fileName))
            {
                file.CopyTo(fileStream);
                fileStream.Flush();
            }
            return Index(fileName);
        }

        public IActionResult PdfViewerNewTab(string fileName)
        {
            string path = _hostingEnvironment.WebRootPath + "\\files\\" + fileName;
            return File(System.IO.File.ReadAllBytes(path), "application/pdf");
        }

        // GET api/files
        [HttpGet]
        public ActionResult GetFiles()
        {
            try
            {
                var files = _appRepository.GetFiles(); // Tüm alanlar döndürülür.
                // Documents'lerin detay kısmında hangi veriler isteniyorsa o kısımları döndürülür.
                //var filesToReturn = _mapper.Map<List<FileDto>>(files); // documents, DocumentForListDto'a map edilir.
                var filesToReturn = _appRepository.GetFiles().Select(f => new { f.Id, f.UserId, f.Name, f.Path, f.ContentType, f.Category, f.Length, f.Likes, f.DownloadCount, f.AdminConfirmed}).Where(f => f.AdminConfirmed == true);
                // Yukardaki satırda sadece isim verilerinin getirilmesi sağlanıyor.
                // (Bunun yerine dto kullanılıyor ve mapping işlemi gerçekleştiriliyor.)
                return Ok(filesToReturn);
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        // GET api/files/count
        [HttpGet]
        [Route("count")]
        public ActionResult GetFilesCount()
        {
            try
            {
                var filesCount = _appRepository.GetFilesCount();
                return Ok(filesCount);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        // GET api/files/filteredFiles/?id=...
        [HttpGet]
        [Route("filteredFiles")]
        public ActionResult GetFilteredFiles(string id)
        {
            try
            {
                var files = _appRepository.GetFilteredFiles(id);
                return Ok(files);
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        // GET api/files/detail/?id=5
        [HttpGet]
        [Route("detail")]
        public ActionResult GetFileById(int id)
        {
            var file = _appRepository.GetFileById(id);
            var fileToReturn = _mapper.Map<FileForDetailDto>(file);
            return Ok(fileToReturn);
        }

        // GET api/files/detail/?id=5
        [HttpGet]
        [Route("userprofile")]
        public ActionResult GetUserProfile(string id)
        {
            var user = _authRepository.GetUserById(id);
            return Ok(user);
        }


        [HttpPost]
        [Route("add")]
        [Authorize(Roles ="Customer")]
        [RequestSizeLimit(5242880)]
        public ActionResult Add()
        {
            try
            {
                var filesCtrl = Request.Form.Files;
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
            var files = Request.Form.Files;
            var fileCategory = "";
            var userID = "";
            long fileLength = 0;
            foreach (var file in files)
            {
                //Compress(file);
                var uniqueFileName = GetUniqueFileName(file.FileName);
                string[] value2 = uniqueFileName.Split('.');
                string[] value3 = uniqueFileName.Split('.');
                var uplouadPath = Path.Combine(_hostingEnvironment.WebRootPath, "files");

                if (!Directory.Exists(uplouadPath))
                {
                    Directory.CreateDirectory(uplouadPath);
                }
                List<string> uploadedFiles = new List<string>();

                var filePath = Path.Combine(uplouadPath, uniqueFileName);
                
                DirectoryInfo directorySelected = new DirectoryInfo(uplouadPath);


                if (Request.Form.TryGetValue("data", out var data))
                {
                    fileCategory = data.ToString();
                }
                if (Request.Form.TryGetValue("id", out var id))
                {
                    userID = id.ToString();
                }
                if (file.Length > 5242880)
                {
                    return BadRequest();
                }

                foreach (IFormFile postedFile in files)
                {
                    using (FileStream stream = new FileStream(Path.Combine(uplouadPath, uniqueFileName), FileMode.Create))
                    {
                        postedFile.CopyTo(stream);
                        
                    }
                }

                foreach (FileInfo fileToCompress in directorySelected.GetFiles())
                {
                    if(fileToCompress.Name == uniqueFileName)
                    {
                        using (FileStream originalFileStream = fileToCompress.OpenRead())
                        {
                            if ((System.IO.File.GetAttributes(fileToCompress.FullName) &
                               FileAttributes.Hidden) != FileAttributes.Hidden & fileToCompress.Extension != ".gz")
                            {
                                value2 = fileToCompress.FullName.Split('.');
                                value3 = fileToCompress.Name.Split('.');
                                using (FileStream compressedFileStream = System.IO.File.Create(value2[0] + ".gz"))
                                {
                                    using (GZipStream compressionStream = new GZipStream(compressedFileStream,
                                       CompressionMode.Compress))
                                    {
                                        originalFileStream.CopyTo(compressionStream);
                                        uploadedFiles.Add(Path.Combine(uplouadPath, value2[0]));
                                    }
                                }
                                FileInfo info = new FileInfo(uplouadPath + Path.DirectorySeparatorChar + value3[0] + ".gz");
                                Console.WriteLine($"Compressed {value2[0] + ".gz"} from {fileToCompress.Length.ToString()} to {info.Length.ToString()} bytes.");
                                fileLength = info.Length;

                            }
                        }

                        var fileDelete = Path.Combine(uplouadPath, uniqueFileName);
                        FileInfo fi = new FileInfo(fileDelete);
                        if (fi != null)
                        {
                            System.IO.File.Delete(fileDelete);
                            fi.Delete();
                        }
                        //_appRepository.Delete(file);
                        //_context.SaveChanges();
                    }



                }

                _appRepository.Add(new FileClass()
                {
                    Name = value3[0] + ".gz",
                    Path = filePath,
                    ContentType = file.ContentType,
                    Length = Convert.ToInt32(fileLength),
                    //UserId = Convert.ToInt32(User.FindFirstValue(ClaimTypes.NameIdentifier)),
                    UserId = User.FindFirstValue(ClaimTypes.NameIdentifier)/*"fe9fd3f6-7557-4b12-b7af-87e1ba85b633"*/,
                    Category = fileCategory
                });
                try
                {
                    //_appRepository.SaveAll();
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    return BadRequest();
                }
            }
            return Ok();
        }

        private string GetUniqueFileName(string fileName)
        {
            fileName = Path.GetFileName(fileName);
            return Path.GetFileNameWithoutExtension(fileName)
                      + "_"
                      + Guid.NewGuid().ToString().Substring(0, 4)
                      + Path.GetExtension(fileName);
        }


        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> DownloadFile(int id)
        {
            var provider = new FileExtensionContentTypeProvider();
            var document = await _context.FileClasses.FindAsync(id);
            //document.ContentType = "application/x-gzip";
            if (document == null)
                return NotFound();

            var file = Path.Combine(_hostingEnvironment.WebRootPath, "files", document.Name);

            string contentType;
            if (!provider.TryGetContentType(file, out contentType))
            {
                //contentType = document.ContentType;
                contentType = "application/octet-stream";
            }

            byte[] fileBytes;
            if(System.IO.File.Exists(file))
            {
                document.DownloadCount = document.DownloadCount + 1;
                fileBytes = System.IO.File.ReadAllBytes(file);
                _context.SaveChanges();
            }
            else
            {
                return NotFound();
            }

            return File(fileBytes, contentType, document.Name);
        }


        [HttpGet]
        [Route("like/{id}")]
        public async Task<ActionResult> GiveLike(int id)
        {
            var file = _context.FileClasses.FirstOrDefault(f => f.Id == id);

            try
            {
                if (file != null)
                {
                    file.Likes = file.Likes + 1;
                }
                //_appRepository.SaveAll();
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
            return Ok();
        }

        [HttpGet("text")]
        public IActionResult SearchFile(string text, string category)
        {
            try
            {
                IQueryable<FileClass> query = _context.FileClasses;
                if(text != null)
                {
                    query = query.Where(p => p.Name.ToLower().Contains(text.ToLower()));
                }
                if (category != null)
                {
                    query = query.Where(p => p.Category.ToLower().Contains(category.ToLower()));
                }
                
                return Ok(query.ToList());
            }
            catch (Exception e)
            {
                return NotFound();
            }
        }

        [HttpGet("details/{FileId}")]
        public async Task<IActionResult> Details(int PostId)
        {

            var comment = new CommentToDocument { FileId = PostId };
            return View(comment);
        }

        [HttpPost]
        [Route("comment")]
        public async Task<IActionResult> SendComment(int fileId, CommentToDocument comment)
        {
            if (ModelState.IsValid)
            {
                _context.Add(comment);
                await _context.SaveChangesAsync();

                //return View("Details", new CommentToDocument { FileId = comment.FileId });
            }
            //return View("Posts/Details");
            return Ok();
        }
    }
}
