import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = environment.apiUrl;
  private imageDirectory = environment.imageDirectory;

  constructor(private httpClient: HttpClient) { }

  public uploadImage(file: File): any {
    const formData = new FormData();
    formData.append('image', file);

    return this.httpClient.post<{ filename: string }>(this.apiUrl + '/upload-image', formData).pipe(
      map(response => {
        const imageUrl = this.imageDirectory + response.filename;
        const markdownImage = `![](${imageUrl})`;
        return { markdownImage: markdownImage };
      })
    );
  }


  public uploadHeroImage(file: File, id: number): any {
    const formData = new FormData();
    formData.append('FormFile', file);
    formData.append('BlogPostId', id.toString());

    return this.httpClient.post<{ filename: string }>(this.apiUrl + '/upload-image-hero', formData).pipe(
      map(response => {
        return { filePath: this.imageDirectory + response.filename, showHeroImage: true };
      })
    );
  }
}

class ImageUploadResponseDto {
  filePath: string = '';
  showHeroImage: boolean = false;
}
