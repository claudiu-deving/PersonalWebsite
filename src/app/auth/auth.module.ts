import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoggerComponent } from './components/logger/logger.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SharedModule } from '../shared/shared.module';
import { RegisterFormComponent } from './components/register-form/register-form.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [
    AuthComponent,
    LoggerComponent,
    LoginFormComponent,
    RegisterFormComponent,
  ],
  exports: [AuthComponent, LoginFormComponent],
})
export class AuthModule {}
