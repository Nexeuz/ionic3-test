import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SinfotoPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sinfoto',
})
export class SinfotoPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    const img = 'assets/img/noimage.png';
    if(!value){
      return img;
    }
    return value;
  }
}
