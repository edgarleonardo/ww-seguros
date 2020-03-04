import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  mobileQuery: MediaQueryList;
  activeRoute = '';

  watchRouter: Subscription;

  private mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    router: Router,

    ) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this.mobileQueryListener = () => changeDetectorRef.detectChanges();
      // tslint:disable-next-line: deprecation
      this.mobileQuery.addListener(this.mobileQueryListener);

      this.watchRouter = router.events.subscribe((url: any) => {
        this.activeRoute = url.url;

      });
     }

  ngOnInit() {

  }

  ngOnDestroy() {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this.mobileQueryListener);

    this.watchRouter.unsubscribe();
  }

}
