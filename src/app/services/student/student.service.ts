import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  enroll(course_id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${course_id}/registration`, {});
  }

  getEnrolledCourseContent(course_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses/${course_id}/registration`)
  }
}
