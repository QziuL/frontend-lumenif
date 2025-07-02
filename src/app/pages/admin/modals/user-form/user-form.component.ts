import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {Select} from 'primeng/select';
import {Button} from 'primeng/button';
import {PrimeTemplate} from 'primeng/api';
import {UserInterface} from '../../../../interfaces/user-interface';
import {RoleInterface} from '../../../../interfaces/role-interface';
import {AdminService} from '../../../../services/admin/admin-service';

@Component({
  selector: 'app-user-form',
  imports: [
    Dialog,
    ReactiveFormsModule,
    InputText,
    Password,
    Select,
    Button,
    PrimeTemplate
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  // Entradas e Saídas
  @Input() displayModal: boolean = false;
  @Input() userToEdit: UserInterface | null = null; // Recebe o usuário para edição
  @Output() onHideModal = new EventEmitter<void>();
  @Output() onSaveUser = new EventEmitter<any>();

  userForm: FormGroup;
  roles: RoleInterface[] = [];
  isEditMode = false; // Flag para controlar o modo

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.userForm = this.fb.group({
      public_id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role_id: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  // Hook que detecta mudanças nas propriedades @Input
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['displayModal'] && this.displayModal) {
      if(this.userToEdit) {
        // MODO DE EDIÇÃO
        this.isEditMode = true;

        if(this.userForm.contains('password')) {
          this.userForm.removeControl('password');
        }

        // Preenche o formulário com os dados do usuário
        this.userForm.patchValue({
          public_id: this.userToEdit.public_id,
          name: this.userToEdit.name,
          email: this.userToEdit.email,
          // Pega o ID do primeiro papel do usuário (conforme solicitado)
          roles: this.userToEdit.roles
        });
      } else {
        // MODO DE CRIAÇÃO
        this.isEditMode = false;

        if (!this.userForm.contains('password')) {
          // this.userForm.removeControl('public_id');
          this.userForm.addControl(
            'password',
            this.fb.control('', [Validators.required, Validators.minLength(8)])
          );
        }

        // this.userForm.addControl('public_id', this.fb.control('', [Validators.required]));
        this.userForm.reset(); // Limpa o formulário
      }
    }
  }

  loadRoles(): void {
    this.adminService.getRoles().subscribe(data => this.roles = data);
  }

  hideDialog(): void {
    this.onHideModal.emit();
    // this.isEditMode = false;
    // this.userForm.reset();
  }

  saveUser(): void {
    if (this.userForm.invalid) return;
    this.onSaveUser.emit(this.userForm.value);
  }
}
