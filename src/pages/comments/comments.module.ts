import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentsPage } from './comments';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';


@NgModule({
  declarations: [
    CommentsPage,
  ],
  imports: [
    DirectivesModule,
    PipesModule,
    IonicPageModule.forChild(CommentsPage),
  ],
})
export class CommentsPageModule {}
