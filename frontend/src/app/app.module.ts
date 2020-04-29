import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AccountBlockedComponent } from './auth/account-blocked/account-blocked.component';
import { WelcomeFirstConnectionComponent } from './auth/welcome-first-connection/welcome-first-connection.component';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'sign-in', component: SigninComponent},
  {path: 'sign-up', component: SignupComponent},
  {path: 'account-blocked', component: AccountBlockedComponent},
  {path: 'first-connection', component: WelcomeFirstConnectionComponent},
  {path: 'first-connection/sign-up', component: SignupComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'infos', component: UserDetailsComponent},
  {path: 'tasks/:id', component: TaskDetailsComponent},
  {path: 'teams', component: TeamManagementComponent},
  {path: 'teams/:id', component: TeamDetailsComponent},
  {path: 'new-team', component: NewTeamComponent},
  {path: 'team-types', component: TeamTypeManagementComponent},
  {path: 'team-types/:id', component: TeamTypeDetailsComponent},
  {path: 'users', component: UserManagementComponent},
  {path: 'users/:id', component: UserDetailsComponent},
  {path: 'equipments', component: EquipmentManagementComponent},
  {path: 'equipments/:id', component: EquipmentDetailsComponent},
  {path: '**', component: FourOhFourComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    WelcomeFirstConnectionComponent,
    SigninComponent,
    SignupComponent,
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
    NewEquipmentComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NgbModule
  ],
  providers: [
    HttpClientModule,
    AuthenticationService,
    AuthGuardService,
    TeamService,
    TeamTypeService,
    UserService,
    PermissionService,
    TaskService,
    EquipmentService,
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
