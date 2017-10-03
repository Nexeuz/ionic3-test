import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignInEmailPage } from './sign-in-email';

@NgModule({
  declarations: [
    SignInEmailPage,
  ],
  imports: [
    IonicPageModule.forChild(SignInEmailPage),
  ],
  exports: [
    SignInEmailPage
  ]
})
export class TutorialPageModule { }