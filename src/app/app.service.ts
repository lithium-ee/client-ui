import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../env/environment';
import { Observable, delay, of, timeout } from 'rxjs';
import { Song } from './main/interfaces/song.interface';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    constructor(private http: HttpClient) {}

    events: { [key: string]: any } = this.getEventsInfoFromLocalStorage();
    activeEvent: string = localStorage.getItem('active') || '';

    public getUserToken(eventId: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}/end-user`, {
            params: {
                eventId,
            },
        });
    }

    public getEventsInfoFromLocalStorage(): any {
        // get event info from local storage
        const storage = localStorage.getItem('l');
        if (storage) {
            this.events = JSON.parse(storage);
        } else {
            this.events = {};
        }
        return this.events;
    }

    public updateEventInfoStorage(eventId: string, data: any): void {
        // add event info to local storage
        this.events[eventId] = {
            userId: data,
            dateConnected: new Date(),
        };
        localStorage.setItem('l', JSON.stringify(this.events));
    }

    public makeEventActive(eventId: string): void {
        // make event active
        this.activeEvent = eventId;
        localStorage.setItem('active', eventId);
    }

    public verifyUser(): Observable<boolean> {
        const eventId = localStorage.getItem('active');
        if (!eventId) {
            // return observable false
            return of(false).pipe(delay(100));
        }
        return this.http.post<boolean>(
            `${environment.apiUrl}/end-user/verify`,
            {
                eventId,
                userId: this.events[eventId].userId,
            }
        );
    }

    public getCooldown(): Observable<number> {
        return this.http.get<number>(
            `${environment.apiUrl}/end-user/cooldown`,
            {
                params: {
                    eventId: this.activeEvent,
                    userId: this.events[this.activeEvent].userId,
                },
            }
        );
    }

    public searchSongs(query: string | null): Observable<any> {
        if (!query) {
            return of([]);
        }
        return this.http.get(`${environment.apiUrl}/end-user/search`, {
            params: {
                eventId: this.activeEvent,
                query,
            },
        });
    }

    public submitSong(song: Song): Observable<any> {
        return this.http.post(`${environment.apiUrl}/end-user/submit-song`, {
            song: song,
            eventId: this.activeEvent,
            userId: this.events[this.activeEvent].userId,
        });
    }
}
