import { NgModule } from '@angular/core';
import { SinfotoPipe } from './sinfoto/sinfoto';
import { SplicenamePipe } from './splicename/splicename';
import { MaxLengthTextPipe } from './max-length-text/max-length-text';
@NgModule({
	declarations: [SinfotoPipe,
    SplicenamePipe,
    MaxLengthTextPipe],
	imports: [],
	exports: [SinfotoPipe,
    SplicenamePipe,
    MaxLengthTextPipe]
})
export class PipesModule {}
