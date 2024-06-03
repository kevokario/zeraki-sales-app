import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {SchoolService} from "../../../shared/services/school.service";
import {Collection, Invoice} from "../../../shared/models/Invoice";
import {ActivatedRoute, Params} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/models/User";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-invoice-collections',
  templateUrl: './invoice-collections.component.html',
  styleUrl: './invoice-collections.component.scss'
})
export class InvoiceCollectionsComponent implements OnInit, OnDestroy {

  invoice!:Invoice;
  pathParams!:Params;
  isShowCollectionList:boolean=true;
  currentUser!:User;

  collectionForm!:FormGroup;
  isSubmitted:boolean = false;

  constructor(private schoolService:SchoolService,
              private activatedRoute:ActivatedRoute,
              private formBuilder:FormBuilder,
              private toastr:ToastrService,
              private authService:AuthService) {
  }

  destroy$:Subject<boolean> = new Subject<boolean>();
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    this.initCurrentUser()
    this.initInvoice();
    this.initCollectionForm();
  }

  initCurrentUser(){
    this.authService.currentUser.pipe(takeUntil(this.destroy$)).subscribe({
      next:(currentUser)=>{
        if(currentUser) this.currentUser = currentUser;
      }
    })
  }

  initInvoice(){
    this.pathParams = this.activatedRoute.snapshot.params;
    const invoiceId = this.pathParams['invoiceId'];
    this.schoolService.getInvoice(invoiceId).pipe(takeUntil(this.destroy$)).subscribe({
      next:(invoice:Invoice)=>{
        this.invoice = invoice;
        this.loadCollections(invoiceId);
      }
    })
  }

  loadCollections(invoiceId:number){
    this.schoolService.getCollections(invoiceId).pipe(takeUntil(this.destroy$)).subscribe({
      next:(collections)=>{
        if(this.invoice?.collections) this.invoice.collections = collections;
      }
    })
  }

  initCollectionForm(){
    this.collectionForm = this.formBuilder.group({
      collectionDate:['',Validators.required],
      amount:['',[Validators.required,Validators.pattern(/^[0-9]\d*$/)]],
    })
  }

  recordCollection(){
    this.isSubmitted = true;
    if(this.collectionForm.invalid) return;

    const data = this.collectionForm.value;
    /**
     * {
     *     "collectionDate": "2024-06-03",
     *     "amount": "3000"
     * }
     */
    const collection:Collection = {
      amount: data.amount,
      collectionDate: data.collectionDate,
      userId:this.currentUser.id,
      invoiceId:Number(this.pathParams['invoiceId']),
    }

    this.schoolService.recordCollection(collection).pipe(takeUntil(this.destroy$)).subscribe({
      next:(collections)=>{
        this.initInvoice();
        this.toastr.success("Collection records recorded");
        this.isSubmitted = false;
        this.collectionForm.reset();
        this.toggleShowCollectionList();
      }
    })

  }

  get control(){
    return this.collectionForm.controls
  }

  toggleShowCollectionList() {
    this.isShowCollectionList = !this.isShowCollectionList;
  }
}
