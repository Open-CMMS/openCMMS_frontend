import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UserProfile } from 'src/app/models/user-profile';
import { Subscription } from 'rxjs';
import { CrossMatch } from 'src/app/shares/cross-match.validator';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: 'signin.component.html' ,
})
export class SigninComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';

    currentUser: UserProfile;
    currentUserSubscription: Subscription;
    firstUser = false;

    createForm: FormGroup;

    /**
     * Constructor of the SignIn component.
     * @param formBuilder the service used to handle forms.
     * @param router the service used to handle routing.
     * @param authenticationService the auth service.
     * @param userService the service to handle user operations with API.
     */
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService
        ) {
        this.currentUserSubscription = this.authenticationService.currentUserSubject.subscribe(
            (currentUser) => {
                this.currentUser = currentUser;
            }
        );

        this.authenticationService.emitCurrentUser();
        if (this.currentUser) {
            this.router.navigate(['']);
        } else {
            this.authenticationService.is_first_user().subscribe(
                (res) => {
                    this.firstUser = res;
                }
            );
        }
    }

    /**
     * Function that initialises the component.
     */
    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.initForm();
    }

    get f() { return this.loginForm.controls; }

    /**
     * Function that initialize the fields in the form to create a new Team
     */
    initForm() {
        this.createForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(7)]],
        confPassword: ['', Validators.required]
        }, {
        validator: CrossMatch('password', 'confPassword')
        });
    }

    /**
     * Function that submit the login fields to the backend for connection.
     */
    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value).then(() => {
            this.router.navigate(['']);
            this.loading = false;
        })
        .catch( () => {
            this.error = 'Erreur dans la saisie des identifiants';
            this.loading = false;
        });
    }

    /**
     * Function that creates the first user that will be the admin account.
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
                this.userService.createUser(username, formValues.firstName, formValues.lastName, formValues.email, formValues.password)
                .subscribe(
                    (user) => {
                        this.authenticationService.login(username, formValues.password).then(() => {
                            this.router.navigate(['']);
                            this.loading = false;
                            this.userService.getUsers();
                        })
                        .catch( () => {
                            this.error = 'Erreur dans la saisie des identifiants';
                            this.loading = false;
                        });
                    }
                );
            }
        );
        this.router.navigate(['']);
    }
}
