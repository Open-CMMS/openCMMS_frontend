import {Component, OnInit} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {UrlService} from 'src/app/services/shared/url.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'open-cmms';
  previousUrl: string = null;
  currentUrl: string = null;

  constructor(private router: Router,
              private urlService: UrlService) {}

  ngOnInit() {
    this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.urlService.setPreviousUrl(this.currentUrl);
      this.currentUrl = event.url;
    });
  }
}
