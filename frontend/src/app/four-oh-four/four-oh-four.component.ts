import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-four-oh-four',
  templateUrl: './four-oh-four.component.html',
  styleUrls: ['./four-oh-four.component.scss']
})
export class FourOhFourComponent implements OnInit {

  /**
   * Constructor of the component 404.
   * @param router the service used for routing.
   */
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Function that redirects the user on the home page.
   */
  onBackHome() {
    this.router.navigate(['']);
  }

}
