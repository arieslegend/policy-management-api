import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { ClientDashboardComponent } from './pages/client/client-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin', 
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'client', 
    component: ClientDashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];
