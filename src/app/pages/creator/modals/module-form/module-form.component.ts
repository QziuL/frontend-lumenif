import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {Textarea} from 'primeng/textarea';
import {PrimeTemplate} from 'primeng/api';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-module-form',
  imports: [
    Dialog,
    ReactiveFormsModule,
    InputText,
    Textarea,
    PrimeTemplate,
    Button
  ],
  templateUrl: './module-form.component.html',
  styleUrl: './module-form.component.css'
})
export class ModuleFormComponent {
// Entradas e Saídas para comunicação com o componente pai
  @Input() displayModal: boolean = false;
  @Input({ required: true }) courseId!: string;
  @Input() nextOrderNumber: number = 1;
  @Input() moduleToEdit: any | null = null;

  @Output() onHideModal = new EventEmitter<void>();
  @Output() onSaveModule = new EventEmitter<any>();

  moduleForm: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {
    this.moduleForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      order: [1, [Validators.required, Validators.min(1)]]
    });
  }

  // Este hook é acionado quando os @Inputs mudam
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['displayModal'] && this.displayModal) {
      if (this.moduleToEdit) {
        // MODO EDIÇÃO
        this.isEditMode = true;
        this.moduleForm.patchValue(this.moduleToEdit);
      } else {
        // MODO CRIAÇÃO
        this.isEditMode = false;
        // Preenche o formulário com o próximo número de ordem disponível
        this.moduleForm.reset({ order: this.nextOrderNumber });
      }
    }
  }

  // Fecha o modal e avisa o pai
  hideDialog(): void {
    this.onHideModal.emit();
  }

  // Valida e emite os dados do formulário para o pai
  saveModule(): void {
    if (this.moduleForm.invalid) {
      return;
    }

    const moduleData = {
      ...this.moduleForm.value,
      course_id: this.courseId // Adiciona o course_id ao payload
    };
    this.onSaveModule.emit(moduleData);
  }
}
