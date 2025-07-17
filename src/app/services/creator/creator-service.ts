import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface CreatorKpis {
  totalCursos: number;
  totalAlunos: number;
  avaliacaoMedia: number;
}

@Injectable({
  providedIn: 'root'
})
export class CreatorService {
  private apiUrl = `${environment.apiUrl}/creator`;

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses`);
  }

  getOneCourse(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/courses`, courseData);
  }

  editCourse(courseData: any, id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/courses/${id}`, courseData);
  }

  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/courses/${courseId}`);
  }

  createModule(moduleData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/courses/modules`, moduleData);
  }

  deleteModule(moduleId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/courses/modules/${moduleId}`);
  }

  createClasse(classeData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/courses/modules/classes`, classeData);
  }

  deleteClasse(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/courses/modules/classes/${id}`);
  }

  getCourseStatusStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stats/course-status`);
  }

  getTopCoursesStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stats/top-courses`);
  }

  getDashboardKpis(): Observable<CreatorKpis> {
    return this.http.get<CreatorKpis>(`${this.apiUrl}/stats/kpis`);
  }

  getContentTypes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/content-types`);
  }
}
