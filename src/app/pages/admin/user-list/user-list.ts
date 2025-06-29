import {Component, OnInit} from '@angular/core';
import {AdminService} from '../../../services/admin/admin-service';
import {UserInterface} from '../../../interfaces/user-interface';
import {ButtonModule} from 'primeng/button';
import { TableModule } from 'primeng/table';
import {Ripple} from 'primeng/ripple';
import {WindowMaximizeIcon} from 'primeng/icons';
import {Tag} from 'primeng/tag';
import {Tooltip} from 'primeng/tooltip';


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
    Ripple,
    WindowMaximizeIcon,
    Tag,
    Tooltip,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {
  users: UserInterface[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  // Mock de usuarios para testes
  mockUsers: UserInterface[] = [
    { public_id: '82723', name: 'Admin LumenIF', email: 'admin@lumenif.com', roles: [{id: 1, name: 'ADMIN'}] },
    { public_id: '82724', name: 'Criador Exemplo', email: 'criador@lumenif.com', roles: [{id: 2, name: 'CRIADOR'}] },
    { public_id: '82725', name: 'Ana Silva', email: 'ana.silva@email.com', roles: [{id: 3, name: 'ALUNO'}] },
    { public_id: '82726', name: 'Bruno Costa', email: 'bruno.costa@email.com', roles: [{id: 3, name: 'ALUNO'}] },
    { public_id: '82727', name: 'Carla Dias', email: 'carla.dias@email.com', roles: [{id: 3, name: 'ALUNO'}]},
    { public_id: '82728', name: 'Carla Meses', email: 'carla.meses@email.com', roles: [{id: 3, name: 'ALUNO'}]},
    { public_id: '82729', name: 'Carla Anos', email: 'carla.anos@email.com', roles: [{id: 3, name: 'ALUNO'}]},
    { public_id: '82730', name: 'Carla Décadas', email: 'carla.decadas@email.com', roles: [{id: 3, name: 'ALUNO'}]},
    { public_id: '82731', name: 'Carla Séculos', email: 'carla.seculos@email.com', roles: [{id: 3, name: 'ALUNO'}]},
    { public_id: '82732', name: 'Carla Milênios', email: 'carla.milenios@email.com', roles: [{id: 3, name: 'ALUNO'}]},
  ];

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
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível carregar a lista de usuários.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Função para formatar os papéis em uma string simples
  formatRoles(roles: { nome: string }[]): string {
    return roles.map(role => role.nome).join(', ');
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

  // Métodos de placeholder para as ações de CRUD
  editUser(id: number): void {
    console.log(`Admin quer editar o usuário com ID: ${id}`);
    // Futuramente, aqui você navegaria para a página de edição de usuário
  }

  deleteUser(id: number): void {
    console.log(`Admin quer excluir o usuário com ID: ${id}`);
    // Futuramente, aqui você abriria um modal de confirmação
  }

  // BUTTON DARK MODE
  toggleDarkMode() {
    const element = document.querySelector('html');
    if(element) {
      element.classList.toggle('my-app-dark');
    }
  }

}
