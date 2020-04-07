import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-dialog-change-password',
  templateUrl: './dialog-change-password.component.html',
  styleUrls: ['./dialog-change-password.component.scss'],
})
export class DialogChangePasswordComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: passwordMatchValidator }
    );
  }

  get password() {
    return this.formGroup.get('password');
  }
  get confirmPassword() {
    return this.formGroup.get('confirmPassword');
  }

  /* Called on each input in either password field */
  onPasswordInput() {
    if (this.formGroup.hasError('passwordMismatch')) {
      this.confirmPassword.setErrors([{ passwordMismatch: true }]);
    } else {
      this.confirmPassword.setErrors(null);
    }
  }

  noErrors() {
    if (
      this.password.invalid ||
      this.password.hasError('required') ||
      this.password.hasError('minLength') ||
      this.confirmPassword.invalid ||
      this.confirmPassword.hasError('required') ||
      this.confirmPassword.hasError('minLength')
    ) {
      return true;
    } else {
      return false;
    }
  }
}

export const passwordMatchValidator: ValidatorFn = (
  formGroup: FormGroup
): ValidationErrors | null => {
  if (
    formGroup.get('password').value === formGroup.get('confirmPassword').value
  ) {
    return null;
  } else return { passwordMismatch: true };
};
