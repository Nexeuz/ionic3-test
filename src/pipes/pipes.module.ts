import { NgModule } from '@angular/core';
import { SinfotoPipe } from './sinfoto/sinfoto';
import { SplicenamePipe } from './splicename/splicename';
import { MaxLengthTextPipe } from './max-length-text/max-length-text';
import { TimeAgoPipe } from 'time-ago-pipe';

@NgModule({
	declarations: [SinfotoPipe,
    SplicenamePipe,
    TimeAgoPipe,
    MaxLengthTextPipe],
	imports: [],
	exports: [SinfotoPipe,
    SplicenamePipe,
    TimeAgoPipe,
    MaxLengthTextPipe]
})
export class PipesModule {}
