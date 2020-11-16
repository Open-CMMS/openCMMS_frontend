import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  // Local variables
  submitted = false;

  // Form
  forgotPasswordForm: FormGroup;

  /**
   * Constructor of ForgotPassword
   * @param formBuilder the service to handle forms
   * @param authenticationService the service to handle authentication
   * @param router the service used to handle routing
   */
  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private router: Router) { }

  /**
   * Function that initializes the component
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Function that initialize the fields in the form
   */
  initForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.email]],
      username: ['', []]
    });
  }

  /**
   * Function that call the forgot_password function in the API on click on the Send email button
   */
  onSubmit() {
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    if (this.forgotPasswordForm.value.email !== '' && this.forgotPasswordForm.value.username !== '' ) {
      this.authenticationService.forgotPassword(this.forgotPasswordForm.value.email, this.forgotPasswordForm.value.username).subscribe(
        (res) => {
          this.router.navigate(['sign-in']);
        }
      );
    } else {
      if (this.forgotPasswordForm.value.email !== '') {
        this.authenticationService.forgotPassword_email(this.forgotPasswordForm.value.email).subscribe(
          (res) => {
            this.router.navigate(['sign-in']);
          }
        );
      } else {
        if (this.forgotPasswordForm.value.username !== '') {
          this.authenticationService.forgotPassword_username(this.forgotPasswordForm.value.username).subscribe(
            (res) => {
              this.router.navigate(['sign-in']);
            }
          );
        }
      }
    }
  }

  /**
   * Function that verify that the form can be validate (either the email or the username should be entered)
   */
  canValidateForm() {
    return this.forgotPasswordForm.value.email === '' && this.forgotPasswordForm.value.username === '';
  }
}
