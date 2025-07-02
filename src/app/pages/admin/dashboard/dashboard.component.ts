import { Component } from '@angular/core';
import {Card} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {UserList} from '../user-list/user-list';
import {LogoutComponent} from '../../../buttons/logout/logout.component';
import {HomeComponent} from '../../../buttons/home/home.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    Card,
    TableModule,
    ButtonModule,
    TagModule,
    UserList,
    LogoutComponent,
    HomeComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  totalUsers: number = 0;
  constructor() {}

  updateTotalUsers(value: number): void {
    this.totalUsers = value;
  }
}
