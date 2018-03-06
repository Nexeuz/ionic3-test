import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebasepro';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { LoadingController } from 'ionic-angular';
import { BrowserTab } from '@ionic-native/browser-tab';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { query, stagger, trigger, transition, style, animate } from '@angular/animations';
import { Card } from '../../providers/interfaces';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('cardsAnimation', [ //creamos el selector de animación
      transition('* => *', [ //establecer el tiempo entre transaciones en este caso seleccionamos los dos querys.
        query('ion-card', style({ transform: 'translateX(-100%)' }), { optional: true }), //posicion inicial de la animación 
        query('ion-card',
          stagger('600ms', [ // crea el intervalo de retraso segun la cantidad de items seleccionados dentro del contenedor.
            animate('900ms', style({ transform: 'translateX(0)' }))
          ]), { optional: true })
      ])
    ])
  ]
})
export class HomePage {

  msgsharing;


  loadingSharing: any;

  cardsCollection: AngularFirestoreCollection<Card>;
  cards: Observable<Card[]>;

  categoria: any;



  constructor(private params: NavParams, 
    private themeable: ThemeableBrowser, 
    private loading: LoadingController, 
    private sharing: SocialSharing, 
    private browserChrome: BrowserTab, 
    public firebase: FirebaseProvider, 
    private firestore: AngularFirestore, 
    public navCtrl: NavController) {
    this.msgsharing = 'Compartido App la increible App nexeuz';


    this.categoria = this.params.data;

    if (Object.keys(this.categoria).length == 0) {
      this.categoria = 'default';
    }

    console.log('categoria es', this.categoria);


  }





  ionViewDidLoad() {

    if (this.categoria === 'default') {
      this.cardsCollection = this.firestore.collection<Card>('cards', ref => ref.orderBy('date', 'desc'));

    } else {
      this.cardsCollection = this.firestore.collection<Card>('cards', ref => ref.orderBy('date', 'desc').where('category', '==', this.categoria));
    }

    this.cards = this.cardsCollection.valueChanges();



  }

  trackByFn(index: number, card) {
    return card.id;
  }


  // doInfinite(event) {
  //   debugger
  //   if(event.position === 'bottom') {
  //     this.page.more();
  //     event.complete();
  //   }

  // }



  openUrl(url) {
    this.browserChrome.isAvailable().then((isAvailable: boolean) => {
      if (isAvailable) {
        this.browserChrome.openUrl(url);
      } else {
        this.themeable.create(url, '_blank', {})
      }
    });
  }

  // migrated to dasboard

  // openCreateCard() {
  //   const MODAL = this.modal.create('ModalCreateCardPage');
  //   MODAL.present();
  // }

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
