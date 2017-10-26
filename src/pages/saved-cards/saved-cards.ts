import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebasepro';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { User, Card } from '../../providers/interfaces';
import { Observable } from 'rxjs/Observable';




/**
 * Generated class for the SavedCardsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-saved-cards',
  templateUrl: 'saved-cards.html',

})
export class SavedCardsPage {

  private UserCollection: AngularFirestoreCollection<Card>;
  cardsUsers: Observable<Card[]>;
  cardsArray = [];


  constructor(private firestore: AngularFirestore, public loading: LoadingController, private fire: FirebaseProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

      this.fire.afAuth.authState.subscribe(data => {
        this.UserCollection = this.firestore.collection<User>('users').doc(data.uid).collection('favs');
        this.cardsUsers = this.UserCollection.valueChanges();
        this.cardsUsers.subscribe(data => {
          this.cardsArray = data;
          console.log(data);
          
        })

      })
  
  }
  logout() {

    const loader = this.loading.create({
      content: 'Deslogeando...'
    });

    loader.present();

    this.fire.signOut().then(() => {
      loader.dismiss();
    });
  }
}
