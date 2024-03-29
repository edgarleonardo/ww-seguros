import { Component } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, NavigationCancel, NavigationError, ChildActivationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ww-seguros';

  public showOverlay = true;

  constructor(
    private router: Router,
  ) {

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof ChildActivationStart) {
      setTimeout(() => {
        this.showOverlay = true;
      });
    }
    if (event instanceof NavigationEnd) {
      setTimeout(() => {
        this.showOverlay = false;
      });
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      setTimeout(() => {
        this.showOverlay = false;
      });
    }
    if (event instanceof NavigationError) {
      setTimeout(() => {
        this.showOverlay = false;
      });
    }
  }

}
