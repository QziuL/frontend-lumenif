import { Component, ViewChild } from '@angular/core';
import {Table, TableModule} from 'primeng/table';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {InputText} from 'primeng/inputtext';
import {Tag} from 'primeng/tag';
import {Button} from 'primeng/button';
import {Toast} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Tooltip} from 'primeng/tooltip';
import {AdminService} from '../../../services/admin/admin-service';

export interface ICourse {
  public_id: string,
  title: string,
  creator: ICreator,
  status: string,
}

export interface ICreator {
  name: string,
}

@Component({
  selector: 'app-manage-courses',
  imports: [
    TableModule,
    InputText,
    Tag,
    Button,
    Toast,
    ConfirmDialog,
    Tooltip
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './manage-courses.component.html',
  styleUrl: './manage-courses.component.css'
})
export class ManageCoursesComponent {
  @ViewChild('dt') dt: Table | undefined;
  courses: ICourse[] = [];
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.adminService.getAllCourses().subscribe(data => {
      this.courses = data;
      this.isLoading = false;
    });
    this.isLoading = false;
  }

  approveCourse(courseId: string): void {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja aprovar este curso?',
      header: 'Confirmar Aprovação',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Sim, aprovar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.adminService.approveCourse(courseId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Curso aprovado!' });
            this.ngOnInit();
          },
          error: err => {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: err});
            console.error(err);
          }
        });
      }
    });
  }

  rejectCourse(courseId: string): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja rejeitar este curso?',
      header: 'Confirmar Rejeição',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, rejeitar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.adminService.rejectCourse(courseId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejeitado', detail: 'O curso foi rejeitado.' });
            this.ngOnInit();
          },
          error: err => {
            this.messageService.add({severity: 'error', summary: 'Erro', detail: err});
            console.error(err);
          }
        });

      }
    });
  }

  viewCourse(courseId: string): void {
    this.router.navigate(['app/course/', courseId]);
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Aprovado': return 'success';
      case 'Pendente': return 'warn';
      case 'Rejeitado': return 'danger';
      default: return 'info';
    }
  }

  onGlobalFilter(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;

    // Verifica se o elemento de input existe antes de pegar o valor
    if (inputElement) {
      this.dt?.filterGlobal(inputElement.value, 'contains');
    }
  }
}
