import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) {}

  get(loadOptions: any): Observable<any[]> {
    const page = (loadOptions.skip ?? 0) / (loadOptions.take ?? 6) + 1;
    const pageSize = loadOptions.take ?? 6;

    return this.http.get<any[]>(`${this.apiUrl}?page=${page}&per_page=${pageSize}`);
  }

  insert(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  update(key: number, values: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${key}`, values);
  }

  remove(key: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${key}`);
  }
}