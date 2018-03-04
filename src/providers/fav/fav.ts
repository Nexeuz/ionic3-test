import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Like, Card } from '../interfaces';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';


/*
  Generated class for the FavProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavProvider {

  constructor(private afs: AngularFirestore) {
    console.log('Hello FavProvider Provider');
  }


/**
 * function to retrive from firebase user Like for card.
 * 
 * @param userId uid user from firebase
 * 
 * @param cardId id card generated form collection cards firebase cards/{cardId}
 *  
 */
  getUserLike(userId, cardId): Observable<any> {

    const cardsRef : AngularFirestoreCollection<Card> = this.afs.collection<Card>('cards');
    
    const refLike = cardsRef.doc(cardId).collection<Like>('likes').doc(`${userId}_${cardId}`);
    
    return refLike.valueChanges()
    .pipe(
      map((like: Like) => {
      if(like == null) {
        return false;
      }else{
        return like.like;
      }
    }));
  }

  setLike(userId, cardid, like) {
    
    const likeObject = { userId , like };

    const likePath = `cards/${ cardid }/likes/${ userId }_${ cardid }`;

    return this.afs.doc(likePath).set(likeObject);

  }



}
