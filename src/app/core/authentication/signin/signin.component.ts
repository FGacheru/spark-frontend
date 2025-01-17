import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, take } from 'rxjs/operators';

import { AuthService, StorageService } from '../../../services'
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  public signinForm!: FormGroup;

  public submitted: Boolean = false;
  public loading: Boolean = false;
  public passwordType: String = 'password';
  public togglePasswordShow: Boolean = true;
  public hasError: Boolean = false;
  public error: String = '';

  constructor(
    private formBuilder: FormBuilder,
    private _route: Router,
    private _authService: AuthService,
    private _storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.signinForm = this.formBuilder.group({
      username: ['', Validators.required, ],
    password: ['', Validators.required],
      remember_me: [],
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.signinForm.controls;
  }
  signIn() {
    this.submitted = true;
    this.hasError = false;
    this.error = '';

    if (this.signinForm.invalid) {
      return;
    }

    this.loading = true;
    this._authService.signIn(this.signinForm.value)
    .pipe(take(1))
    .subscribe(
      () => {
        this.loading = false;
        this.submitted = false;
      },
      (error) => {

        this.loading = false;
        this.submitted = false;
        this.hasError = true;
          
        try{
          this.error = error.error.non_field_errors[0];
        }catch( e : any){
           this.error = 'Oops! You caught us doing some house keeping. Try again after a few minutes. Kindly contact your administrator if issue persists!';
        }
      
      }
    );
  }

  toggleShowPassword() {
    this.togglePasswordShow = !this.togglePasswordShow;
    this.passwordType = this._authService.toggleShowPassword(this.passwordType);
  }

}
