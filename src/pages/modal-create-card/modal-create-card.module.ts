import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCreateCardPage } from './modal-create-card';
import { PipesModule } from './../../pipes/pipes.module';


@NgModule({
  declarations: [
    ModalCreateCardPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ModalCreateCardPage),
  ],
})
export class ModalCreateCardPageModule {}
