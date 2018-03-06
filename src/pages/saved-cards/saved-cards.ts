import { Component } from '@angular/core';
import { IonicPage, ToastController, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebasepro';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { User, Card } from '../../providers/interfaces';
import { Observable } from 'rxjs/Observable';
import { BrowserTab } from '@ionic-native/browser-tab';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { SocialSharing } from '@ionic-native/social-sharing';





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
  loadingSharing:any;
  msgsharing: string;
      //private sharing: SocialSharing
  constructor( private fireS: FirebaseProvider, 
    public toast: ToastController, 
    private browserChrome: BrowserTab, 
    private themeable: ThemeableBrowser, 
    private firestore: AngularFirestore, 
    public loading: LoadingController, 
    private fire: FirebaseProvider, 
    public navCtrl: NavController, 
    private sharing: SocialSharing, 
    public navParams: NavParams) {
    this.msgsharing = 'Compartido App la increible App sin nombre';
    
  }

  ionViewDidLoad() {

  
      this.UserCollection = this.firestore.collection<User>('users').doc(this.fireS.currentUserId).collection('saved_cards');
      this.cardsUsers = this.UserCollection.valueChanges();
    
  }

  

  trackByFn(index: number, card) {
    return card.id;
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


  openUrl(url) {
    this.browserChrome.isAvailable().then((isAvailable: boolean) => {

      if (isAvailable) {
        this.browserChrome.openUrl(url);
      } else {
        this.themeable.create(url, '_blank', {})
      }
    })
  }

  deleleteCard(idCard) {

    const toast = this.toast.create({
      message: 'Articulo eliminado correctamente',
      duration: 2500,
      position: 'top'
    });

    toast.present();

    const refLikeCard = this.firestore.collection('cards')
    .doc(idCard)
    .collection('likes')
    .doc(`${this.fireS.currentUserId }_${ idCard }`);

    refLikeCard.update({like: false});


    const refUserSave = this.firestore.collection('users')
    .doc(this.fireS.currentUserId)
    .collection('saved_cards')
    .doc(`${ this.fireS.currentUserId }_${ idCard }`);

    refUserSave.delete();

  
  }

  loadingSharingMethod() {
    this.loadingSharing = this.loading.create({
      content: 'Preparando para compartir...'
    })

    this.loadingSharing.present();
  }


  share(title: string, url_img: string, url: string) {

    this.loadingSharingMethod();

    this.sharing.share(this.msgsharing, title, null, url)
      .then(data => {
        this.loadingSharing.dismiss();
        console.log(data);

      }).catch(err => {

        this.loadingSharing.dismiss();

        console.log(err);
      })

  }

  
}
