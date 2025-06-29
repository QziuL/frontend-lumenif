import { Component } from '@angular/core';
import {UserInterface} from '../../../interfaces/user-interface';
import {Card} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {UserList} from '../user-list/user-list';

@Component({
  selector: 'app-dashboard',
  imports: [
    Card,
    TableModule,
    ButtonModule,
    TagModule,
    UserList
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor() {}
}
