import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss','./../../portal.component.scss']
})
export class SidenavComponent {
@Input() showSidebar:boolean = false;
@Output() toggleSidebarEvt = new EventEmitter<void>();

  toggleSidebar() {
    this.toggleSidebarEvt.emit();
  }
}
