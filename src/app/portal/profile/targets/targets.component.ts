import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {TargetService} from "../../../shared/services/target.service";
import {User} from "../../../shared/models/User";
import {AuthService} from "../../../shared/services/auth.service";
import {ITarget} from "../../../shared/models/Target";
import {IProduct} from "../../../shared/models/Product";
import {ProductService} from "../../../shared/services/product.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {SchoolService} from "../../../shared/services/school.service";
import {ISchool} from "../../../shared/models/ISchool";

@Component({
  selector: 'app-targets',
  templateUrl: './targets.component.html',
  styleUrl: './targets.component.scss'
})
export class TargetsComponent implements OnInit,OnDestroy{

  destroy$:Subject<boolean> = new Subject<boolean>();
  targets:ITarget[] = [];
  products:IProduct[] = [];
  userSchools:ISchool[] = [];
  currentUser!:User;
  isShowSetTarget:boolean =false;
  targetForm!:FormGroup;
  isSubmitted:boolean=false;

  constructor(private targetService:TargetService,
              private authService:AuthService,
              private productService:ProductService,
              private schoolService:SchoolService,
              private formBuilder:FormBuilder,
              private toastr:ToastrService) {
  }


  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    this.initTargetForm();
    this.initCurrentUser();
    this.loadProducts();
    this.loadUserSchools();
  }

  initTargetForm(){
    this.targetForm = this.formBuilder.group({
      product:['',Validators.required],
      target:['',[Validators.required,Validators.pattern(/^[0-9]\d*$/)]],
      startDate:['',Validators.required],
      dueDate:['',Validators.required],
    })
  }

  get control(){
    return this.targetForm.controls;
  }

  initCurrentUser(){
    this.authService.currentUser.pipe(takeUntil(this.destroy$)).subscribe({
      next:(currentUser)=>{
        if(currentUser) {
          this.currentUser = currentUser;
          this.loadUserSchools();
        }
      }
    })
  }

  loadUserSchools(){

    this.schoolService.getUserSchools(this.currentUser.id)
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe({
      next:(schools)=>{
        this.userSchools = schools;
        this.loadTargets();
      }
    })
  }

  loadTargets(){
    this.targetService.getUserTargets(this.currentUser.id)
      .pipe(takeUntil(this.destroy$)).
    subscribe({
      error(err: any): void {
      },
      next:(targets)=>{
        this.targets = targets;
        if(this.userSchools.length > 0){
          this.targets.map((target)=>{

              let items = this.userSchools.filter((userSchool)=>userSchool.productId == target.productId).length;
             target.status = Math.round(items/this.userSchools.length *100);
          });
        }


      }
    });
  }

  loadProducts(){
    this.productService.getProducts()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe({
      next:(products)=>{
        this.products = products
      }
    })
  }

  toggleTargetView() {
    this.isShowSetTarget = !this.isShowSetTarget;
  }

  setTarget(){
    this.isSubmitted = true;
    if(this.targetForm.invalid) return;
    const value = this.targetForm.value;


   const target:ITarget = {
     dueDate: value.dueDate,
     productId: value.product,
     startDate: value.startDate,
     target: value.target,
     userId: this.currentUser.id
   }

   this.targetService.setUserTarget(target).pipe(
     takeUntil(this.destroy$),
   ).subscribe({
     next:(response)=>{
       this.loadTargets();
       this.isSubmitted = false;
       this.targetForm.reset();
       this.toastr.success("Target Set Successfully")
     },error:()=>{
       this.authService.error();
     }
   })
  }
}
