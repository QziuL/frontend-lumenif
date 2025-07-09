export interface CourseInterface {
  public_id: string; // Usando UUID
  title: string;
  description: string;
  // Para ter o total de alunos vinculados ao curso, é necessário
  // desenvolver o vinculo de aluno com curso no backend
  // studentCount: number;
  status: 'Aprovado' | 'Pendente' | 'Rejeitado';
}
