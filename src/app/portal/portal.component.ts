import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../shared/services/auth.service";
import {Subject, takeUntil} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {User} from "../shared/models/User";

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrl: './portal.component.scss'
})
export class PortalComponent implements OnDestroy,OnInit{
  currentUser!:User;
  destroy$:Subject<boolean> = new Subject<boolean>();
  constructor(
              private authService:AuthService,
              private router:Router) {

  }
  ngOnInit() {
    this.initCurrentUser();
  }

  initCurrentUser(){
    this.authService.currentUser.pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next:((currentUser)=>{
        currentUser ? this.currentUser = currentUser : this.logout();
      })
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  logout() {
    this.authService.logout().pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next:(()=>{

          this.router.navigateByUrl("")
        })
      })
  }

  showSidebar: boolean = true;

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

}
