import { Component } from '@angular/core';
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

  visible = false;
  msgsharing;
  nombre: string;

  usersDocref: AngularFirestoreDocument<User>;
  user$: Observable<User>;
  home;
  isAdmin;

  loadingSharing: any;

  cardsCollection: AngularFirestoreCollection<Card>;
  cards: Observable<Card[]>;
  cardsArray = [];

  refFav: AngularFirestoreDocument<Like>
  refLikes;
  streamFav: Observable<Like>;
  changesLike: Observable<Like>;
  likeArray = [];

  uid: string;

  categoria: any;



  constructor(private params: NavParams, private themeable: ThemeableBrowser, private loading: LoadingController, private sharing: SocialSharing, private browserChrome: BrowserTab, public firebase: FirebaseProvider, private firestore: AngularFirestore, public navCtrl: NavController) {
    this.msgsharing = 'Compartido App la increible App sin nombre';


    this.categoria = this.params.data;



    console.log('categoria es', this.categoria);


  }



  ionViewDidLoad() {
    this.firebase.afAuth.authState.subscribe(data => {
      this.uid = data.uid;
      this.usersDocref = this.firestore.doc(`users/${this.uid}`);
      this.user$ = this.usersDocref.valueChanges();
      this.user$.subscribe(data => {
        this.home = data;


      })
    });

    const catego = !Object.keys(this.categoria).length;

    if (this.categoria == 'default' || catego) {

      this.cardsCollection = this.firestore.collection<Card>('cards', ref => ref.orderBy('date', 'desc'));

      this.cards = this.cardsCollection.valueChanges();

      this.cards.subscribe(data => {
        this.cardsArray = data;
        for (let i = 0; i < this.cardsArray.length; i++) {


          this.refLikes = this.firestore.collection('cards').doc(this.cardsArray[i].id).collection('favs').doc(this.uid).ref;

          const sus = this.refLikes.get();

          sus.then(data => {
            console.log(data);

            if (data.exists) {
              const ref: AngularFirestoreDocument<any> = this.firestore.collection('cards').doc(this.cardsArray[i].id).collection('favs').doc(this.uid);
              this.changesLike = ref.valueChanges();

              const sus2 = this.changesLike.subscribe(likes => {
                this.likeArray.push(likes.like);
                sus2.unsubscribe();
              });
            } else {
              setTimeout(() => {
                this.likeArray.unshift(false);
              }, 60);

            }

            console.log('Array comparing', this.likeArray);
          });

        }

        console.log(data);
      });
    } else {
      this.cardsCollection = this.firestore.collection<Card>('cards', ref => {
        return ref 
               .where('category', '==', this.categoria)
               .orderBy('date', 'desc');
      });

      this.cards = this.cardsCollection.valueChanges();

      this.cards.subscribe(data => {
        this.cardsArray = data;

        for (let i = 0; i < this.cardsArray.length; i++) {


          this.refLikes = this.firestore.collection('cards').doc(this.cardsArray[i].id).collection('favs').doc(this.uid).ref;

          const sus = this.refLikes.get();

          sus.then(data => {
            console.log(data);

            if (data.exists) {
              const ref: AngularFirestoreDocument<any> = this.firestore.collection('cards').doc(this.cardsArray[i].id).collection('favs').doc(this.uid);
              this.changesLike = ref.valueChanges();

              const sus2 = this.changesLike.subscribe(likes => {
                this.likeArray.push(likes.like);
                sus2.unsubscribe();
                
              });
            } else {
              setTimeout(() => {
                this.likeArray.unshift(false);
              }, 60);

            }

            console.log('Array comparing', this.likeArray);
          }); // if exist

        }
      });
    }


  }

  saveCard(card, idCard, index) {
    console.log("this is card,", card, 'and this id', idCard);

    // almacenamos nuestra card para luego guararla

    // creamos la referencia para nuestro doc likes
    const refav = this.firestore.doc('cards/' + idCard + '/favs/' + this.uid).ref;


    //referecia para escuchar cambios en nuestro doc Like
    this.refFav = this.firestore.doc<Like>('cards/' + idCard + '/favs/' + this.uid);

    // referencia para nuestro documento liked users
    const refUser: AngularFirestoreDocument<User> = this.firestore.doc('users/' + this.uid + '/favs/' + idCard);


    // verificamos si la referencia existe.
    const getrefav = refav.get();
    getrefav.then(doc => {
      if (doc.exists) {
        this.streamFav = this.refFav.valueChanges();
        const sus = this.streamFav.subscribe(data => {

          if (data.like == true) { // si es igual a verdadero
            refav.update({ like: false, idcard: idCard }).then(() => {
              this.likeArray[index] = false; // poner falso
            });
            refUser.delete(); // borrar en guardados
            sus.unsubscribe();

          } else { //cuando es false
            refav.update({ like: true, idcard: idCard }).then(() => { // si es igual a falso
              this.likeArray[index] = true;  // poner true
            });
            refUser.set(card);
            sus.unsubscribe(); // unsuscribir
          }
        })
      } else {
        // si no existe
        // objeto like
        const likeObject = {
          like: true,
          userId: this.uid
        }

        refUser.set(card);

        refav.set(likeObject).then(() => { // crear doc
          this.likeArray[index] = true;   // poner true        
        });

      }
    })



    // const cardsObs = refav.set()
    // cardsObs.



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
