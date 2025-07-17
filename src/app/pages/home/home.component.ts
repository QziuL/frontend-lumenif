import { Component } from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {Router} from '@angular/router';
import {Course} from '../../interfaces/course-model-interface';
import {InputText} from 'primeng/inputtext';
import {Card} from 'primeng/card';
import {SlicePipe} from '@angular/common';
import {PublicCourseService} from '../../services/public/course/public-course.service';

@Component({
  selector: 'app-home',
  imports: [
    ButtonModule,
    InputText,
    Card,
    SlicePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  courses: Course[] = [];
  isLoading = true;

  constructor(
    private courseService: PublicCourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Usaremos dados mockados até conectar a API
    this.loadApprovedCourses();
  }

  loadApprovedCourses(): void {
    this.isLoading = true;

    this.courseService.getApprovedCourses().subscribe({
      next: data => {
        this.courses = data;
        this.isLoading = false;
        console.log(this.courses);
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  viewCourseDetails(courseId: string): void {
    this.router.navigate(['app/course/', courseId]); // Rota para detalhes do curso
  }
}
