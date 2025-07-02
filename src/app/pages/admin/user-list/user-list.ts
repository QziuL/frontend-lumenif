import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AdminService} from '../../../services/admin/admin-service';
import {UserInterface} from '../../../interfaces/user-interface';
import {ButtonModule} from 'primeng/button';
import { TableModule } from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Tooltip} from 'primeng/tooltip';
import {DeleteUserComponent} from '../modals/delete-user/delete-user.component';
import {UserFormComponent} from '../modals/user-form/user-form.component';


export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  roles: { id: number, nome: string }[];
}

@Component({
  selector: 'app-user-list',
  imports: [
    ButtonModule,
    TableModule,
    Tag,
    Tooltip,
    DeleteUserComponent,
    UserFormComponent,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {
  @Output() totalUsers: EventEmitter<number> = new EventEmitter<number>();

  users: UserInterface[] = [];
  selectedUserForEdit: UserInterface | null = null;
  userIdForDelete = '';

  isLoading = true;
  errorMessage: string | null = null;
  displayUserModal = false;
  displayDeleteUserModal = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.data; // A resposta do paginate() do Laravel vem em 'data'
        this.isLoading = false;
        this.totalUsers.emit(this.users.length);
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível carregar a lista de usuários.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Função auxiliar para definir a cor da Tag baseada no papel
  getRoleSeverity(roleName: string): string {
    switch (roleName) {
      case 'ADMIN':
        return 'danger';
      case 'CRIADOR':
        return 'info';
      case 'ALUNO':
        return 'secondary';
      default:
        return 'primary';
    }
  }

  // Abre o modal para cadastrar novo usuário
  showCreateUserModal(): void {
    this.selectedUserForEdit = null;
    this.displayUserModal = true;
  }

  showEditUserModal(user: UserInterface): void {
    this.selectedUserForEdit = user;
    this.displayUserModal = true;
  }

  showDeleteUserModal(id: string): void {
    this.userIdForDelete = id;
    this.displayDeleteUserModal = true;
  }

  // Esconde o modal (chamado pelo evento do filho)
  hideUserModal(): void {
    this.selectedUserForEdit = null;
    this.displayUserModal = false;
  }

  hideDeleteUserModal(): void {
    this.displayDeleteUserModal = false;
  }

  // Processa o salvamento (chamado pelo evento do filho)
  handleUser(userData: UserInterface): void {
    if(userData.public_id) {
      console.log('Editando usuário!', userData);
      this.adminService.updateUser(userData.public_id, userData).subscribe({
        next: () => { this.loadUsers(); },
        error: (err) => { console.log('Erro ao editar usuário.', err) },
      });
    }else {
      console.log('Criando usuário!');
      this.adminService.createUser(userData).subscribe({
        next: () => { this.loadUsers(); },
        error: (err) => console.error('Erro ao criar usuário', err)
      });
    }
    this.hideUserModal();
  }

  deleteUser():void {
    this.adminService.deleteUser(this.userIdForDelete).subscribe({
      next: () => {
        console.log('Usuário deletado com sucesso!');
        this.hideDeleteUserModal();
        this.loadUsers();
      },
      error: (err) => console.log('Erro ao deletar usuário', err)
    });

    this.hideDeleteUserModal();
  }

  // BUTTON DARK MODE
  // toggleDarkMode() {
  //   const element = document.querySelector('html');
  //   if(element) {
  //     element.classList.toggle('my-app-dark');
  //   }
  // }

  // Função para formatar os papéis em uma string simples
  // formatRoles(roles: { nome: string }[]): string {
  //   return roles.map(role => role.nome).join(', ');
  // }

}
