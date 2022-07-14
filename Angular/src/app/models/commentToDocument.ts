import { FileClass } from "./fileClass";
import { LoginUser } from "./loginUser";

export interface CommentToDocument {
    id:number;
    userId:string;
    fileId:number;
    commentMessage:string;
    loginUser:LoginUser;
    //file:FileClass;
}