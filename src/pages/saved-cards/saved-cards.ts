import { Component } from '@angular/core';
import { IonicPage, ToastController, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebasepro';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { User, Card } from '../../providers/interfaces';
import { Observable } from 'rxjs/Observable';
import { BrowserTab } from '@ionic-native/browser-tab';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
// import { SocialSharing } from '@ionic-native/social-sharing';





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
  constructor( private fireS: FirebaseProvider, public toast: ToastController, private browserChrome: BrowserTab, private themeable: ThemeableBrowser, private firestore: AngularFirestore, public loading: LoadingController, private fire: FirebaseProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.msgsharing = 'Compartido App la increible App sin nombre';
    
  }

  ionViewDidLoad() {

  
      this.UserCollection = this.firestore.collection<User>('users').doc(this.fireS.currentUserId).collection('saved_cards');
      this.cardsUsers = this.UserCollection.valueChanges();

  

    
  }

  

  trackByFn(index: number) {
    return index != null ? index : null;
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



  // socialSharingFacebook(url_articulo: string, title: string, description: string, url_img: string) {

  //   this.loadingSharingMethod()

  //   const titulo = title;
  //   const finalUper = titulo.toUpperCase();


  //   const msg = finalUper + ' ' + description + ' ' + this.msgsharing;
  //   this.sharing.shareViaFacebook(msg, null, url_articulo).then((data) => {
  //     console.log(data);

  //     this.loadingSharing.dismiss();
  //   }).catch((data) => {
  //     console.log(data);

  //     this.loadingSharing.dismiss();
  //   })
  // }

  // socialSharingTwitter(url_articulo: string, title: string, description: string, url_img: string) {

  //   this.loadingSharingMethod();

  //   const titulo = title;
  //   const finalUper = titulo.toUpperCase();


  //   const msg = finalUper + ' ' + description + ' ' + this.msgsharing;
  //   this.sharing.shareViaTwitter(msg, url_img, url_articulo).then((data) => {
  //     console.log(data);
  //     this.loadingSharing.dismiss();
  //   }).catch((data) => {
  //     console.log(data);

  //     this.loadingSharing.dismiss();
  //   })
  // }

  // socialSharingWhatsApp(url_articulo: string, title: string, description: string, url_img: string) {

  //   this.loadingSharingMethod();


  //   const titulo = title;
  //   const finalUper = titulo.toUpperCase();


  //   const msg = finalUper + ' ' + description + ' ' + this.msgsharing;
  //   this.sharing.shareViaWhatsApp(msg, url_img, url_articulo).then((data) => {
  //     console.log(data);

  //     this.loadingSharing.dismiss();
  //   }).catch((data) => {
  //     console.log(data);

  //     this.loadingSharing.dismiss();
  //   })
  // }
}
