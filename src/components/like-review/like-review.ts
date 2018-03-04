import { Component, Input, OnInit, ChangeDetectorRef, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FavProvider } from '../../providers/fav/fav';
import { Card } from '../../providers/interfaces';
import { AngularFirestore } from 'angularfire2/firestore';

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

  @Input() userId: string ;
  @Input() cardId: string;

  likesObservable: Observable<any>;


  public liked: boolean;




  constructor(private fav: FavProvider, private af: AngularFirestore, private cfRef: ChangeDetectorRef) {
    console.log('Hello LikeReviewComponent Component');
  }


  ngAfterViewChecked()
{
  this.cfRef.detectChanges();
}



get mycardId(): string {

  return this.cardId;

}

get myuserId(): string {

  return this.userId;

}

ngOnChanges(changes: SimpleChanges) {
  
  this.likesObservable = this.fav.getUserLike(this.myuserId, this.cardId);

  const sus = this.likesObservable.subscribe(data => {
    console.log(data);
    
  })
  
}
  ngOnInit() {
 




  }


  likeHandler(value: string) {

    
    let like: boolean;

    if (value == 'true') {

      like = false;

      const refUser = this.af.collection('users')
      .doc(this.myuserId)
      .collection('saved_cards')
      .doc(`${this.myuserId}_${this.mycardId }`);

      refUser.delete();

    } else {

      like = true;

      const userPath = `users/${ this.myuserId }/saved_cards/${ this.myuserId }_${ this.mycardId }`;


      const docCard = this.af.doc(`cards/${this.mycardId}`).ref

      docCard
      .get()
      .then(( query )=> {
          const card = query.data();
          this.af.doc(userPath).set(card);
      })

    }

    this.fav.setLike(this.userId, this.mycardId, like);

  }

}
