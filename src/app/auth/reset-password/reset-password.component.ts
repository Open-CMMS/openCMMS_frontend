import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CrossMatch } from 'src/app/shares/cross-match.validator';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
/**
 * Component ResetPasswordComponent
 * This component is used when a user has to set or reset his password
 */
export class ResetPasswordComponent implements OnInit {

  // Local variables
  creationError = false;
  submitted = false;
  username: string = null;
  token: string = null;

  // Form
  setPasswordForm: FormGroup;

  /**
   * Constructor of ResetPasswordComponent
   * @param formBuilder the service used to handle forms
   * @param authenticationService the auth service
   * @param router the service used to handle routing
   * @param route the service used to get route information
   */
  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute) { }

  /**
   * Function that initializes the component
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.username = params.username;
        this.token = params.token;
      }
    );

    if (this.username && this.token) {
      this.authenticationService.verifyToken(this.username, this.token).subscribe(
        res => {
          if (!res) {
            this.router.navigate(['']);
          }
        }
      );
    } else {
      this.router.navigate(['']);
    }

    this.initForm();
  }

  /**
   * Function that initialize the fields in the form to create a new Team
   */
  initForm() {
    this.setPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(7)]],
      confPassword: ['', Validators.required]
    }, {
      validator: CrossMatch('password', 'confPassword')
    });
  }

  /**
   * Function that call the set_password function in the API on click on the Set password button
   */
  onSetPassword() {
    this.submitted = true;

    if (this.setPasswordForm.invalid) {
      return;
    }

    const formValues = this.setPasswordForm.value;
    this.authenticationService.setPassword(this.username, formValues.password, this.token).subscribe(
      (res) => {
        this.router.navigate(['sign-in']);
      }
    );
  }

}
