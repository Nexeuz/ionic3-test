import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the MaxLengthTextPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'maxLengthText',
})
export class MaxLengthTextPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string): string {
    const max = value.substr(0, 100);
    return max + '...';
  }
}
