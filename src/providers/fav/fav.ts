import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Like, Card } from '../interfaces';
import { Observable } from 'rxjs/Observable';


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
  getUserLike(userId, cardId): Observable<Like> {

    const cardsRef : AngularFirestoreCollection<Card> = this.afs.collection<Card>('cards');
    
    const likesRef:  AngularFirestoreDocument<any> = cardsRef
    .doc(cardId)
    .collection<Like>('likes')
    .doc(`${userId}_${cardId}`);
    
    return likesRef.valueChanges();
  }


  

  setLike(userId, card: Card, like) {
    
    const likeObject = { userId , like };

    const likePath = `cards/${ card.id }/likes/${ userId }_${ card.id }`;




    return this.afs.doc(likePath).set(likeObject);

  }



}
