import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { PipesModule } from './../../pipes/pipes.module';
import { TimeAgoPipe } from 'time-ago-pipe';


@NgModule({
  declarations: [
    HomePage,
    TimeAgoPipe
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(HomePage),
  ],
  exports: [
    HomePage
  ]
})
export class TutorialPageModule { }