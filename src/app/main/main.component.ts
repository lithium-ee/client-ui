import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environment';
import { AppService } from '../app.service';
import { Song } from './interfaces/song.interface';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    animations: [
        trigger('fadeInOut', [
            state(
                'void',
                style({
                    opacity: 0,
                })
            ),
            transition('void <=> *', animate(200)),
        ]),
        trigger('jumpUp', [
            state(
                'hidden',
                style({
                    transform: 'translateY(300%)',
                })
            ),
            state(
                'visible',
                style({
                    transform: 'translateY(0)',
                })
            ),
            transition('* <=> *', [animate('0.2s ease-out')]),
        ]),
    ],
})
export class MainComponent implements OnInit {
    constructor(private http: HttpClient, private appService: AppService) {}
    ngOnInit(): void {
        if (
            this.appService.activeEvent === '' ||
            this.appService.events[this.appService.activeEvent] === undefined
        ) {
            console.log('bad');
            return;
        }
        this.appService.getCooldown().subscribe({
            next: (data: any) => {
                if (data.cooldown > 0) {
                    this.setCooldown(data.cooldown);
                }
            },
            error: (error: any) => {
                this.error = 'asda';
            },
        });
        this.query.valueChanges
            .pipe(
                debounceTime(500),
                switchMap(query => this.appService.searchSongs(query))
            )
            .subscribe({
                next: (data: any) => {
                    this.songs = data;
                },
                error: (error: any) => {
                    this.error = 'asd';
                },
            });
    }

    query = new FormControl('');

    error: string = '';

    cooldown: string = '';

    songs: Song[] = [];

    selectedSong: Song | null = null;

    public selectSong(song: any) {
        if (song === this.selectedSong) {
            this.selectedSong = null;
            return;
        }
        this.selectedSong = song;
    }

    submit() {
        if (!this.selectedSong) {
            return;
        }
        this.appService.submitSong(this.selectedSong).subscribe({
            next: (data: any) => {
                if (!data) {
                    this.error = 'problem';
                    return;
                } else if (data.cooldown > 0) {
                    this.setCooldown(data.cooldown);
                }
            },
            error: (error: any) => {
                this.error = 'problem';
            },
        });
    }
    private cooldownInterval: any;
    private setCooldown(cooldown: number) {
        let remainingCooldown = cooldown;

        // Clear any existing interval
        if (this.cooldownInterval) {
            clearInterval(this.cooldownInterval);
        }

        // Start a new interval
        this.cooldownInterval = setInterval(() => {
            remainingCooldown -= 1000; // Decrease the remaining cooldown by 1 second

            // Convert the remaining cooldown to a readable format
            const readableCooldown =
                this.convertMillisecondsToReadableTime(remainingCooldown);
            this.cooldown = readableCooldown;

            // If the cooldown is over, clear the interval
            if (remainingCooldown <= 0) {
                clearInterval(this.cooldownInterval);
                this.cooldown = '';
            }
        }, 1000);
    }

    convertMillisecondsToReadableTime(ms: number): string {
        const hours = Math.floor(ms / 3600000); // 1 Hour = 36000 Milliseconds
        const minutes = Math.floor((ms % 3600000) / 60000); // 1 Minute = 60000 Milliseconds
        const seconds = Math.floor(((ms % 3600000) % 60000) / 1000); // 1 Second = 1000 Milliseconds

        return `${hours}h ${minutes}m ${seconds}s`;
    }
}
