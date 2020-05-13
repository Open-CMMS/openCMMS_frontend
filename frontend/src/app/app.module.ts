import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SigninComponent } from './auth/signin/signin.component';
import { AccountBlockedComponent } from './auth/account-blocked/account-blocked.component';
import { HeaderComponent } from './bars/header/header.component';
import { FooterComponent } from './bars/footer/footer.component';
import { HomeComponent } from './tabs/home/home.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { TasksListComponent } from './tabs/tasks/tasks-list/tasks-list.component';
import { TaskDetailsComponent } from './tabs/tasks/task-details/task-details.component';
import { NewTaskComponent } from './tabs/tasks/new-task/new-task.component';
import { TeamManagementComponent } from './tabs/teams/team-management/team-management.component';
import { TeamsListComponent } from './tabs/teams/teams-list/teams-list.component';
import { TeamDetailsComponent } from './tabs/teams/team-details/team-details.component';
import { NewTeamComponent } from './tabs/teams/new-team/new-team.component';
import { TeamTypeManagementComponent } from './tabs/team-types/team-type-management/team-type-management.component';
import { TeamTypesListComponent } from './tabs/team-types/team-types-list/team-types-list.component';
import { TeamTypeDetailsComponent } from './tabs/team-types/team-type-details/team-type-details.component';
import { NewTeamTypeComponent } from './tabs/team-types/new-team-type/new-team-type.component';
import { UserManagementComponent } from './tabs/users/user-management/user-management.component';
import { UsersListComponent } from './tabs/users/users-list/users-list.component';
import { UserDetailsComponent } from './tabs/users/user-details/user-details.component';
import { NewUserComponent } from './tabs/users/new-user/new-user.component';
import { SettingsComponent } from './tabs/settings/settings.component';
import { EquipmentManagementComponent } from './tabs/equipments/equipment-management/equipment-management.component';
import { EquipmentsListComponent } from './tabs/equipments/equipments-list/equipments-list.component';
import { EquipmentDetailsComponent } from './tabs/equipments/equipment-details/equipment-details.component';
import { NewEquipmentComponent } from './tabs/equipments/new-equipment/new-equipment.component';
import { AuthenticationService } from './services/auth/authentication.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { TeamService } from './services/teams/team.service';
import { TeamTypeService } from './services/team-types/team-type.service';
import { UserService } from './services/users/user.service';
import { PermissionService } from './services/permissions/permission.service';
import { EquipmentService } from './services/equipments/equipment.service';
import { TaskService } from './services/tasks/task.service';
import { UtilsService } from './services/utils/utils.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from './services/files/file.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appRoutingModule } from './app-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { JwtInterceptorService } from './services/jwt-interceptor/jwt-interceptor.service';
<<<<<<< HEAD
import { TaskTypeService } from './services/task-types/task-type.service';
import { EquipmentTypeService } from './services/equipment-types/equipment-type.service';
=======
import { EquipmentTypeService } from './services/equipment-types/equipment-type.service';
import { NewEquipmentTypeComponent } from './tabs/equipment-types/new-equipment-type/new-equipment-type.component';
import { EquipmentTypeDetailsComponent } from './tabs/equipment-types/equipment-type-details/equipment-type-details.component';
import { EquipmentTypeManagementComponent } from './tabs/equipment-types/equipment-type-management/equipment-type-management.component';
import { EquipmentTypesListComponent } from './tabs/equipment-types/equipment-types-list/equipment-types-list.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
>>>>>>> dev

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SigninComponent,
    AccountBlockedComponent,
    HomeComponent,
    FourOhFourComponent,
    TasksListComponent,
    TaskDetailsComponent,
    NewTaskComponent,
    TeamManagementComponent,
    TeamsListComponent,
    TeamDetailsComponent,
    NewTeamComponent,
    TeamTypeManagementComponent,
    TeamTypesListComponent,
    TeamTypeDetailsComponent,
    NewTeamTypeComponent,
    UserManagementComponent,
    UsersListComponent,
    UserDetailsComponent,
    NewUserComponent,
    SettingsComponent,
    EquipmentManagementComponent,
    EquipmentsListComponent,
    EquipmentDetailsComponent,
    NewEquipmentComponent,
    NewEquipmentTypeComponent,
    EquipmentTypeDetailsComponent,
    EquipmentTypeManagementComponent,
    EquipmentTypesListComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    appRoutingModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true},
    HttpClientModule,
    AuthenticationService,
    AuthGuardService,
    TeamService,
    TeamTypeService,
    UserService,
    PermissionService,
    TaskService,
    EquipmentService,
    UtilsService,
    TaskTypeService,
    FileService,
    EquipmentTypeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
