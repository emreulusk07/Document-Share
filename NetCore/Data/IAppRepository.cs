using DocumentShare.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Data
{
    public interface IAppRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        bool SaveAll();

        //List<Document> GetDocuments();
        List<FileClass> GetFiles();
        //Document GetDocumentById(int DocumentId); // belli bir dokümanın detayına gidebilmek icin
        int GetFilesCount();
        FileClass GetFileById(int FileId);
        List<FileClass> GetFilteredFiles(string userId);
        List<Forum> GetForums();
        Forum GetForumById(int ForumId);
        List<CommentToDocument> GetCommentToDocumentsById(int DocumentId);
        //List<Offers> GetOffers();
        
        //Offers GetOfferById(int id);
        //Photos GetPhoto(int id);
        //Offers GetWinnerUserById(int BidId);
    }
}
