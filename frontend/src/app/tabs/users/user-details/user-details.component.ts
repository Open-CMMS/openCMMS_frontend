import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup} from '@angular/forms';
import { UserProfile } from 'src/app/models/user-profile';
import { UserService } from 'src/app/services/users/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  // Font awesome logos
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;

// Local variables
  loaded = false;
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user: UserProfile;

  userUpdateForm: FormGroup;

  constructor(private router: Router,
              private userService: UserService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe(params => {
      this.id = +params.id;
    });
    this.userService.getUser(this.id)
      .subscribe(
        (user: any) => {
          this.username = user.username;
          this.first_name = user.first_name;
          this.last_name = user.last_name;
          this.email = user.email;
          this.user = new UserProfile(user.id,
                                      user.last_name,
                                      user.first_name,
                                      user.username,
                                      user.email,
                                      user.password,
                                      user.nb_tries,
                                      user.is_active);
          this.loaded = true;
        },
        (error) => {
          this.router.navigate(['/four-oh-four']);
        }
      );
  }

  initForm(): void {
    this.userUpdateForm = this.formBuilder.group({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
    });
  }

  onDeleteTeam() {
    this.userService.deleteUser(this.id).subscribe(
      (resp) => {
        this.userService.getUsers();
        this.router.navigate(['/users']);
      }
    );
  }

  openDelete(content) {
  }

  openModify(content) {
  }



}
