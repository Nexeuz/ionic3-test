import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Keyboard } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument 
} from 'angularfire2/firestore';


import { FirebaseProvider } from '../../providers/firebase/firebasepro';
import { User } from '../../providers/interfaces';
import { Subscription } from 'rxjs/Subscription';



/**
 * Generated class for the CommentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  @ViewChild('content') content: Content;


  private idCard;

  private susUser: Subscription;

  private cardsRef: AngularFirestoreDocument<any>;
  public cards$: Observable<any>;

  private commentsRef: AngularFirestoreCollection<any>;
  public comments$: Observable<any>;

   public formValue: string;

  private user$: Observable<User>;

  private userRef: AngularFirestoreDocument<User>;

  private userData;

  public btnload = true;


  constructor(private board: Keyboard, private fireS: FirebaseProvider, 
    private afs: AngularFirestore, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private cfRef: ChangeDetectorRef) {
     this.idCard = navParams.data.id;
 


     setTimeout(() => {

      const keyboard = this.board.didShow.asObservable();

     keyboard.subscribe(data => {
       console.log(data);
       
     })

     },1000);
      
      
  
     
    
  }


  

  ngAfterViewChecked()
  {
    this.cfRef.detectChanges();
  }
  
  ionViewDidLoad() {


  
    // keyboard.subscribe(data => {
    //   console.log('prueba', data);
      
      
    // })

    
    this.userRef = this.afs.doc(`users/${ this.fireS.currentUserId }`);
    this.user$ = this.userRef.valueChanges();
    
    this.user$.subscribe(user => {
      this.userData = user;
    });
    console.log('ionViewDidLoad CommentsPage', this.idCard);


    this.cardsRef = this.afs.doc(`cards/${ this.idCard }`)
    this.cards$ = this.cardsRef.valueChanges();



    this.commentsRef = this.cardsRef.collection('comments', ref => ref.orderBy('createdAt', 'desc') );

  
    
  }


  addComment() {
    
   
      this.commentsRef.add({ name: this.userData.name, avatar: this.userData.avatar,   content: this.formValue, createdAt: new Date() });
      this.formValue ="";

      


  }

  ionViewDidLeave	() {

    if(this.susUser) {
      this.susUser.unsubscribe()
    }

  }

   // Lazy Load the Firestore Collection
   loadMore() {
    this.btnload = false;
    this.comments$ = this.commentsRef.valueChanges();
  }

  

  public scrollTo(){

    setTimeout(() => {
      const isOpen = this.board.isOpen()

      if(isOpen) {
        this.content.scrollToBottom()
      }

  
    }, 500);
}
}
