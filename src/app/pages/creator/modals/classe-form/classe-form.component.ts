import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Dialog} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {InputText} from 'primeng/inputtext';
import {Editor} from 'primeng/editor';
import {FileUpload} from 'primeng/fileupload';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {CreatorService} from '../../../../services/creator/creator-service';
import {Select} from 'primeng/select';

// Interfaces para tipagem
interface ContentType { id: number; name: string; icon: string; }
interface StagedContent {
  contentType: ContentType;
  order: number;
  data: any;
  file?: File; // Armazena o objeto do arquivo, se houver
}

@Component({
  selector: 'app-classe-form',
  imports: [
    Dialog,
    ReactiveFormsModule,
    DropdownModule,
    InputText,
    Editor,
    FileUpload,
    Button,
    Tooltip,
    FormsModule,
    Select
  ],
  templateUrl: './classe-form.component.html',
  styleUrl: './classe-form.component.css'
})
export class ClasseFormComponent {
// Entradas e Saídas
  @Input() displayModal: boolean = false;
  @Input({ required: true }) moduleId!: string;
  @Input() nextLessonOrder: number = 1;
  @Input() isLoading: boolean = false

  @Output() onHideModal = new EventEmitter<void>();
  @Output() onSaveLesson = new EventEmitter<FormData>();

  // Formulários
  lessonForm: FormGroup;
  contentBlockForm: FormGroup;

  // Estado do Componente
  contentTypes: ContentType[] = [];
  selectedContentType: ContentType | null = null;
  stagedContents: StagedContent[] = [];
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private creatorService: CreatorService,) {
    // Formulário principal da aula (apenas título e ordem)
    this.lessonForm = this.fb.group({
      title: ['', Validators.required],
      order: [1, Validators.required]
    });

    // Formulário para criar um bloco de conteúdo individual
    this.contentBlockForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.creatorService.getContentTypes().subscribe({
      next: value => { this.contentTypes = value; },
      error: err => {console.error('Erro ao solicitar tipos de conteudo', err);}
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['displayModal'] && this.displayModal) {
      // Reseta tudo quando o modal abre para uma nova aula
      this.stagedContents = [];
      this.lessonForm.reset({ order: this.nextLessonOrder });
      this.contentBlockForm.reset();
      this.selectedContentType = null;
    }
  }

  // Chamado quando o tipo de conteúdo é selecionado no dropdown
  onContentTypeChange(event: any): void {
    this.selectedContentType = event.value;
    this.buildContentBlockForm();
  }

  // Constrói o formulário dinamicamente com base no tipo de conteúdo
  buildContentBlockForm(): void {
    this.contentBlockForm = this.fb.group({}); // Limpa o formulário
    if (!this.selectedContentType) return;

    switch (this.selectedContentType.id) {
      case 1: // Vídeo
        this.contentBlockForm.addControl(
          'url_content',
          this.fb.control('',
            [
              Validators.required,
              Validators.pattern('https?://.+')
            ]
          )
        );
        this.contentBlockForm.addControl(
          'duration_seconds',
          this.fb.control(
            null,
            [
              Validators.required,
              Validators.min(1)
            ]
          )
        );
        break;
      case 2: // Texto
        this.contentBlockForm.addControl(
          'text_content',
          this.fb.control('', Validators.required)
        );
        break;
      case 5: // Arquivo
        this.contentBlockForm.addControl(
          'file_content',
          this.fb.control(null, Validators.required)
        );
        break;
    }
  }

  // Captura o arquivo selecionado no p-fileUpload
  onFileSelect(event: any): void {
    this.selectedFile = event.files[0];
    this.contentBlockForm.get('file_content')?.setValue(this.selectedFile);
  }

  // Adiciona o bloco de conteúdo à lista de "staging"
  addContentBlock(): void {
    if (this.contentBlockForm.invalid) return;

    this.stagedContents.push({
      contentType: this.selectedContentType!,
      order: this.stagedContents.length + 1,
      data: this.contentBlockForm.value,
      file: this.selectedFile ?? undefined
    });

    // Reseta o construtor para adicionar o próximo bloco
    this.contentBlockForm.reset();
    this.selectedContentType = null;
    this.selectedFile = null;
  }

  removeContentBlock(index: number): void {
    this.stagedContents.splice(index, 1);
  }

  // Monta o payload final e emite o evento para salvar
  saveLesson(): void {
    if (this.lessonForm.invalid || this.stagedContents.length === 0) return;

    const lessonData = {
      module_id: this.moduleId,
      title: this.lessonForm.get('title')?.value,
      order: this.lessonForm.get('order')?.value,
      contents: this.stagedContents.map(block => {
        // const isFile = block.contentType.name === 'File';
        const isFile = block.contentType.id === 5;
        return {
          content_type_id: block.contentType.id,
          order: block.order,
          content_data: isFile ? { file_name: block.file?.name } : block.data
        }
      })
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(lessonData));

    // Anexa apenas os arquivos de fato ao FormData
    this.stagedContents.forEach((block, index) => {
      if (block.contentType.id === 5 && block.file) {
        formData.append(`files.${index}`, block.file, block.file.name);
      }
    });

    this.onSaveLesson.emit(formData);
  }

  hideDialog(): void {
    this.onHideModal.emit();
  }
}
