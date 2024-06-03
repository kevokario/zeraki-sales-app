import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from "../../../shared/models/User";

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss'
})
export class TopNavComponent {
  @Input() currentUser!:User;
  @Output() toggleSidebarEvt:EventEmitter<void> = new EventEmitter();
  @Output() logoutEvt:EventEmitter<void> = new EventEmitter();

  toggleSidebar(){
    this.toggleSidebarEvt.emit();
  }

  logout(){
    this.logoutEvt.emit();
  }

}
