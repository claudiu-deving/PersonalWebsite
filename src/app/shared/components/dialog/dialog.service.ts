import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DialogComponent } from './dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}
  public result = new Subject<boolean>();

  waitForResult(): Observable<boolean> {
    return this.result;
  }
  dialogComponentRef!: ComponentRef<DialogComponent>;
  open(): Observable<boolean> {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
    const componentRef = componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);

    this.dialogComponentRef = componentRef;

    const subject = new Subject<boolean>();
    this.dialogComponentRef.instance.close.subscribe((result: boolean) => {
      this.removeDialogComponentFromBody();
      subject.next(result);
      subject.complete();
    });

    return subject.asObservable();
  }

  private removeDialogComponentFromBody() {
    this.appRef.detachView(this.dialogComponentRef.hostView);
    this.dialogComponentRef.destroy();
  }
}
