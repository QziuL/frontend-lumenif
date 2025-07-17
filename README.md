# LumenIF Frontend

Este é o frontend do projeto LumenIF, desenvolvido com Angular, utilizando a biblioteca de componentes PrimeNG e consumindo uma API backend em Laravel.

## Sobre o Projeto

O LumenIF é uma plataforma de cursos online, onde os usuários podem se inscrever, acessar cursos e os administradores podem gerenciar o conteúdo e os usuários.

Projeto desenvolvido para a matéria de Desenvolvimento Web II, do curso de TADS.


## Tecnologias Utilizadas

*   **Angular**: Framework para desenvolvimento de aplicações web.
*   **PrimeNG**: Biblioteca de componentes UI para Angular.
*   **TypeScript**: Superset do JavaScript que adiciona tipagem estática.

## Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:

*   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
*   [Angular CLI](https://angular.io/cli) (versão 18 ou superior)

## Como Executar o Projeto

1.  **Clone o repositório:**

    ```bash
    git clone <url-do-repositorio>
    ```

2.  **Acesse o diretório do projeto:**

    ```bash
    cd lumenif-frontend
    ```

3.  **Instale as dependências:**

    ```bash
    npm install
    ```

4.  **Execute a aplicação:**

    ```bash
    ng serve
    ```

A aplicação estará disponível em `http://localhost:4200/`.

## Estrutura do Projeto

A estrutura de pastas do projeto segue o padrão do Angular CLI:

```
/src
|-- /app
|   |-- /components (Componentes reutilizáveis)
|   |-- /guards (Guards de rota)
|   |-- /interceptors (Interceptors HTTP)
|   |-- /interfaces (Interfaces de dados)
|   |-- /pages (Páginas da aplicação)
|   |-- /services (Serviços de dados)
|-- /assets (Arquivos estáticos)
|-- /environments (Configurações de ambiente)
```

## Scripts Disponíveis

No arquivo `package.json`, os seguintes scripts estão disponíveis:

*   `ng serve`: Executa a aplicação em modo de desenvolvimento.
*   `ng build`: Compila a aplicação para produção.
*   `ng test`: Executa os testes unitários.
*   `ng watch`: Compila a aplicação em modo de desenvolvimento e observa as alterações nos arquivos.

## Consumo da API

A aplicação consome uma API que deve estar em execução. A URL da API é configurada no arquivo `src/environments/environment.ts`.

**URL da API em desenvolvimento:**

`http://127.0.0.1:8000/api`

Certifique-se de que o backend esteja rodando nesta URL para que o frontend funcione corretamente.
