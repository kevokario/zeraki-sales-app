import {Component, OnDestroy, OnInit} from '@angular/core';
import {finalize, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/models/User";
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit,OnDestroy {

  destroy$:Subject<boolean> = new Subject<boolean>();
  loginForm!:FormGroup;
  submitted:boolean = false;
  isSubmitting:boolean = false;
  constructor(private formBuilder: FormBuilder,
              private authService:AuthService,
              private toastr:ToastrService,
              private router:Router) {

  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get control(){
    return this.loginForm.controls;
  }

  login(): void{
    this.submitted = true;
    if(this.loginForm.invalid) return;

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.isSubmitting = true;

    this.authService.loginUser(email,password)
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{this.isSubmitting = false})
      )
      .subscribe({
        next:((users:Array<User>)=>{
          //No user found
          if(users.length== 0){
            this.toastr.warning("Invalid username or password", "Invalid Credentials")
            return;
          }

          //user found
          const user:User = users[0];

          //remove password
          delete user.password;

          //make token
          const token = JSON.stringify(user);


          //store in localStorage
          localStorage.setItem(environment.userToken,token);

          //update user observable
          this.authService.setCurrentUser(user);

          //redirect to portal
          this.router.navigate(['/home'])


        }),
        error:(()=>{this.authService.error();}),
      })

  }





}
