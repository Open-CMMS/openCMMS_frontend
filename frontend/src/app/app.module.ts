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
import { GroupManagementComponent } from './tabs/groups/group-management/group-management.component';
import { GroupsListComponent } from './tabs/groups/groups-list/groups-list.component';
import { GroupDetailsComponent } from './tabs/groups/group-details/group-details.component';
import { NewGroupComponent } from './tabs/groups/new-group/new-group.component';
import { GroupTypeManagementComponent } from './tabs/group-types/group-type-management/group-type-management.component';
import { GroupTypesListComponent } from './tabs/group-types/group-types-list/group-types-list.component';
import { GroupTypeDetailsComponent } from './tabs/group-types/group-type-details/group-type-details.component';
import { NewGroupTypeComponent } from './tabs/group-types/new-group-type/new-group-type.component';
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
import { GroupService } from './services/groups/group.service';
import { GroupTypeService } from './services/group-types/group-type.service';
import { UserService } from './services/users/user.service';
import { PermissionService } from './services/permissions/permission.service';
import { EquipmentService } from './services/equipments/equipment.service';
import { TaskService } from './services/tasks/task.service';
import { UtilsService } from './services/utils/utils.service';

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
  {path: 'groups', component: GroupManagementComponent},
  {path: 'groups/:id', component: GroupDetailsComponent},
  {path: 'group-types', component: GroupTypeManagementComponent},
  {path: 'group-types/:id', component: GroupTypeDetailsComponent},
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
    GroupManagementComponent,
    GroupsListComponent,
    GroupDetailsComponent,
    NewGroupComponent,
    GroupTypeManagementComponent,
    GroupTypesListComponent,
    GroupTypeDetailsComponent,
    NewGroupTypeComponent,
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
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthenticationService,
    AuthGuardService,
    GroupService,
    GroupTypeService,
    UserService,
    PermissionService,
    TaskService,
    EquipmentService,
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
