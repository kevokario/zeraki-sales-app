import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, Subject, takeUntil} from "rxjs";
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/models/User";
import {DashboardService} from "../../shared/services/dashboard.service";
import {ISchool} from "../../shared/models/ISchool";
import {Collection, Invoice} from "../../shared/models/Invoice";
import {ProductService} from "../../shared/services/product.service";
import {IProduct} from "../../shared/models/Product";
import Chart from 'chart.js/auto';
import {TargetService} from "../../shared/services/target.service";
import {ITarget} from "../../shared/models/Target";
import {ISchoolType} from "../../shared/models/SchoolType";
import {SchoolService} from "../../shared/services/school.service";

interface RevenueBreakDown {
  product:string,
  totalRevenue:number
}
interface UserTarget {
  product:string,
  score:number,
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit,OnDestroy {

  destroy$:Subject<boolean> = new Subject<boolean>();
  currentUser!:User;
  userSignups:number = 0;
  totalRevenue:number = 0;
  totalCollections:number = 0;
  bouncedCheques:number = 0;

  products:IProduct[] = [];
  revenueBreakDown:RevenueBreakDown[] = [];
  overallUserTargets:UserTarget[] = [];

  constructor(
    private authService: AuthService,
    private dashboardService:DashboardService,
    private productService:ProductService,
    private schoolService:SchoolService,
    private targetService:TargetService
  ) {

  }


  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  ngOnInit() {
    this.initCurrentUser();
    this.loadStatsData();
  }
  initCurrentUser(){
    this.authService.currentUser.pipe(takeUntil(this.destroy$)).subscribe({
      next:(currentUser)=>{
        if(currentUser) this.currentUser = currentUser;
      }
    })
  }

  loadStatsData(){
    const userSignups$:Observable<ISchool[]> = this.dashboardService.getUserSignups(this.currentUser.id);
    const totalCollections$:Observable<Collection[]> =this.dashboardService.getTotalCollections(this.currentUser.id);
    const totalRevenue$:Observable<Invoice[]>=this.dashboardService.getTotalRevenue();
    const products$:Observable<IProduct[]>=this.productService.getProducts();
    const targets$:Observable<ITarget[]>=this.targetService.getUserTargets(this.currentUser.id);
    const schoolTypes$ = this.schoolService.getSchoolTypes();

    forkJoin([
      userSignups$,totalCollections$,totalRevenue$,products$,targets$,schoolTypes$
    ])
      .pipe(takeUntil(this.destroy$)).subscribe({
      next:(statsData:[ISchool[],Collection[],Invoice[],IProduct[],ITarget[],ISchoolType[]] )=>{
        this.userSignups = statsData[0].length;
        const signUps = statsData[0];
        const collection = statsData[1];
        const invoice = statsData[2];
        const product = statsData[3];
        const target = statsData[4];
        const schoolTypes = statsData[5];

        statsData[1].forEach(collection=>this.totalCollections+=Number(collection.amount));
        this.bouncedCheques = collection.length > 3 ? 1:0;

        statsData[2].forEach(invoice=>this.totalRevenue+=Number(invoice.invoiceAmount));
        this.products = product;

        this.initRevenueBreakDown(invoice);
        this.initUserTargets(target,signUps);
        this.initSalesBySchoolType(schoolTypes,signUps,product);
      }
    })
  }


  initRevenueBreakDown(invoices:Invoice[]){
    let revenueBreakDown:Array<RevenueBreakDown> = [];

    this.products.forEach(product=>{
      let totalProductAmount = 0;
      invoices.filter(invoice=>invoice.productId==product.id)
        .forEach((invoice)=>{
          totalProductAmount +=Number(invoice.invoiceAmount)
        });

      revenueBreakDown.push({
        product:product.productName,
        totalRevenue:totalProductAmount
      });

      totalProductAmount = 0;
    })

    this.revenueBreakDown = revenueBreakDown;
  }
  overallUserTargetsChart:any;

  initUserTargets(userTargets: ITarget[], userSchools: ISchool[]){

    const overallUserTargets:UserTarget[] = [];
    const labels:string[] = []
    const data:any[]=[]



    if(userSchools.length > 0){

      userTargets.forEach((target)=>{

        let items = userSchools.filter((userSchool)=>userSchool.productId == target.productId).length;

        target.status = Math.round(items/target.target *100);
        labels.push(target.product?.productName||"");
        data.push(target.status);

        overallUserTargets.push({
          product:target.product?.productName||"",
          score:target.status,
        })
      });

    }
    this.overallUserTargets = overallUserTargets;

    this.overallUserTargetsChart =new Chart('overallUserTargets',{
      type: 'pie',
      data:{
        labels:labels,
        datasets:[{
          label:labels[0],
          data:[...data],
          borderWidth:1,
        }]
      },options:{
        scales:{
          y:{
            display:false,
            beginAtZero:true
          }
        }
      }
    })
  }

  signUpBreakDownChart:any;
  initSalesBySchoolType(schoolType:ISchoolType[],signUps:ISchool[],product:IProduct[]){
    // Create maps for quick lookups
    const schoolTypeMap: { [key: number]: string } = schoolType.reduce((map, type) => {
      map[type.id] = type.type;
      return map;
    }, {} as { [key: number]: string });

    const productMap: { [key: number]: string } = product.reduce((map, product) => {
      map[product.id] = product.productName;
      return map;
    }, {} as { [key: number]: string });

// Define the type for the grouped schools
    interface GroupedSchools {
      [key: string]: {
        [key: string]: ISchool[];
      };
    }

// Group schools by schoolType and product
    const groupedSchools: GroupedSchools = {};

    signUps.forEach(school => {
      const schoolType = schoolTypeMap[school.schoolTypeId];
      const product = productMap[school.productId];

      if (!groupedSchools[schoolType]) {
        groupedSchools[schoolType] = {};
      }

      if (!groupedSchools[schoolType][product]) {
        groupedSchools[schoolType][product] = [];
      }

      groupedSchools[schoolType][product].push(school);
    });

    /**
     * {
     *     "secondary": {
     *         "Zeraki Timetable": [
     *             {
     *                 "contactPerson": "kqwet",
     *                 "contactPhone": "0711111166",
     *                 "countyId": "3",
     *                 "name": "new school",
     *                 "productId": 3,
     *                 "registrationDate": "2024-06-13",
     *                 "schoolTypeId": "2",
     *                 "userId": 2,
     *                 "id": 1
     *             }
     *         ],
     *         "Zeraki Analytics": [
     *             {
     *                 "contactPerson": "kqwet",
     *                 "contactPhone": "0711111166",
     *                 "countyId": "5",
     *                 "name": "new school 2",
     *                 "productId": 1,
     *                 "registrationDate": "2024-06-13",
     *                 "schoolTypeId": "2",
     *                 "userId": 2,
     *                 "id": 3
     *             }
     *         ]
     *     },
     *     "primary": {
     *         "Zeraki Finance": [
     *             {
     *                 "contactPerson": "kqwet",
     *                 "contactPhone": "0711111166",
     *                 "countyId": "3",
     *                 "name": "new school 1",
     *                 "productId": 2,
     *                 "registrationDate": "2024-06-27",
     *                 "schoolTypeId": "1",
     *                 "userId": 2,
     *                 "id": 2
     *             }
     *         ]
     *     }
     * }
     */

    console.log(groupedSchools,Object.keys(groupedSchools).sort());
    const labels = Object.keys(groupedSchools);
    const datasets = this.products
      .filter(product => product !== undefined) // Filter out undefined elements
      .map((product, index) => {
        return {
          label: product.productName,
          data: labels.map(schoolType => (groupedSchools[schoolType][product.productName]?.length || 0)),
          backgroundColor: `rgba(${index * 50}, ${index * 100}, 132, 0.2)`,
          borderColor: `rgba(${index * 50}, ${index * 100}, 132, 1)`,
          borderWidth: 1
        };
      });

    this.signUpBreakDownChart = new Chart('signUpBreakDownChart', {
      type: 'bar',
      data: {
        labels,
        datasets
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }







}
