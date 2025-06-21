import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'properties', component:PropertyListComponent},
    {path:'property/:id', component:PropertyDetailComponent}
];
