import { Component } from '@angular/core';

@Component({
  selector: 'app-basics-page',
  templateUrl: './basics-page.component.html',
  styleUrls: ['./basics-page.component.css']
})
export class BasicsPageComponent {

  public nameLower: string = 'ramón'
  public nameUpper: string = 'RAMÓN'
  public fullName: string = 'RaMóN rOsA'
  
  public customDate: Date = new Date();

}
