import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { PipesModule } from './../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    HomePage,
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