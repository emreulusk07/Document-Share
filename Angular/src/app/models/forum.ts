import { CommentToDocument } from "./commentToDocument";
import { LoginUser } from "./loginUser";

export interface Forum {
    id:number;
    userId:number;
    name:string;
    category:string;
    description:string;
    path:string;
    publicId:string;
    createdDate:Date;
    likes:number;
    loginUser:LoginUser;
    commentToDocuments:CommentToDocument[];
}