import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebasepro';

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

  constructor(public loading: LoadingController, private fire: FirebaseProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SavedCardsPage');
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
