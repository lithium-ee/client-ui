import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environment'; // Import environment.ts
import { NavigationStart, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router) {} // Inject HttpClient
    isFirstVisit = true; // Add this line

    ngOnInit() {
        console.log('here');
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (event.url.startsWith('/init') && !this.isFirstVisit) {
                    // Modify this line
                    this.router.navigate(['']);
                } else {
                    this.isFirstVisit = false; // Add this line
                }
            }
        });
    }

    title = 'client-ui';
}
