using DocumentShare.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Data
{
    public class AuthRepository : IAuthRepository
    {
        private AppIdentityDbContext _context;
        private UserManager<AppIdentityUser> _userManager;

        public AuthRepository(AppIdentityDbContext context, UserManager<AppIdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public List<AppIdentityUser> GetUsers()
        {
            var users = _userManager.Users.ToList();
            return users;
        }

        public int GetUsersCount()
        {
            var usersCount = _userManager.Users.ToList().Count;
            return usersCount;
        }

        public AppIdentityUser GetUserById(string UserId)
        {
            var file = _userManager.Users.FirstOrDefault(f => f.Id == UserId);
            return file;
        }

        public async Task<AppIdentityUser> Register(AppIdentityUser user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            //user.PasswordHash = passwordHash;
            //user.PasswordSalt = passwordSalt;
            //await _context.Users.AddAsync(user);
            //await _context.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<AppIdentityUser> Login(string username, string password)
        {
            // asenkron olmasaydı:
            //var user = _context.Users.Where(x => x.Username == username).FirstOrDefault();
            //var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username);
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return null;
            }

            /*
            // kullanıcı varsa aşağıdaki metotla hashlenmiş şifreler kıyaslanır.
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }
            */

            return user;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                    {
                        return false;
                    }
                }
                return true;
            }
        }

        /*public async Task<bool> UserExist(string username)
        {
            if (await _context.Users.AnyAsync(x => x.Username == username))
            {
                return true;
            }
            return false;
        }*/
    }
}
