import { NgModule } from '@angular/core';
import { SinfotoPipe } from './sinfoto/sinfoto';
import { SplicenamePipe } from './splicename/splicename';
@NgModule({
	declarations: [SinfotoPipe,
    SplicenamePipe],
	imports: [],
	exports: [SinfotoPipe,
    SplicenamePipe]
})
export class PipesModule {}
