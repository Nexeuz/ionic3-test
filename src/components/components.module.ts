import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { LikeReviewComponent } from './like-review/like-review';
import { IonicModule } from "ionic-angular";

@NgModule({
	declarations: [LikeReviewComponent],
	imports: [IonicModule],
	exports: [LikeReviewComponent],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule {}
