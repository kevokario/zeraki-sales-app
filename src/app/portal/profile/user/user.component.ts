import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/models/User";
import {finalize, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit,OnDestroy{

  currentUser!:User;
  destroy$:Subject<boolean> = new Subject<boolean>();
  editProfile:boolean=false;
  isSubmitted = false;
  isSubmitting = false;
  profileForm!:FormGroup;


  constructor(private authService: AuthService,
              private formBuilder:FormBuilder,
  private toastr:ToastrService) {
  }

  ngOnInit() {
    this.initCurrentUser();
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  initCurrentUser() {
    this.authService.currentUser.pipe(takeUntil(this.destroy$)).subscribe({
      next:(currentUser)=>{
        if(currentUser) this.currentUser = currentUser;
      }
    })
  }

  initEdit() {
    this.editProfile = true;
    this.initProfileForm();
  }

  get control() {
    return this.profileForm.controls;
  }


  initProfileForm(){
    this.profileForm = this.formBuilder.group({
      fName:[this.currentUser?.fName, [Validators.required]],
      lName:[this.currentUser?.lName, [Validators.required]],
      email:[this.currentUser?.email,[
        Validators.email,
        Validators.required]],
      phoneNumber:[this.currentUser?.phoneNumber,[
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]\d*$/)]
      ]
    });
  }



  updateProfile(){

    this.isSubmitted = true;
    if(this.profileForm.invalid) return;

    //get user by email and check user not duplicate
    const user = this.profileForm.value;
    user.id = this.currentUser?.id;
    this.isSubmitting = true;

    this.authService.checkEmailExitsForUser(user.email, user.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{this.isSubmitting = false})
      )
      .subscribe({
        next:((users)=>{
          console.log(users);
          if(users.length == 0){
            //update user
            this.updateUser(user);
          } else {
            this.authService.error("That Email has been taken, use another one","Email already registered");
          }
        })
      })
  }



  updateUser(user:User){
    this.isSubmitting = true;
    this.authService.updateUser(user)
      .pipe(
        takeUntil(this.destroy$),
        finalize(()=>{this.isSubmitting = false})
      )
      .subscribe({
        next:((users)=> {
          //update user
          const token = localStorage.getItem(environment.userToken);
          if(token) {
            const userObject:User = JSON.parse(token);
            userObject.fName = user.fName;
            userObject.lName = user.lName;
            userObject.email = user.email;
            userObject.phoneNumber = user.phoneNumber;

            const newToken = JSON.stringify(userObject);
            this.authService.setCurrentUser(user)

            localStorage.setItem(environment.userToken,newToken);
            this.toastr.success("Profile updated successfully!");
            this.editProfile = false;
            this.currentUser = user;
          }
        })
      })
  }
}
