import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({ templateUrl: 'signin.component.html' })
export class SigninComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService
        ) {
        if (this.authenticationService.getCurrentUser()) {
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
        // if (this.authenticationService.login(this.f.username.value, this.f.password.value)) {
        //     this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
        //     console.log(this.route.snapshot.queryParams['returnUrl']);
        //     this.loading = false;
        //     this.router.navigateByUrl(this.returnUrl);
        this.authenticationService.login(this.f.username.value, this.f.password.value).then(() => {
            this.router.navigate(['']);
            this.loading = false;
        })
        .catch( () => {
            this.error = 'Erreur dans la saisie des identifiants';
            this.loading = false;
        });

        // } else {
        //     this.loading = false;
        //     this.error = "Erreur dans la saisie des identifiants"
        // }
    }
}