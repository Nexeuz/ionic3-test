  import { Directive } from '@angular/core';
  import { TextInput, Platform } from 'ionic-angular';

  @Directive({
      selector: '[elasticTextArea]'
  })
  export class ElasticTextArea {
      isIos: boolean;
      iosTextAreaMinHeight = 40;
      mdTextAreaMinHeight = 38;

      constructor(private textInput: TextInput, private platform: Platform) {
          this.isIos = this.platform.is('ios');
      }

      ngOnInit() {
          // Wait for TextInput _native property to initialize.
          setTimeout(() => { // suscripcion a nuestro textinput  esperamos a que llegue
              this.textInput.ngControl.valueChanges.subscribe((inputValue: any) => {
                  this.resize();
              });

              this.resize();
          });
      }

      resize() {
          let height = this.getTextAreaHeight(this.textInput, this.isIos ? this.iosTextAreaMinHeight : this.mdTextAreaMinHeight);
          this.textInput._native.nativeElement.style.height = height + 'px'; // y lo igualamos a nuestro elemento nativo
      }
      //recibe el text area y el ancho minimo del input
      getTextAreaHeight(textArea: TextInput, minHeight: number): number {
          // Get textarea styles.
          let body = <HTMLElement>document.querySelector('body'), // selecionamos el body
              textAreaElement = textArea._native.nativeElement, // seleccionamos el textarea con nativeElement 
              style = window.getComputedStyle(textAreaElement, null), // seleccionamos los estilos del textarea
              paddingHeight = parseInt(style.getPropertyValue('padding-top')) + parseInt(style.getPropertyValue('padding-bottom')), // obtenemos el padding top y el button
              paddingWidth = parseInt(style.getPropertyValue('padding-left')) + parseInt(style.getPropertyValue('padding-right')), // obtenemos el padding  left y right
              borderHeight = parseInt(style.getPropertyValue('border-top-width')) + parseInt(style.getPropertyValue('border-bottom-width')), // obtenenemos el alto del border.
              width = parseInt(style.getPropertyValue('width')) - paddingWidth, // obtenemos el ancho real restando el padding top and button
              lineHeight = style.getPropertyValue('line-height'); // capturamos el ancho del dalto de linea

          // IE and Firefox do not support 'font' property, so we need to get it ourselves.
          let font = style.getPropertyValue('font-style') + ' ' + // obtenemos la fuente de nuestro textarea
              style.getPropertyValue('font-variant') + ' ' +
              style.getPropertyValue('font-weight') + ' ' +
              style.getPropertyValue('font-size') + ' ' +
              style.getPropertyValue('font-height') + ' ' +
              style.getPropertyValue('font-family');

          // Prepare a temporary textarea to determine the height for a real one.
          let newTextAreaElement = <HTMLTextAreaElement>document.createElement('TEXTAREA'), // creamos un nuevo textarea
              newTextAreaElementId = '__newTextAreaElementId__'; // definimos un id para el nuevo text area
          newTextAreaElement.setAttribute('rows', '1'); // seteamos el contenedor de la columna de nuestro nuevo textarea en uno
          newTextAreaElement.setAttribute('id', newTextAreaElementId); // definimos el Id del textarea 
          newTextAreaElement.style.font = font; // seteamos la fuente de nuestro nuevo textarea
          newTextAreaElement.style.width = width + 'px'; // definimos un nuevo width usando el viejp
          newTextAreaElement.style.border = '0';
          newTextAreaElement.style.overflow = 'hidden';
          newTextAreaElement.style.padding = '0';
          newTextAreaElement.style.outline = '0';
          newTextAreaElement.style.resize = 'none';// todavia no le damos resise
          newTextAreaElement.style.lineHeight = lineHeight; // ajustamos el tamaño del salto de linea

          // To measure sizes we need to add the textarea to DOM. para medir los tamaños toca añadir el textarea en el dom
          body.insertAdjacentHTML('beforeend', newTextAreaElement.outerHTML); // //incertamos el elemento dentro del body al final 
          newTextAreaElement = <HTMLTextAreaElement>document.getElementById(newTextAreaElementId); // capturamos el nuevo elemento por su ID
          newTextAreaElement.value = textArea.value;// igualamos el valor anterior a nuestro nuevo text area

          // Measure the height.
          newTextAreaElement.style.height = 'auto'; //definimos el height de nuestro newTextArea  como auto. 
          newTextAreaElement.style.height = newTextAreaElement.scrollHeight + 'px'; // asignamos el height del area scrolleable al height del textarea area 
          let height = parseInt(newTextAreaElement.style.height) + paddingHeight + borderHeight;  //le sumamos el padding height y el borde height

          if (height < minHeight) { //si el nuevo height es  menor que el height por defecto
              height = minHeight; // igualamos el height nuevo con el viejo para no hacer ningun cambio
          }
          
          // Remove the remporary textarea.
          body.removeChild(newTextAreaElement);

          return height; // retornamos el height
      }
  }


  // WEBPACK FOOTER //
  // ./src/directives/elastic-text-area/elastic-text-area.ts