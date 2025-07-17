import { Component } from '@angular/core';
import {Button} from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import {TableModule} from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import {ActivatedRoute, Router} from '@angular/router';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';
import {CreatorService} from '../../../services/creator/creator-service';
import {Course} from '../../../interfaces/course-model-interface';
import {ModuleFormComponent} from '../modals/module-form/module-form.component';
import {ClasseFormComponent} from '../modals/classe-form/classe-form.component';
import {finalize} from 'rxjs';
import {ConfirmationService, } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-manage-public',
  imports: [
    Button,
    AccordionModule,
    TableModule,
    TabViewModule,
    InputText,
    Textarea,
    ModuleFormComponent,
    ClasseFormComponent,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './manage-course.component.html',
  styleUrl: './manage-course.component.css'
})
export class ManageCourseComponent {
  courseId: string | null = null;
  courseData: Course | null = null;
  displayModuleModal = false;

  displayClasseModal = false;
  selectedModuleId: string | null = null;
  nextClasseOrder: number = 1;

  isSavingLesson = false;
  isLoading = true;

  constructor(private route: ActivatedRoute,
              private creatorService: CreatorService,
              private confirmationService: ConfirmationService,
              private router: Router,) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');

    if(this.courseId) {
      this.creatorService.getOneCourse(this.courseId).subscribe({
        next: (response) => {
          this.courseData = response;
          this.isLoading = false;
          console.log(this.courseData);
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        }
      });
    }
  }

  editCourse() {
    if(this.courseId && this.courseData?.title && this.courseData?.description)
    {
      this.creatorService.editCourse(this.courseData, this.courseId).subscribe({
        next: (response) => {
          this.courseData = response;
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  confirmDeleteCourse()
  {
    this.confirmationService.confirm({
      message: 'Deseja realmente encerrar este curso?',
      header: 'Confirmação de Encerramento',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonProps: {
        severity: 'danger',
      },
      accept: () => {
        this.deleteCourse();
      },
    });
  }

  confirmDeleteModule(public_id: string)
  {
    this.confirmationService.confirm({
      message: 'Deseja realmente encerrar o módulo?',
      header: 'Confirmação de Encerramento',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonProps: {
        severity: 'danger',
      },
      accept: () => {
        this.deleteModule(public_id);
      },
    });
  }

  confirmDeleteClasse(public_id: string)
  {
    this.confirmationService.confirm({
      message: 'Deseja realmente encerrar a aula?',
      header: 'Confirmação de Encerramento',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonProps: {
        severity: 'danger',
      },
      accept: () => {
        this.deleteClasse(public_id);
      },
    });
  }

  deleteCourse(): void {
    if(this.courseData?.public_id)
      this.creatorService.deleteCourse(this.courseData.public_id).subscribe();
    this.router.navigate(['/creator/dashboard']);
  }

  addModule() { this.displayModuleModal = true; }

  editModule(module: any) { console.log('Editando o módulo:', module.title); }

  deleteModule(public_id: string) {
    this.creatorService.deleteModule(public_id).subscribe();
    this.router.navigate(['/creator/dashboard']);
  }

  // Esconde o modal
  hideModuleModal(): void {
    this.displayModuleModal = false;
  }

  // Lida com o salvamento do novo módulo
  handleSaveModule(moduleData: any): void {
    this.creatorService.createModule(moduleData).subscribe({
      next: (newModule) => {
        if(this.courseData) {
          this.courseData.modules.push(newModule);
          this.hideModuleModal();
          this.ngOnInit();
          // IDEIA: Adicionar uma mensagem de sucesso (Toast)
        }
      },
      error: (err) => {
        console.error('Erro ao criar o módulo', err);
        // Mostrar mensagem de erro para o usuário
      }
    });
  }

  showAddClasseModal(module: any): void {
    this.selectedModuleId = module.public_id;
    this.nextClasseOrder = (module.classes?.length || 0) + 1;
    this.displayClasseModal = true;
    console.log('module id: ', module.public_id);
  }

  hideClasseModal(): void {
    this.displayClasseModal = false;
    this.selectedModuleId = null; // Limpa o estado
  }

  handleSaveClasse(formData: FormData): void {
    this.isSavingLesson = true;
    this.creatorService.createClasse(formData).pipe(
      finalize(() => {
        this.isSavingLesson = false;
      })
    ).subscribe({
      next: (newLesson) => {
        console.log('Aula criada com sucesso!', newLesson);
        if (this.courseData) {
          const moduleIndex = this.courseData.modules.findIndex(m => m.public_id === this.selectedModuleId);

          if (moduleIndex > -1) {
            const targetModule = this.courseData.modules[moduleIndex];

            if (!targetModule.lessons) {
              targetModule.lessons = [];
            }

            targetModule.lessons.push(newLesson);
          }
        }
        this.hideClasseModal(); // Fecha o modal
        this.ngOnInit();
      },
      error: (err) => { console.error(err); }
    });
  }

  editClasse(classe: any) { console.log('Editando a aula:', classe.title); }

  deleteClasse(public_id: string) {
    this.creatorService.deleteClasse(public_id).subscribe({
      next: () => {
        this.router.navigate(['/creator/dashboard']);
      },
      error: (err) => {
        console.error('Erro ao deletar aula ',err);
      }
    })
  }
}
