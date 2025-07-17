export interface PublicCourseInterface {
  public_id: string;
  title: string;
  description: string;
  status: string;
  is_enrolled?: boolean;
  modules: Module[];
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
  contents: ContentClasse[];
}

export interface ContentClasse {
  public_id: string;
  content_type: {
    id: number;
    name: 'Video' | 'Text' | 'File' | 'Image'; // Tipagem forte para o nome
  };
  content: { // O objeto JSON com os dados
    url_content?: string;
    duration_seconds?: number;
    text_content?: string;
    file_path?: string;
    file_name?: string;
  };
  order: number;
}

