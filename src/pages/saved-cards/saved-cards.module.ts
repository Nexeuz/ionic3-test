import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedCardsPage } from './saved-cards';

@NgModule({
  declarations: [
    SavedCardsPage,
  ],
  imports: [
    IonicPageModule.forChild(SavedCardsPage),
  ],
})
export class SavedCardsPageModule {}
