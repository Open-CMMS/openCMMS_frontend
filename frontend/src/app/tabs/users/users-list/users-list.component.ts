import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserProfile } from '../../../models/user-profile';
import { Router } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {
  faTrash = faTrash;

  users: UserProfile[] = [];
  usersSubscription: Subscription;

  constructor(private userService: UserService, private router: Router ) { }

  ngOnInit(): void {
    this.userService.getUsers()
    .subscribe(
      (response) => {
        response.forEach(element => {
          const user = new UserProfile(element.id, element.last_name, element.first_name,
                                element.username, element.email, element.password,
                                element.nb_tries, element.is_active);
          this.users.push(user);
        });
        this.userService.emitUsers();
      },
      (error) => {
        console.log('Erreur ! :' + error);
      }
    );

    this.usersSubscription = this.userService.usersSubject.subscribe(
      (us: UserProfile[]) => {
        this.users = us;
      }
    );
    this.userService.emitUsers();
  }

  onViewUser(user: UserProfile) {
    this.router.navigate(['/users', user.id]);
  }

  onDeleteUser(user: UserProfile) {
    this.userService.deleteUser(user.id);
    this.router.navigate(['/users']);
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

}
