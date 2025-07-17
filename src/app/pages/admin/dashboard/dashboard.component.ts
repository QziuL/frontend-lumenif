import { Component } from '@angular/core';
import {Card} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {UserList} from '../user-list/user-list';
import {AdminService} from '../../../services/admin/admin-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    Card,
    TableModule,
    ButtonModule,
    TagModule,
    UserList,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class AdminDashboardComponent {
  totalUsers: number = 0;
  totalCoursesApproved: number = 0;
  totalCoursesPending: number = 0;

  constructor(private adminService: AdminService, private router: Router,) {}

  ngOnInit() {
    this.getAllCoursesApproved();
    this.getAllCoursesPending();
  }

  updateTotalUsers(value: number): void {
    this.totalUsers = value;
  }

  getAllCoursesApproved(): void {
    this.adminService.getAllCoursesApproved().subscribe({
      next: result => {
        this.totalCoursesApproved = result.length;
        // console.log('courses approved ', result);
      },
      error: err => {
        console.log(err);
      }
    })
  }

  getAllCoursesPending(): void {
    this.adminService.getAllCoursesPending().subscribe({
      next: result => {
        this.totalCoursesPending = result.length;
        // console.log('courses pending ', result);
      },
      error: err => {
        console.log(err);
      }
    })
  }

  manageCourses(): void {
    this.router.navigate(['app/admin/dashboard/manage-courses']);
  }
}
