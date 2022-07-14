using AutoMapper;
using DocumentShare.Data;
using DocumentShare.Dtos;
using DocumentShare.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForumController : Controller
    {
        private IAppRepository _appRepository;
        private IMapper _mapper;
        private AppIdentityDbContext _context;

        public ForumController(IAppRepository appRepository, IMapper mapper, AppIdentityDbContext context)
        {
            _appRepository = appRepository;
            _mapper = mapper;
            _context = context;
        }

        // GET api/forum
        [HttpGet]
        public ActionResult GetForums()
        {
            try
            {
                var files = _appRepository.GetForums(); // Tüm alanlar döndürülür.
                // Documents'lerin detay kısmında hangi veriler isteniyorsa o kısımları döndürülür.
                //var filesToReturn = _mapper.Map<List<FileDto>>(files); // documents, DocumentForListDto'a map edilir.
                var filesToReturn = _appRepository.GetForums().Select(f => new { f.Id, f.UserId, f.Name, f.Category });
                // Yukardaki satırda sadece isim verilerinin getirilmesi sağlanıyor.
                // (Bunun yerine dto kullanılıyor ve mapping işlemi gerçekleştiriliyor.)
                return Ok(filesToReturn);
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        // GET api/forum/detail/?id=5
        [HttpGet]
        [Route("detail")]
        public ActionResult GetForumById(int id)
        {
            var file = _appRepository.GetForumById(id);
            var fileToReturn = _mapper.Map<ForumForDetailDto>(file);
            return Ok(fileToReturn);
        }

        // POST api/forum/forumadd
        [HttpPost]
        [Route("forumadd")]
        public ActionResult Add([FromBody] Forum forum)
        {
            try
            {
                _appRepository.Add(forum);
                _appRepository.SaveAll();
                return Ok(forum);
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}
