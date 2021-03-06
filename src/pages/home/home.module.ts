import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { PipesModule } from './../../pipes/pipes.module';
import { TimeAgoPipe } from 'time-ago-pipe';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    HomePage,
    TimeAgoPipe
  ],
  imports: [
    PipesModule,
    ComponentsModule,
    IonicPageModule.forChild(HomePage),
  ],
  exports: [
    HomePage
  ]
})
export class TutorialPageModule { }