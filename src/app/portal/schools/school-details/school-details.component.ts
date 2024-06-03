import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {ISchool} from "../../../shared/models/ISchool";
import {SchoolService} from "../../../shared/services/school.service";
import {Invoice} from "../../../shared/models/Invoice";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../../shared/services/product.service";
import {IProduct} from "../../../shared/models/Product";
import {User} from "../../../shared/models/User";
import {AuthService} from "../../../shared/services/auth.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-school-details',
  templateUrl: './school-details.component.html',
  styleUrl: './school-details.component.scss'
})
export class SchoolDetailsComponent implements OnInit,OnDestroy {

  destroy$:Subject<boolean> = new Subject<boolean>();
  school!:ISchool;
  schoolInvoices:Invoice[] = [];
  products:IProduct[] = [];
  currentUser!:User;
  pathParam!:Params;
  schoolBalance:number = 0;

  isShowInvoiceList:boolean = true;

  invoiceForm!:FormGroup;
  isSubmitted:boolean = false;

  constructor(private activatedRoute:ActivatedRoute,
              private schoolService: SchoolService,
              private productService:ProductService,
              private authService:AuthService,
              private toastr:ToastrService,
              private formBuilder:FormBuilder) {
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    this.initCurrentUser();
    this.initForm();
    this.initSchool();
    this.initProducts();
  }

  initCurrentUser(){
    this.authService.currentUser.pipe(takeUntil(this.destroy$)).subscribe({
      next:(currentUser)=>{
        if(currentUser) this.currentUser = currentUser;
      }
    })
  }

  initForm(){
    this.invoiceForm = this.formBuilder.group({
      product:['',Validators.required],
      creationDate:['',Validators.required],
      dueDate:['',Validators.required],
      amount:['',[Validators.required,Validators.pattern(/^[0-9]\d*$/)]],
    });
  }

  get control(){
    return this.invoiceForm.controls;
  }

  addInvoice(){
    this.isSubmitted = true;
    if(this.invoiceForm.invalid) return;
    const data = this.invoiceForm.value;

    const invoice:Invoice = {
      completionStatus: "in-complete",
      creationDate: data.creationDate,
      dueDate: data.dueDate,
      invoiceAmount: data.amount,
      paidAmount: 0,
      productId: data.product,
      schoolId: this.school.id,
      userId: this.currentUser.id
    };

    this.schoolService.createInvoice(invoice).pipe(takeUntil(this.destroy$)).subscribe({
      next:(response)=>{
        this.toastr.success("Invoice successfully created!");
        this.initSchool();
        this.loadSchoolInvoices(this.pathParam['id']);
        this.invoiceForm.reset();
        this.toggleShowInvoiceList();
      }
    })
  }

  initSchool(){

    this.pathParam = this.activatedRoute.snapshot.params;
    const schoolId = this.pathParam['id'];
    this.loadSchoolInvoices(schoolId);
    this.schoolService.getSchool(schoolId).pipe(takeUntil(this.destroy$)).subscribe({
      next:(school)=>{
        this.school = school;
      }
    })
  }

  loadSchoolInvoices(schoolId:number){
    this.schoolService.getInvoices(schoolId).pipe(takeUntil(this.destroy$)).subscribe({
      next:(invoices)=>{
        this.schoolInvoices = invoices;
        let balance = 0;
        this.schoolInvoices.forEach((schoolInvoice)=>{
          balance = balance + Number(schoolInvoice.invoiceAmount) - Number(schoolInvoice.paidAmount);
        });

        this.schoolBalance = balance;
      }
    })
  }

  initProducts(){
    this.productService.getProducts()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe({
      next:(products)=>{
        this.products = products
      }
    })
  }

  dateDifference(startDate:string, dueDate:string):number{
    let startDateArray = startDate.split("-").reverse();
    let dueDateArray = dueDate.split("-").reverse();
    let startDateAsNumber = parseInt(startDateArray.reverse().join(''));
    let dueDateAsNumber = parseInt(dueDateArray.reverse().join(''));
    let days =  dueDateAsNumber - startDateAsNumber;
    return days;
  }

  invoiceStatus(invoiceAmount:number, paidAmount:number){
    return invoiceAmount - paidAmount > 0 ? 'In-complete' : 'complete';
  }

  toggleShowInvoiceList() {
    this.isShowInvoiceList = !this.isShowInvoiceList;
  }
}
