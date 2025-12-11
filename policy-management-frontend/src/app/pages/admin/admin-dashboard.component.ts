import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logout } from '../../states/auth.state';
import { LoadPolicies, LoadClients } from '../../states/policy.state';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  policies$!: Observable<any[]>;
  clients$!: Observable<any[]>;
  user$!: Observable<any>;
  isLoading$!: Observable<boolean>;
  activePoliciesCount$!: Observable<number>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.policies$ = this.store.select(state => state.policy.policies);
    this.clients$ = this.store.select(state => state.policy.clients);
    this.user$ = this.store.select(state => state.auth.user);
    this.isLoading$ = this.store.select(state => state.policy.isLoading);

    this.store.dispatch(new LoadPolicies());
    this.store.dispatch(new LoadClients());

    // Crear observable para las estadísticas
    this.activePoliciesCount$ = this.policies$.pipe(
      map(policies => policies?.filter(p => p.status === 'Activa').length || 0)
    );
  }

  logout(): void {
    this.store.dispatch(new Logout());
  }

  getPolicyTypeName(type: string): string {
    return type;
  }

  getPolicyStatusName(status: string): string {
    return status;
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Activa': 'status-active',
      'Cancelada': 'status-cancelled'
    };
    return classes[status] || '';
  }
}
