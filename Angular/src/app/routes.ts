import { Routes } from "@angular/router";
import { AboutComponent } from "./about/about.component";
import { AdminComponent } from "./admin/admin.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { SendChangePasswordComponent } from "./change-password/send-change-password/send-change-password.component";
import { DocumentDetailComponent } from "./document/document-detail/document-detail.component";
import { DocumentComponent } from "./document/document.component";
import { FileDetailComponent } from "./file/file-detail/file-detail.component";
import { FileComponent } from "./file/file.component";
import { FileAddComponent } from "./file/fileAdd/fileAdd.component";
import { UserProfileForDocumentComponent } from "./file/user-profile-for-document/user-profile-for-document.component";
import { ForbiddenComponent } from "./forbidden/forbidden.component";
import { ForumComponent } from "./forum/forum.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AuthService } from "./services/auth.service";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { UserSettingsComponent } from "./user/user-settings/user-settings.component";
import { UserComponent } from "./user/user.component";

export const appRoutes : Routes = [
    {path:"document", component:DocumentComponent},
    {path:"documentDetail/:documentId", component:DocumentDetailComponent},
    {path:"file", component:FileComponent},
    {path:"fileAdd", component:FileAddComponent, canActivate: [AuthService]}, //kimlik doğrulaması gerektirir.
    {path:"fileDetail/:fileId", component:FileDetailComponent},
    {path:"userProfileForDocument/:userId", component:UserProfileForDocumentComponent},
    {path:"forum", component:ForumComponent},
    {path:"userProfile", component:UserProfileComponent},
    {path:"register", component:RegisterComponent},
    {path:"login", component:LoginComponent},
    {path:"user", component:UserComponent},
    {path:"changePassword", component:ChangePasswordComponent},
    {path:"sendChangePassword", component:SendChangePasswordComponent},
    {path:"admin", component:AdminComponent, canActivate: [AuthService], data: {permittedRoles:['Admin']}},
    {path:"forbidden", component:ForbiddenComponent},
    {path:"about", component:AboutComponent},
    {path:"**", redirectTo:"file", pathMatch:"full"}
];