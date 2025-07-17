export interface Course {
  public_id: string;
  title: string;
  description: string;
  status: string;
  modules: Module[];
  students: Student[];
}

export interface Module {
  public_id: string;
  title: string;
  order: number;
  lessons: Classe[];
}

export interface Classe {
  public_id: string;
  title: string;
  contents: JSON;
}

export interface Student {
  name: string;
  email: string;
  enrolled_at: string; // ou Date
}
