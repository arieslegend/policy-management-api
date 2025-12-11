import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logout } from '../../states/auth.state';
import { LoadPolicies } from '../../states/policy.state';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  policies$!: Observable<any[]>;
  user$!: Observable<any>;
  isLoading$!: Observable<boolean>;
  activePoliciesCount$!: Observable<number>;
  cancelledPoliciesCount$!: Observable<number>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.policies$ = this.store.select(state => state.policy.policies);
    this.user$ = this.store.select(state => state.auth.user);
    this.isLoading$ = this.store.select(state => state.policy.isLoading);

    this.store.dispatch(new LoadPolicies());

    // Crear observables para las estadísticas
    this.activePoliciesCount$ = this.policies$.pipe(
      map(policies => policies?.filter(p => p.status === 'Activa').length || 0)
    );

    this.cancelledPoliciesCount$ = this.policies$.pipe(
      map(policies => policies?.filter(p => p.status === 'Cancelada').length || 0)
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

  getDaysUntilExpiry(endDate: string): number {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
