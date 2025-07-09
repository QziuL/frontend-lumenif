import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreatorService {
  private apiUrl = `${environment.apiUrl}/creator`;

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/courses`, courseData);
  }
}
