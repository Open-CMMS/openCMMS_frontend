import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { UserProfile } from 'src/app/models/user-profile';
import { Subscription } from 'rxjs';

@Component({ templateUrl: 'signin.component.html' })
export class SigninComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';

    currentUser: UserProfile;
    currentUserSubscription: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService
        ) {
        this.currentUserSubscription = this.authenticationService.currentUserSubject.subscribe(
            (currentUser) => {
                this.currentUser = currentUser;
            }
        );

        this.authenticationService.emitCurrentUser();
        if (this.currentUser) {
            this.router.navigate(['']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    get f() { return this.loginForm.controls; }

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
}
