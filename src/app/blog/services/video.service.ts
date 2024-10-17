import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  constructor(private http: HttpClient) { }

  uploadVideo(file: File, blogId: number): Observable<any> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('blogId', blogId.toString());

    return this.http.post(`${environment.apiUrl}/upload-video`, formData);
  }
}