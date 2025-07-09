import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Card} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {Tag} from 'primeng/tag';
import {Router} from '@angular/router';
import {CreatorService} from '../../../services/creator/creator-service';
import {CourseInterface} from '../../../interfaces/course-interface';
import {UIChart} from 'primeng/chart';

export interface Course {
  id: string;
  title: string;
  studentCount: number;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    Card,
    TableModule,
    Button,
    Tag,
    UIChart
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class CreatorDashboardComponent implements OnInit {
  // Para ter o total de alunos vinculados ao curso, é necessário
  // desenvolver o vinculo de aluno com curso no backend
  @Output() totalCourses: EventEmitter<number> = new EventEmitter();

  statusChartData: any;
  topCoursesChartData: any;
  chartOptions: any;

  // mockCourses: Course[] = [
  //   { id: 'uuid-1', title: 'Introdução ao Angular com PrimeNG', studentCount: 150, status: 'Aprovado' },
  //   { id: 'uuid-2', title: 'API RESTful com Laravel 12', studentCount: 85, status: 'Aprovado' },
  //   { id: 'uuid-3', title: 'Docker para Desenvolvedores', studentCount: 21, status: 'Pendente' },
  //   { id: 'uuid-4', title: 'Fundamentos de UX/UI', studentCount: 0, status: 'Rejeitado' },
  // ];

  courses: CourseInterface[] = [];
  errorMessage: string | null = null;

  constructor(private router: Router, private creatorService: CreatorService) {}

  ngOnInit() {
    this.loadCourses();
    this.initCharts();
  }

  initCharts(): void {
    // --- Gráfico de Status dos Cursos ---
    this.creatorService.getCourseStatusStats().subscribe(stats => {
      const labels = stats.map(s => s.status);
      const data = stats.map(s => s.count);

      // Mapeia os status para as cores correspondentes
      const backgroundColors = labels.map(label => {
        if (label === 'approved') return '#22C55E';
        if (label === 'pending') return '#F59E0B';
        if (label === 'reject') return '#EF4444';
        return '#64748B'; // Cor padrão
      });

      this.statusChartData = {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
        }]
      };
    });

    // --- Gráfico de Top Cursos por Alunos ---
    this.creatorService.getTopCoursesStats().subscribe(stats => {
      const labels = stats.map(s => s.title);
      const data = stats.map(s => s.registrations_count);

      this.topCoursesChartData = {
        labels: labels,
        datasets: [{
          label: 'Número de Alunos',
          backgroundColor: '#42A5F5',
          data: data
        }]
      };
    });

    // Opções de configuração para os gráficos
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#4B5563' // Cor do texto da legenda
          }
        }
      }
    };
  }

  loadCourses() {
    this.creatorService.getAllCourses().subscribe({
      next: (response) => {
        this.courses = response.data;
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível carregar a lista de cursos.';
        console.log(err);
      }
    });
  }

  // Placeholder para a ação de gerenciar
  manageCourse(courseId: string): void {
    console.log(`Navegando para o gerenciamento do curso: ${courseId}`);
    // this.router.navigate(['/creator/course', courseId, 'edit']);
  }

  // Função auxiliar para definir a cor da Tag de Status
  getStatutsSeverity(status: string): string {
    switch (status) {
      case 'Aprovado': return 'success';
      case 'Pendente': return 'warn';
      case 'Rejeitado': return 'danger';
      default: return 'info';
    }
  }

  // BUTTON DARK MODE
  toggleDarkMode() {
    const element = document.querySelector('html');
    if(element) {
      element.classList.toggle('my-app-dark');
    }
  }
}
