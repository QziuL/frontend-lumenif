export interface CourseInterface {
  public_id: string; // Usando UUID
  title: string;
  description: string;
  status: 'Aprovado' | 'Pendente' | 'Rejeitado';
}
