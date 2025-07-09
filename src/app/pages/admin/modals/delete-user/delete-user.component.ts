import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AdminService} from '../../../../services/admin/admin-service';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {FloatLabel} from 'primeng/floatlabel';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {PrimeTemplate} from 'primeng/api';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-delete-user',
  imports: [
    Button,
    Dialog,
    FormsModule,
    PrimeTemplate,
    ReactiveFormsModule,
  ],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.css'
})
export class DeleteUserComponent {
  @Input() idUser: string = '';
  @Input() displayModal: boolean = false;
  @Output() onHideModal = new EventEmitter<void>();
  @Output() onDeleteUser = new EventEmitter<any>();

  constructor(private adminService: AdminService) {}

  // Fecha o modal e emite o evento para o pai
  hideDialog(): void {
    this.onHideModal.emit();
  }

  deleteUser(): void {
    // Emite os dados do formulário para o componente pai
    this.onDeleteUser.emit();
  }
}
