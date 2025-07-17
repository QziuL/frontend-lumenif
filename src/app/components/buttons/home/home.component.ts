import { Component } from '@angular/core';
import {Button} from "primeng/button";
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
    imports: [
        Button
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(
    private router: Router,
  )
  {  }

  redirect()
  {
    this.router.navigate(['/home']);
  }
}
