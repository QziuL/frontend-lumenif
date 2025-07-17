import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-public-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.css'
})
export class CourseFormComponent {
// Propriedade para controlar a visibilidade do modal, vinda do componente pai
  @Input() displayModal: boolean = false;

  // Eventos para comunicar com o componente pai
  @Output() onHideModal = new EventEmitter<void>();
  @Output() onSaveCourse = new EventEmitter<any>();

  courseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  // Esconde o modal e limpa o formulário
  hideDialog(): void {
    this.courseForm.reset();
    this.onHideModal.emit();
  }

  // Emite os dados do formulário para o componente pai
  saveCourse(): void {
    if (this.courseForm.invalid) {
      return;
    }
    this.onSaveCourse.emit(this.courseForm.value);
  }
}
