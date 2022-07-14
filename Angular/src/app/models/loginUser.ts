import { Forum } from "./forum";
import { CommentToDocument } from "./commentToDocument";
//import { UserFollow } from "./userFollow";

export interface LoginUser {
    id:string;
    userName:string;
    password:string;
    forum:Forum[];
    commentToDocuments:CommentToDocument[];
    //userFollows:UserFollows[];
}