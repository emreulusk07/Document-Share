using DocumentShare.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Data
{
    public interface IAuthRepository
    {
        List<AppIdentityUser> GetUsers();
        int GetUsersCount();
        AppIdentityUser GetUserById(string UserId);
        // password ayrıca alınma sebebi user içinde olmamasıdır.
        Task<AppIdentityUser> Register(AppIdentityUser user, string password);
        Task<AppIdentityUser> Login(string username, string password);
        //Task<bool> UserExist(string username);
        void Delete<T>(T entity) where T : class;
    }
}
