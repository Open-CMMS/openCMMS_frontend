import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfile } from 'src/app/models/user-profile';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})

/**
 * Class for the component in charge of new User creations
 */
export class NewUserComponent implements OnInit {

    // Local variables
    creationError = false;
    submitted = false;
    user: UserProfile;
    // Forms
    createForm: FormGroup;


  /**
   * Constructor for the NewUserComponent
   * @param router the service used to handle redirections
   * @param userService the service to communicate with backend on UserProfile objects
   * @param formBuilder the service to handle forms
   */
  constructor(private router: Router,
              private userService: UserService,
              private formBuilder: FormBuilder
              ) { }

  /**
   * Function that initialize the component when loaded
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Function that initialize the fields in the form to create a new Team
   */
  initForm() {
    this.createForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Function that is triggered when a new Team is being created (when button "Create new team" is pressed)
   */
  onCreateUser() {
    this.submitted = true;

    if (this.createForm.invalid) {
      return;
    }

    const formValues = this.createForm.value;
    let username: string = formValues.firstName[0].toLowerCase() + formValues.lastName.toLowerCase();
    this.userService.getUsernameSuffix(username)
        .subscribe((suffix) => {
          username = username + suffix;
          this.userService.createUser(username, formValues.firstName, formValues.lastName, formValues.email, 'uselessTemporaryPassword')
          .subscribe(
            (user: UserProfile) => {
              // this.user = this.user = new UserProfile(user.id,
              //                                         user.username,
              //                                         user.first_name,
              //                                         user.last_name,
              //                                         user.email,
              //                                         user.password,
              //                                         user.nb_tries,
              //                                         user.is_active);
              this.userService.getUsers();
        });
          this.router.navigate(['/users']);
      }
    );
  }


}
