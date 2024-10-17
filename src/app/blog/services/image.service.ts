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

  public uploadImage(file: File, content: string): void {
    const formData = new FormData();
    formData.append('image', file);

    this.httpClient.post<{ filename: string }>(this.apiUrl + '/upload-image', formData).subscribe(
      response => {
        const imageUrl = this.imageDirectory + response.filename;
        const markdownImage = `![](${imageUrl})`;
        this.insertTextAtCursor(markdownImage, content);
      },
      error => {
        console.error('Error uploading image:', error);
      }
    );
  }
  insertTextAtCursor(text: string, content: string): void {
    const textarea = document.querySelector('.blog-edit-input') as HTMLTextAreaElement;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const textBefore = content.substring(0, startPos);
    const textAfter = content.substring(endPos, content.length);

    content = textBefore + text + textAfter;
    textarea.selectionStart = textarea.selectionEnd = startPos + text.length;
    textarea.focus();
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
