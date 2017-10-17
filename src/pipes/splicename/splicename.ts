import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SplicenamePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'splicename',
})
export class SplicenamePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    const fullname = value.split(' ');
    return fullname[0];
  }
}
