import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[customLabel]'
})
export class CustomLabelDirective implements OnInit {

  private htmlElement?: ElementRef<HTMLElement>;
  private _color: string = 'red';
  private _errors?: ValidationErrors | null;

  @Input() set color(value: string) {
    this._color = value;
    this.setStyle();
  }

  @Input() set errors(value: ValidationErrors | null | undefined) {
    this._errors = value;
    this.setErrorMessage();
  }

  constructor(private el: ElementRef<HTMLElement>) {
    this.htmlElement = el;
  }

  ngOnInit(): void {
    console.log('Directiva -  NgOnInit')
  }

  setStyle(): void {
    if (!this.htmlElement) return;
    this.htmlElement.nativeElement.style.color = this._color;
  }

  setErrorMessage(): void {

    if (!this.htmlElement) return;

    if (!this._errors){
      this.htmlElement.nativeElement.innerText = 'No hay errores';
      return;
    }

    const errors = Object.keys(this._errors);

    if (errors.includes('required')){
      this.htmlElement.nativeElement.innerText = 'El campo es requerido';
      return;
    }
    
    if(errors.includes('minlength')){
      this.htmlElement.nativeElement.innerText = `El campo debe tener ${this._errors['minlength'].requiredLength - this._errors['minlength'].actualLength} caracteres más`;
      return;
    }

    if(errors.includes('email')){
      this.htmlElement.nativeElement.innerText = 'El campo debe ser un email';
      return;
    }
  }

}
