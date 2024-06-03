import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, forkJoin, Observable, Subject, takeUntil} from "rxjs";
import {ICounty, ISchool} from "../../../shared/models/ISchool";
import {Router} from "@angular/router";
import {SchoolService} from "../../../shared/services/school.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IProduct} from "../../../shared/models/Product";
import {ProductService} from "../../../shared/services/product.service";
import {ISchoolType} from "../../../shared/models/SchoolType";
import {User} from "../../../shared/models/User";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrl: './school-list.component.scss'
})
export class SchoolListComponent implements OnInit,OnDestroy {

  isShowSchoolList:boolean = true;
  destroy$:Subject<boolean> = new Subject<boolean>();

  schools:ISchool[] = [];
  counties:ICounty[] = [];
  products:IProduct[] = [];
  schoolTypes:ISchoolType[] = [];
  currentUser!:User;
  schoolForm!:FormGroup;
  isSubmitted:boolean = false;

  constructor(private schoolService:SchoolService,
              private formBuilder: FormBuilder,
              private productService:ProductService,
              private authService:AuthService) {}

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    this.initCurrentUser();
    this.initSchoolForm();
    this.loadCountiesAndProducts();
    this.loadSchools();
  }

  initCurrentUser(){
    this.authService.currentUser.pipe(takeUntil(this.destroy$)).subscribe({
      next:(currentUser)=>{
        if(currentUser) this.currentUser = currentUser;
      }
    })
  }

  loadSchools(){
    this.schoolService.getSchools(1).pipe(takeUntil(this.destroy$)).subscribe({
      next:(schools)=>{
        this.schools = schools;
      }
    })
  }

  loadCountiesAndProducts(){
    const counties$ = this.schoolService.getCounties();
    const products$ = this.productService.getProducts();
    const schoolTypes$ = this.schoolService.getSchoolTypes();

    forkJoin([
      counties$,products$,schoolTypes$
    ]).pipe(takeUntil(this.destroy$)).subscribe({
      next:(response:[ICounty[], IProduct[], ISchoolType[] ])=>{
        this.counties = response[0];
        this.products = response[1];
        this.schoolTypes = response[2];
      }
    })
  }

  initSchoolForm(){
    this.schoolForm = this.formBuilder.group({
      schoolType:['',Validators.required],
      name:['',Validators.required],
      county:['',Validators.required],
      signupDate:['',Validators.required],
      contactPerson:['',Validators.required],
      contactPhone:['',[Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
        Validators.minLength(10),
        Validators.maxLength(10)]],
      products:['',[Validators.required]],
    });
  }

  get control(){
    return this.schoolForm.controls
  }

  signUpSchool(){
    this.isSubmitted = true;
    if(this.schoolForm.invalid) return;
    const formData = this.schoolForm.value;


    const school:ISchool = {
      contactPerson: formData.contactPerson,
      contactPhone: formData.contactPhone,
      countyId: formData.county,
      name: formData.name,
      productId: Number(formData.products),
      registrationDate: formData.signupDate,
      schoolTypeId: formData.schoolType,
      userId:this.currentUser.id
    }

    this.schoolService.addSchool(school).pipe(takeUntil(this.destroy$)).subscribe({
      next:(response)=>{
        this.isSubmitted = false;
        this.schoolForm.reset();
        this.loadSchools();
      },
      error:()=>this.authService.error()
    })
  }

  toggleSchoolList(){
    this.isShowSchoolList = !this.isShowSchoolList;
  }


}
