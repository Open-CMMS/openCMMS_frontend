import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './tabs/home/home.component';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { SigninComponent } from './auth/signin/signin.component';
import { UserDetailsComponent } from './tabs/users/user-details/user-details.component';
import { TeamTypeDetailsComponent } from './tabs/team-types/team-type-details/team-type-details.component';
import { TeamTypeManagementComponent } from './tabs/team-types/team-type-management/team-type-management.component';
import { TeamDetailsComponent } from './tabs/teams/team-details/team-details.component';
import { AccountBlockedComponent } from './auth/account-blocked/account-blocked.component';
import { SettingsComponent } from './tabs/settings/settings.component';
import { TaskDetailsComponent } from './tabs/tasks/task-details/task-details.component';
import { TeamManagementComponent } from './tabs/teams/team-management/team-management.component';
import { NewTeamComponent } from './tabs/teams/new-team/new-team.component';
import { UserManagementComponent } from './tabs/users/user-management/user-management.component';
import { EquipmentManagementComponent } from './tabs/equipments/equipment-management/equipment-management.component';
import { EquipmentDetailsComponent } from './tabs/equipments/equipment-details/equipment-details.component';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { NewTeamTypeComponent } from './tabs/team-types/new-team-type/new-team-type.component';
import { NewTaskComponent } from './tabs/tasks/new-task/new-task.component';
import { NewUserComponent } from './tabs/users/new-user/new-user.component';
import { NewEquipmentComponent } from './tabs/equipments/new-equipment/new-equipment.component';
import { TasksListComponent } from './tabs/tasks/tasks-list/tasks-list.component';
import { TemplatesListComponent } from './tabs/templates/templates-list/templates-list.component';
import { EquipmentTypeManagementComponent } from './tabs/equipment-types/equipment-type-management/equipment-type-management.component';
import { EquipmentTypeDetailsComponent } from './tabs/equipment-types/equipment-type-details/equipment-type-details.component';
import { NewEquipmentTypeComponent } from './tabs/equipment-types/new-equipment-type/new-equipment-type.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { NewTemplateComponent } from './tabs/templates/new-template/new-template.component';
import { DataProviderManagementComponent } from './tabs/data-providers/data-provider-management/data-provider-management.component';
import { DataProviderDetailsComponent } from './tabs/data-providers/data-provider-details/data-provider-details.component';
import { NewDataProviderComponent } from './tabs/data-providers/new-data-provider/new-data-provider.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';

/**
 * List of the routes for the application and their associated permissions.
 */
const appRoutes: Routes = [
  {
    path: 'sign-in', component: SigninComponent,
    data: {
      requiredPerms: []
    }
  },
  {
    path: 'account-blocked', component: AccountBlockedComponent,
    data: {
      requiredPerms: []
    }
  },
  {
    path: '', redirectTo: 'tasks', pathMatch: 'full',
    data: {
      requiredPerms: []
    }
  },
  {
    path: 'reset-password', component: ResetPasswordComponent,
    data: {
      requiredPerms: []
    }
  },
  {
    path: 'forgot-password', component: ForgotPasswordComponent,
    data: {
      requiredPerms: []
    }
  },
  {
    path: '', component: HomeComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: []
    }
  },
  {
    path: 'settings', component: SettingsComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['add_userprofile']
    }
  },
  {
    path: 'infos', component: UserDetailsComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: []
    }
  },
  {
    path: 'tasks', component: TasksListComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: []
    }
  },
  {
    path: 'template-management', component: TemplatesListComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['add_task']
    }
  },
  {
    path: 'new-template', component: NewTemplateComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['add_task']
    }
  },
  {
    path: 'tasks-management', component: TasksListComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['add_task']
    }
  },
  {
    path: 'tasks/:id', component: TaskDetailsComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: []
    }
  },
  {
    path: 'new-task', component: NewTaskComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['add_task']
    }
  },
  {
    path: 'teams', component: TeamManagementComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['change_team']
    }
  },
  {
    path: 'teams/:id', component: TeamDetailsComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['view_team']
    }
  },
  {
    path: 'new-team', component: NewTeamComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['add_team']
    }
  },
  {
    path: 'team-types', component: TeamTypeManagementComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['change_teamtype']
    }
  },
  {
    path: 'team-types/:id', component: TeamTypeDetailsComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['view_teamtype']
    }
  },
  {
    path: 'new-team-type', component: NewTeamTypeComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['add_teamtype']
    }
  },
  {
    path: 'users', component: UserManagementComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['change_userprofile']
    }
  },
  {
    path: 'users/:id', component: UserDetailsComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['view_userprofile']
    }
  },
  {
    path: 'new-user', component: NewUserComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['add_userprofile']
    }
  },
  {
    path: 'equipments', component: EquipmentManagementComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['change_equipment']
    }
  },
  {
    path: 'equipments/:id', component: EquipmentDetailsComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['view_equipment']
    }
  },
  {
    path: 'new-equipment', component: NewEquipmentComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['add_equipment']
    }
  },
  {
    path: 'equipment-types', component: EquipmentTypeManagementComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['change_equipmenttype']
    }
  },
  {
    path: 'equipment-types/:id', component: EquipmentTypeDetailsComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['view_equipmenttype']
    }
  },
  {
    path: 'new-equipment-type', component: NewEquipmentTypeComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['add_equipmenttype']
    }
  },
  {
    path: 'data-providers', component: DataProviderManagementComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['change_dataprovider']
    }
  },
  {
    path: 'data-providers/:id', component: DataProviderDetailsComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['view_dataprovider']
    }
  },
  { path: 'new-data-provider', component: NewDataProviderComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: ['add_dataprovider']
    }
  },
  {
    path: '**', component: FourOhFourComponent,
    canActivate: [AuthGuardService],
    data: {
      requiredPerms: []
    }
  }
];

export const appRoutingModule = RouterModule.forRoot(appRoutes);
