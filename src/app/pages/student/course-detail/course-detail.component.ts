import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PublicCourseService} from '../../../services/public/course/public-course.service';
import {PublicCourseInterface} from '../../../interfaces/public-course-interface';
import {Skeleton} from 'primeng/skeleton';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {ConfirmationService, PrimeTemplate} from 'primeng/api';
import {AuthService} from '../../../services/auth/auth-service';
import {StudentService} from '../../../services/student/student.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-course-detail',
  imports: [
    Skeleton,
    Accordion,
    AccordionPanel,
    AccordionContent,
    AccordionHeader,
    Card,
    Button,
    PrimeTemplate,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent {
  course: PublicCourseInterface | null = null;
  isLoading = true;
  isUserEnrolled = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicCourseService: PublicCourseService,
    private authService: AuthService,
    private studentService: StudentService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    // Pega o ID da rota
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourseDetails(courseId);
    }
  }

  loadCourseDetails(id: string): void {
    this.isLoading = true;
    this.publicCourseService.getCourseByPublicId(id).subscribe({
      next: (data) => {
        this.course = data;
        this.isUserEnrolled = !!data.is_enrolled;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do curso', err);
        this.isLoading = false;
        // Futuramente redirecionar para uma página de erro 404
        this.router.navigate(['/app/home']);
      }
    });
  }

  confirmEnroll(): void {
    this.confirmationService.confirm({
      message: 'Deseja realmente se inscrever neste curso?',
      header: 'Confirmação de Inscrição',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.enrollInCourse();
      }
    });
  }

  enrollInCourse(): void {
    if (this.authService.isLoggedIn() && this.course) {
      this.isLoading = true;
      this.studentService.enroll(this.course.public_id).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['app/course-player/', this.course?.public_id]);
        },
        error: (err) => {
          console.error('Erro ao se inscrever no curso', err);
        }
      });
    } else {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
    }
  }

  accessCourse(): void {
    this.router.navigate(['app/course-player/', this.course?.public_id]);
  }
}
