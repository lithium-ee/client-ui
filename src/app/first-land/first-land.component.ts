import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { differenceInHours } from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-first-land',
    templateUrl: './first-land.component.html',
    styleUrls: ['./first-land.component.scss'],
})
export class FirstLandComponent {
    constructor(
        private appService: AppService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            const eventId = params['e'];
            if (!eventId) this.goToMain();
            const storage = this.appService.getEventsInfoFromLocalStorage();
            this.appService.makeEventActive(eventId);
            if (
                !storage ||
                !storage[eventId] ||
                differenceInHours(storage[eventId].dateConnected, new Date()) >
                    6
            ) {
                this.newUser(eventId);
                return;
            }
            this.appService.verifyUser().subscribe({
                next: (data: boolean) => {
                    if (!data) {
                        this.newUser(eventId);
                    }
                    this.goToMain();
                },
                error: (error: any) => {
                    console.log(error);
                    this.goToMain();
                },
            });
        });
    }

    private newUser(eventId: string) {
        this.appService.getUserToken(eventId).subscribe({
            next: (data: any) => {
                this.appService.updateEventInfoStorage(eventId, data.endUserId);
                this.goToMain();
            },
            error: (error: any) => {
                this.goToMain();
            },
        });
    }

    private goToMain() {
        this.router.navigate(['']);
    }
}
