import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DocumentComponent } from './document/document.component';
import { NavComponent } from './nav/nav.component';
import { FileAddComponent } from './file/fileAdd/fileAdd.component';
import { DocumentDetailComponent } from './document/document-detail/document-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentSearchPipe } from './document/document-search.pipe';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { UserSearchPipe } from './user/user-search.pipe';
import { FileComponent } from './file/file.component';
import { FileSearchPipe } from './file/file-search.pipe';
import { FileDetailComponent } from './file/file-detail/file-detail.component';
import { AdminComponent } from './admin/admin.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { ForumComponent } from './forum/forum.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSettingsComponent } from "./user/user-settings/user-settings.component";
import { AboutComponent } from './about/about.component';
import { UserProfileForDocumentComponent } from './file/user-profile-for-document/user-profile-for-document.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SendChangePasswordComponent } from './change-password/send-change-password/send-change-password.component';

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    DocumentComponent,
    NavComponent,
    FileAddComponent,
    DocumentDetailComponent,
    DocumentSearchPipe,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    UserSearchPipe,
    FileComponent,
    FileSearchPipe,
    FileDetailComponent,
    AdminComponent,
    ForbiddenComponent,
    ForumComponent,
    UserProfileComponent,
    UserSettingsComponent,
    AboutComponent,
    UserProfileForDocumentComponent,
    ChangePasswordComponent,
    SendChangePasswordComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:7623"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
