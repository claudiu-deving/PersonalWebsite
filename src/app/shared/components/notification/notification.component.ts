import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="notification" 
         [@slideInOut]
         [ngClass]="{'success': notification.type === 'success', 'error': notification.type === 'error'}"
         class="notification">
      <div class="content">
        {{ notification.message }}
        <button class="close-btn" (click)="closeNotification()">×</button>
      </div>
      <div class="progress-bar" [style.width.%]="progressWidth"></div>
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 15px;
      border-radius: 4px;
      color: white;
      font-weight: bold;
      z-index: 1000;
      min-width: 300px;
      max-width: 80%;
    }
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .success {
      background-color: #4CAF50;
    }
    .error {
      background-color: #f44336;
    }
    .progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      background-color: rgba(255, 255, 255, 0.7);
    }
    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      margin-left: 10px;
    }
  `],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification: Notification | null = null;
  progressWidth: number = 100;
  private subscription: Subscription | null = null;
  private timerSubscription: Subscription | null = null;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.subscription = this.notificationService.notification$.subscribe(notification => {
      this.showNotification(notification);
    });
  }

  ngOnDestroy() {
    this.clearSubscriptions();
  }

  private showNotification(notification: Notification) {
    this.clearSubscriptions();
    this.notification = notification;
    this.progressWidth = 100;

    const timerInterval = 100; // Update progress every 100ms
    const steps = notification.duration / timerInterval;

    this.timerSubscription = timer(0, timerInterval).subscribe((step) => {
      this.progressWidth = 100 - (step * 100) / steps;

      if (step >= steps) {
        this.closeNotification();
      }
    });
  }

  closeNotification() {
    this.notification = null;
    this.clearSubscriptions();
  }

  private clearSubscriptions() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }
}