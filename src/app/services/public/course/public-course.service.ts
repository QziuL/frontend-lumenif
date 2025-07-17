import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Course} from '../../../interfaces/course-model-interface';

@Injectable({
  providedIn: 'root'
})
export class PublicCourseService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getApprovedCourses(): Observable<any> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  getCourseByPublicId(publicId: string): Observable<any> {
    return this.http.get<Course>(`${this.apiUrl}/courses/${publicId}`);
  }
}
