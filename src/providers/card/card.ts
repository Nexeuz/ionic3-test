import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
// import { Angu  } from 'angularfire2/';


/*
  Generated class for the CardProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CardProvider {

  constructor() {
    console.log('Hello CardProvider Provider');
  }
  // getCards(nodo, lastKey?) {
  //   const query =  {
  //      orderByKey: true,
  //      limitToFirst: nodo,
  //   };

  //   if (lastKey) {
  //     query['startAt'] = lastKey;
  //   } 
  //   return this.db.list('/cards', {
  //     query
  //   })
  // }

}
