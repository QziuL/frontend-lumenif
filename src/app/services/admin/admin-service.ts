import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }

  getAllCourses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses`);
  }

  getAllCoursesApproved(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses-approved`);
  }

  getAllCoursesPending(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses-pending`);
  }

  approveCourse(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/courses/${id}/approve`, {});
  }

  rejectCourse(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/courses/${id}/reject`, {});
  }

  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/roles`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, userData);
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }
}
