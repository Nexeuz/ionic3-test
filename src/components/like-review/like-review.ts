import { Component, Input, OnInit } from '@angular/core';
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
export class LikeReviewComponent implements OnInit {

  @Input() userId;
  @Input() card: Card;

  likesObservable: Observable<any>;


  public liked: boolean;




  constructor(private fav: FavProvider, private af: AngularFirestore) {
    console.log('Hello LikeReviewComponent Component');
  }

  ngOnInit() {

    this.likesObservable = this.fav.getUserLike(this.userId, this.card.id);
  }


  likeHandler(value: string) {
    
    let like: boolean;

    if (value == 'true') {

      like = false;

      const refUser = this.af.collection('users')
      .doc(this.userId)
      .collection('saved_cards')
      .doc(`${this.userId}_${this.card.id}`);

      refUser.delete();

    } else {

      like = true;

      const userPath = `users/${ this.userId }/saved_cards/${ this.userId }_${ this.card.id }`;

      this.af.doc(userPath).set(this.card);

    }


    this.fav.setLike(this.userId, this.card, like);

  }

}
