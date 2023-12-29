import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstLandComponent } from './first-land/first-land.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
    { path: 'init', component: FirstLandComponent },
    {
        path: '',
        component: MainComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
