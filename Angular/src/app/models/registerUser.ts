import { Forum } from "./forum";
import { CommentToDocument } from "./commentToDocument";
//import { UserFollow } from "./userFollow";

export interface RegisterUser {
    id:string;
    userName:string;
    password:string;
    email:string;
    forum:Forum[];
    commentToDocuments:CommentToDocument[];
    //userFollows:UserFollows[];
}