import { Component, Input, OnInit, ChangeDetectorRef, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FavProvider } from '../../providers/fav/fav';
import { AngularFirestore } from 'angularfire2/firestore';
import { FirebaseProvider } from '../../providers/firebase/firebasepro';

/**
 * Generated class for the LikeReviewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'like-review',
  templateUrl: 'like-review.html'
})
export class LikeReviewComponent implements OnInit, AfterViewChecked, OnChanges {

  @Input() cardId: string;

  likesObservable: Observable<any>;


  public liked: boolean;




  constructor(private fireS: FirebaseProvider, private fav: FavProvider, private af: AngularFirestore, private cfRef: ChangeDetectorRef) {
    console.log('Hello LikeReviewComponent Component');
  }


  ngAfterViewChecked()
{
  this.cfRef.detectChanges();
}



get mycardId(): string {

  return this.cardId;

}



ngOnChanges(changes: SimpleChanges) {


  // debugger
  this.likesObservable = this.fav.getUserLike(this.fireS.currentUserId, this.cardId);


  
}
  ngOnInit() {
 




  }


  likeHandler(value: string) {

    // debugger
    let like: boolean;

    if (value == 'true') {

      like = false;

      const refUser = this.af.collection('users')
      .doc(this.fireS.currentUserId )
      .collection('saved_cards')
      .doc(`${ this.fireS.currentUserId }_${ this.mycardId }`);

      refUser.delete();

    } else {

      like = true;

      const userPath = `users/${ this.fireS.currentUserId }/saved_cards/${ this.fireS.currentUserId }_${ this.mycardId }`;


      const docCard = this.af.doc(`cards/${this.mycardId}`).ref

      docCard
      .get()
      .then(( query )=> {
          const card = query.data();
          this.af.doc(userPath).set(card);
      })

    }

    this.fav.setLike(this.fireS.currentUserId, this.mycardId, like);

  }

}
