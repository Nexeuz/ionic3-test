import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebasepro';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';
import { LoadingController } from 'ionic-angular';
import { BrowserTab } from '@ionic-native/browser-tab';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { query, stagger, trigger, transition, style, animate } from '@angular/animations';
import { Like, User, Card } from '../../providers/interfaces';
import { PaginationProvider } from '../../providers/pagination/pagination';


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
export class HomePage implements OnInit {

  msgsharing;

  usersDocref: AngularFirestoreDocument<User>;
  user$: Observable<User>;

  loadingSharing: any;

  cardsCollection: AngularFirestoreCollection<Card>;
  cards: Observable<Card[]>;

  refFav: AngularFirestoreDocument<Like>
  refLikes;
  streamFav: Observable<Like>;
  changesLike: Observable<Like>;
  likeArray = [];

  uid: string;

  categoria: any;



  constructor(public page: PaginationProvider, private params: NavParams, private themeable: ThemeableBrowser, private loading: LoadingController, private sharing: SocialSharing, private browserChrome: BrowserTab, public firebase: FirebaseProvider, private firestore: AngularFirestore, public navCtrl: NavController) {
    this.msgsharing = 'Compartido App la increible App sin nombre';


    this.categoria = this.params.data;



    console.log('categoria es', this.categoria);


  }

  ngOnInit() {
  }



  ionViewDidLoad() {
    this.firebase.afAuth.authState.subscribe(data => {
      this.uid = data.uid;
      this.usersDocref = this.firestore.doc<User>(`users/${this.uid}`);
      this.user$ = this.usersDocref.valueChanges();


      
    });



      this.page.init('cards', 'date', { reverse: false, prepend: false })

    

  }

  trackByFn(index: number) {
    return index != null ? index : null;
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

  socialSharingFacebook(url_articulo: string, title: string, description: string, url_img: string) {

    this.loadingSharingMethod()

    const titulo = title;
    const finalUper = titulo.toUpperCase();


    const msg = finalUper + ' ' + description + ' ' + this.msgsharing;
    this.sharing.shareViaFacebook(msg, null, url_articulo).then((data) => {
      console.log(data);

      this.loadingSharing.dismiss();
    }).catch((data) => {
      console.log(data);

      this.loadingSharing.dismiss();
    })
  }

  socialSharingTwitter(url_articulo: string, title: string, description: string, url_img: string) {

    this.loadingSharingMethod();

    const titulo = title;
    const finalUper = titulo.toUpperCase();


    const msg = finalUper + ' ' + description + ' ' + this.msgsharing;
    this.sharing.shareViaTwitter(msg, url_img, url_articulo).then((data) => {
      console.log(data);
      this.loadingSharing.dismiss();
    }).catch((data) => {
      console.log(data);

      this.loadingSharing.dismiss();
    })
  }

  socialSharingWhatsApp(url_articulo: string, title: string, description: string, url_img: string) {

    this.loadingSharingMethod();


    const titulo = title;
    const finalUper = titulo.toUpperCase();


    const msg = finalUper + ' ' + description + ' ' + this.msgsharing;
    this.sharing.shareViaWhatsApp(msg, url_img, url_articulo).then((data) => {
      console.log(data);

      this.loadingSharing.dismiss();
    }).catch((data) => {
      console.log(data);

      this.loadingSharing.dismiss();
    })
  }



}
