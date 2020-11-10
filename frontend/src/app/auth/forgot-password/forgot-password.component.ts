import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) { }

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

  onSubmit() {
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }
  }

  canValidateForm() {
    console.log('can validate form');
    console.log(this.forgotPasswordForm.controls.email);
    return this.forgotPasswordForm.controls.email.value === '' && this.forgotPasswordForm.controls.username.value === '';
  }
}
