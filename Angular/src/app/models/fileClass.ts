import { CommentToDocument } from "./commentToDocument";

export interface FileClass {
    [x: string]: any;
    id:number;
    userId:string;
    name:string;
    path:string;
    contentType:string;
    category:string;
    length:number;
    likes:number;
    downloadCount:number;
    adminConfirmed:boolean;
    myFile:File;
    commentToDocuments:CommentToDocument[];
}