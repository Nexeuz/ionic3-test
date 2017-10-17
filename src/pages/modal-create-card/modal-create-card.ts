import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface Card  {
  title: string;
  url_img: string;
  url_articulo: string;
  description: string;
  source: string;
  category: string;
}

@IonicPage()
@Component({
  selector: 'page-modal-create-card',
  templateUrl: 'modal-create-card.html',
})
export class ModalCreateCardPage {

  formCard: FormGroup; 
  closeObservable: any;
   private refCategories: AngularFirestoreCollection<any>;
  categories: Observable<any>;

  categorias = [];

  constructor(public db: AngularFirestore, private view: ViewController, public fb: FormBuilder) {
    this.buildForm();
  }

  ionViewDidLoad() {
    this.refCategories = this.db.collection('categories');
    this.categories = this.refCategories.valueChanges()

    this.categories.subscribe(data=>{
      this.categorias = data;
    });
  


    console.log('ionViewDidLoad ModalCreateCardPage');
  }

  closeModal(){
    this.view.dismiss();
  }
  buildForm(): void {
    this.formCard = this.fb.group({
      'title': ['', [
        Validators.required,
        Validators.maxLength(200)
      ]
      ],
      'url_img': ['', [
        Validators.required,
        Validators.pattern('^(https?|ftp)://.*(jpeg|png|svg|jpg|gif)'),        
      ]
      ],
      'url_articulo': ['', [
        Validators.required,
        Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'),
      ]
      ],
      'article_description': ['', [
        Validators.required,
        Validators.maxLength(360)
      ]
      ],
      'source': ['', [
        Validators.required
      ]
      ],
      'categories': ['', [
        Validators.required
      ]
      ],
    });

    this.closeObservable = this.formCard.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  
  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.formCard) { return; } // creo que es para evitar hacks.
    const form = this.formCard;// metemos nuestro formulario en una variable
    for (const field in this.formErrors) { // iteramos el JSON this formsErrors.
      // clear previous error message (if any)
      this.formErrors[field] = ''; // limpiamos los errores si los hay.
      const control = form.get(field); // obtenemos el control por ese campo iterado.
      if (control && control.dirty && control.invalid) { // verificamos si hay control && no esta sucio && no es invalido si alguna de estas codiciones no se cumple no entra aqui, todo tiene que ser true.
        const messages = this.validationMessages[field];// buscamos el mensaje por el campo en el JSON.
        for (const key in control.errors) { // ultimo for para interar los errores por ese control, control.errors retorna un booleano
          this.formErrors[field] += messages[key] + ' '; // buscar el error que concida con el key en true en el JSON formErrors, concaternarlo y asignarlo. 
        }
      }
    }
  }

  formErrors = {
    'title': '',
    'url_img': '',
    'url_articulo': '',
    'article_description': '',
    'categories': '',
    'source': '',
  };
  validationMessages = {
    'title': {
      'required': 'El titulo es requerido.',
      'maxlength': 'El nombre no puede tener más de 200 carácteres.',
    },
    'url_img': {
      'required': 'La URL de la imágen del artículo es obligatoria.',
      'pattern': 'La URL de la imagen debe tener un formato válido; las extensiones aceptadas son png, jpg, jpeg, svg y gif.'      
    },
    'url_articulo': {
      'required': 'El URL del artículo es obligatorio.',
      'pattern': 'La URL del articulo debe tener un formato válido. Ejemplo: https://www.medium.com/news/244'      
    },
    'article_description': {
      'required': 'La descripción del artículo es obligatoria.',
      'maxlength': 'La descripción no puede tener más de 360 caracteres.',
    },
    'source': {
      'required': 'La fuente es obligatoria, ejemplo medium.com'
    },
    'categories': {
      'required': 'La categoría es obligatoria.'
    }
  };
  saveCard(){
    debugger
    console.log(this.formCard.value);
    
     const cardObject: Card = {
        title: this.formCard.value.title,
        url_img: this.formCard.value.url_img,
        url_articulo:  this.formCard.value.url_articulo,
        description: this.formCard.value.article_description,
        category: this.formCard.value.categories,
        source: this.formCard.value.source
     }

     const cardsCollection = this.db.collection<Card>('cards');
    
     cardsCollection.add(cardObject).then(()=>{
        this.formCard.reset();
     });
  }



  



}
