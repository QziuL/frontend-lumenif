import {Component, OnInit, ViewChild} from '@angular/core';
import {Card} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {Tag} from 'primeng/tag';
import {Router} from '@angular/router';
import {CreatorService} from '../../../services/creator/creator-service';
import {CourseInterface} from '../../../interfaces/course-interface';
import {UIChart} from 'primeng/chart';
import {StyleClass} from 'primeng/styleclass';
import {AuthService} from '../../../services/auth/auth-service';
import {CourseFormComponent} from '../modals/course-form/course-form.component';
import {Tooltip} from 'primeng/tooltip';
import { ChartDataset } from 'chart.js';
import jsPDF from 'jspdf';

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
    UIChart,
    CourseFormComponent,
    StyleClass,
    Tooltip,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class CreatorDashboardComponent implements OnInit {
  @ViewChild('statusChart') statusChart: UIChart | undefined;
  @ViewChild('topCoursesChart') topCoursesChart: UIChart | undefined;

  kpiTotalCursos: number = 0;
  kpiTotalAlunos: number = 0;
  kpiAvaliacaoMedia: number = 0;

  statusChartData: any;
  topCoursesChartData: any;
  chartOptions: any;

  displayCreateCourseModal = false;

  courses: CourseInterface[] = [];
  errorMessage: string | null = null;

  constructor(private router: Router, private creatorService: CreatorService, private authService: AuthService) {}

  ngOnInit() {
    console.log('token: ', this.authService.getToken());
    this.loadDashboardData();
    this.loadCourses();
    // this.initCharts();
  }

  loadDashboardData(): void {
    // Busca os dados dos cards de KPI
    this.creatorService.getDashboardKpis().subscribe(kpis => {
      this.kpiTotalCursos = kpis.totalCursos;
      this.kpiTotalAlunos = kpis.totalAlunos;
      this.kpiAvaliacaoMedia = kpis.avaliacaoMedia;
    });

    // Inicia o carregamento dos gráficos
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

  manageCourse(courseId: string): void {
    this.router.navigate(['/app/creator/manage-course/', courseId]);
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

  // Gera o Relatório PDF com os Gráficos
  downloadChartAsPdf(chartInstance: UIChart | undefined, fileName: string): void {
    if (!chartInstance) {
      console.error('Instância do gráfico não encontrada!');
      return;
    }

    // 1. Usa um pequeno timeout para garantir que a animação do gráfico terminou
    setTimeout(() => {
      // 2. O Chart.js nos dá uma imagem do gráfico em formato Base64
      const chartImage = chartInstance.getBase64Image();

      // 3. Cria uma nova instância do jsPDF (A4, retrato, milímetros)
      const doc = new jsPDF('p', 'mm', 'a4');

      // 4. Adiciona um título ao PDF
      // const title = fileName.replace('.pdf', '').replace(/_/g, ' ');
      const title = `Relatório de ${fileName.replace('relatorio', '')
        .replace('.pdf', '')
        .replace(/_/g, ' ')}.`;

      doc.setFontSize(16);
      doc.text(title, 15, 20);

      // 5. Adiciona a imagem do gráfico ao PDF
      // (imagem, formato, x, y, largura, altura)
      const imgWidth = 60;
      const imgHeight = (chartInstance.chart.height * imgWidth) / chartInstance.chart.width;
      doc.addImage(chartImage, 'PNG', 15, 30, imgWidth, imgHeight);

      (chartInstance.data.datasets as ChartDataset<'bar'>[]).forEach((dataset, index) => {
        const label = dataset.label ?? `Série ${index + 1}`;
        const dataStr = (dataset.data as number[]).join(', ') ?? 'Sem dados';
        doc.text(`${label}: ${dataStr}`, 15, 40 + index * 10);
      });
      // 6. Salva o arquivo e força o download
      doc.save(fileName);

    }, 500); // 500ms de espera
  }

  showCreateCourseModal(): void {
    this.displayCreateCourseModal = true;
  }

  hideCourseModal(): void {
    this.displayCreateCourseModal = false;
  }

  // Salva novo curso
  handleSaveCourse(courseData: { titulo: string; descricao: string }): void {
    console.log('Criando curso com os dados:', courseData);
    this.creatorService.createCourse(courseData).subscribe({
      next: (newCourse) => { //
        console.log('Curso criado com sucesso!', newCourse);
        this.hideCourseModal(); // Fecha o modal

        // Redireciona para uma nova página de gerenciamento, passando o ID do novo curso
        // this.router.navigate(['/creator/manage-public', newCourse.public_id]);
        this.loadCourses();
        this.initCharts();
      },
      error: (err) => {
        console.error('Erro ao criar o curso', err);
        // Lembrar de usar Toast do PrimeNG para mensagem de erro
      }
    });
  }
}
