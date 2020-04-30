import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './tabs/home/home.component';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { WelcomeFirstConnectionComponent } from './auth/welcome-first-connection/welcome-first-connection.component';
import { UserDetailsComponent } from './tabs/users/user-details/user-details.component';
import { TeamTypeDetailsComponent } from './tabs/team-types/team-type-details/team-type-details.component';
import { TeamTypesListComponent } from './tabs/team-types/team-types-list/team-types-list.component';
import { TeamTypeManagementComponent } from './tabs/team-types/team-type-management/team-type-management.component';
import { TeamDetailsComponent } from './tabs/teams/team-details/team-details.component';



const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'sign-in', component: SigninComponent
  },
  {
    path: 'sign-up', component: SignupComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'first-connection', component: WelcomeFirstConnectionComponent
  },
  {
    path: 'first-connection/sign-up', component: SignupComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'infos', component: UserDetailsComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin'] }
  },
  {
    path: 'group-types', component: TeamTypeManagementComponent,
    canActivate: [AuthGuardService],
    data: { roles: ['admin', 'user'] }
  },
  {
    path: 'groups/:id', component: TeamDetailsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'group-types/:id', component: TeamTypeDetailsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'users/:id', component: UserDetailsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '**', redirectTo: '',
    canActivate: [AuthGuardService]
  }
  ];

export const AppRoutingModule = RouterModule.forRoot(appRoutes);
