import { Component } from '@angular/core';
import {Classe, ContentClasse, PublicCourseInterface} from '../../../interfaces/public-course-interface';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ProgressBar} from 'primeng/progressbar';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {Checkbox} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {StudentService} from '../../../services/student/student.service';
import { CheckboxChangeEvent } from 'primeng/checkbox';

@Component({
  selector: 'app-course-player',
  imports: [
    ProgressBar,
    Accordion,
    AccordionHeader,
    AccordionPanel,
    AccordionContent,
    Checkbox,
    FormsModule,
    Button,
  ],
  templateUrl: './course-player.component.html',
  styleUrl: './course-player.component.css'
})
export class CoursePlayerComponent {
  course: PublicCourseInterface | null = null;
  selectedContent: ContentClasse | null = null; // Conteúdo da aula atualmente exibida
  safeVideoUrl: SafeResourceUrl | null = null; // URL segura para o iframe do YouTube
  selectedLesson: Classe | null = null;

  completedLessons = new Set<string>();
  completionPercentage = 0;

  constructor(
    private route: ActivatedRoute,
    private courseService: StudentService,
    private sanitizer: DomSanitizer // Injete o DomSanitizer
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getEnrolledCourseContent(courseId).subscribe({
        next: (data: any) => {
          this.course = data;
          console.log(this.course);
        },
        error: err => {
          console.log(err);
        }
      });

      if(this.course?.modules[0]?.lessons[0])
        this.selectLesson(this.course.modules[0].lessons[0]); // Seleciona a primeira aula por padrão
      this.calculateProgress();
    }
  }

  getIconForContentType(contentTypeName: string): string {
    switch (contentTypeName) {
      case 'Video':
        return 'pi pi-video';
      case 'Text':
        return 'pi pi-file-edit';
      case 'File':
        return 'pi pi-file-import';
      case 'Image':
        return 'pi pi-image';
      default:
        return 'pi pi-file'; // Um ícone padrão para tipos desconhecidos
    }
  }

  selectLesson(lesson: Classe): void {
    this.selectedLesson = lesson;
    this.safeVideoUrl = null; // Limpa a URL do vídeo anterior

    if (lesson.contents && lesson.contents.length > 0) {
      // Por padrão, exibe o primeiro bloco de conteúdo da aula selecionada
      this.selectedContent = lesson.contents[0];

      // Se for um vídeo, sanitiza a URL para o iframe
      if (this.selectedContent.content_type.name === 'Video') {
        const videoId = this.extractYouTubeVideoId(this.selectedContent.content.url_content!);
        if (videoId) {
          this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
        }
      } else {
        // Se a aula não tiver nenhum bloco de conteúdo
        this.selectedContent = null;
      }
    }
  }

  toggleLessonCompletion(lessonId: string, event: CheckboxChangeEvent): void {
    const isCompleted = event.checked ?? false;

    if (isCompleted) {
      this.completedLessons.add(lessonId); // Adiciona o ID ao Set
    } else {
      this.completedLessons.delete(lessonId); // Remove o ID do Set
    }

    // Após cada mudança, recalcula o progresso
    this.calculateProgress();
  }

  calculateProgress(): void {
    if (!this.course || !this.course.modules) {
      this.completionPercentage = 0;
      return;
    }

    // Calcula o número total de aulas em todos os módulos
    const totalLessons = this.course.modules.reduce((acc, module) => acc + module.lessons.length, 0);

    if (totalLessons === 0) {
      this.completionPercentage = 0;
      return;
    }

    // O progresso é o tamanho do Set dividido pelo total de aulas
    const completedCount = this.completedLessons.size;
    this.completionPercentage = Math.round((completedCount / totalLessons) * 100);
  }

  // Função auxiliar para extrair o ID do vídeo de uma URL do YouTube
  extractYouTubeVideoId(url: string): string | null {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v');
  }
}
