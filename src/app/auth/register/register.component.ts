import {Component, OnDestroy, OnInit} from '@angular/core';
import {finalize, Subject, takeUntil} from "rxjs";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../shared/models/User";
import {AuthService} from "../../shared/services/auth.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit,OnDestroy {

  destroy$:Subject<boolean> = new Subject<boolean>();
  registerForm!:FormGroup;
  submitted:boolean = false;
  isRegistering:boolean = false;
  constructor(private formBuilder: FormBuilder,
              private authService:AuthService,
              private toastr:ToastrService) {

  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    this.initRegisterForm();
  }

  initRegisterForm() {
    this.registerForm = this.formBuilder.group({
      fName:['',Validators.required],
      lName:['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber:['',
        [
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    this.registerForm.controls['confirmPassword'].addValidators(this.createCompareValidator(
      this.registerForm.controls['password'],
      this.registerForm.controls['confirmPassword']
    ))
  }

  createCompareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
    return () => {
      if (controlOne.value !== controlTwo.value)
        return { match_error: 'Value does not match' };
      return null;
    };

  }
  get control(){
    return this.registerForm.controls;
  }

  register(): void{
    this.submitted = true;
    if(this.registerForm.invalid) return;



    const formData = this.registerForm.value;

    const newUser:User = {
      fName: formData.fName,
      lName: formData.lName,
      email:formData.email,
      phoneNumber:formData.phoneNumber,
      password:formData.password
    }
    this.checkUserEmail(newUser);
  }
  checkUserEmail(newUser:User){
    const email = newUser.email;

    this.isRegistering = true;
    this.authService.getUserByEmail(email)
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{this.isRegistering = false;})
      ).subscribe(
      {
        next:(response:Array<User>)=>{
          if(response.length > 0) {
            this.toastr.warning("There is an account with that email address!", "Email address Taken")
            return;
          }
          this.registerUser(newUser)

        },
        error:()=>{
          this.authService.error();
        },
      }
    )
  }

  registerUser(newUser:User){
    this.isRegistering = true;

    this.authService.registerUser(newUser)
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{this.isRegistering = false;})
      ).subscribe({
      next:((user)=>{

        this.toastr.success("Account Created successfully, Login into your new account!","Registration Successful");
        this.submitted = false;
        this.registerForm.reset();
      }),
      error:(()=>{
        this.authService.error();
      }),
    });
  }








}
