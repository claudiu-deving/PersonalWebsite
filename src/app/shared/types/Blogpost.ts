export class BlogPost {
  public title: string = '';
  public content: string = '';
  public created: string = '';

  constructor(title: string, content: string, created: string) {
    this.title = title;
    this.content = content;
    this.created = created;
  }
}
