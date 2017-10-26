import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedCardsPage } from './saved-cards';
import { PipesModule } from './../../pipes/pipes.module';

@NgModule({
  declarations: [
    SavedCardsPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(SavedCardsPage),
  ],
})
export class SavedCardsPageModule {}
