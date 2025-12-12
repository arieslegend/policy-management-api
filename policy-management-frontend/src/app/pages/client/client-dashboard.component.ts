import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logout, UpdateUserProfile } from '../../states/auth.state';
import { LoadPolicies, CancelPolicy, UpdateCustomerProfile } from '../../states/policy.state';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  policies$!: Observable<any[]>;
  user$!: Observable<any>;
  isLoading$!: Observable<boolean>;
  activePoliciesCount$!: Observable<number>;
  cancelledPoliciesCount$!: Observable<number>;
  
  showEditModal = false;
  editForm!: FormGroup;

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.user$ = this.store.select(state => state.auth.user);
    this.isLoading$ = this.store.select(state => state.policy.isLoading);

    this.store.dispatch(new LoadPolicies());

    // Filtrar pólizas solo del cliente actual
    this.policies$ = this.store.select(state => state.policy.policies).pipe(
      map(policies => {
        const currentUser = this.store.selectSnapshot(state => state.auth.user);
        if (currentUser && currentUser.role === 'client') {
          return policies?.filter((policy: any) => policy.clientId === currentUser.id) || [];
        }
        return policies || [];
      })
    );

    // Crear observables para las estadísticas
    this.activePoliciesCount$ = this.policies$.pipe(
      map(policies => policies?.filter(p => p.status === 0).length || 0)
    );

    this.cancelledPoliciesCount$ = this.policies$.pipe(
      map(policies => policies?.filter(p => p.status === 1).length || 0)
    );

    // Inicializar formulario de edición
    this.editForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  logout(): void {
    this.store.dispatch(new Logout());
  }

  getPolicyTypeName(type: number): string {
    const types: { [key: number]: string } = {
      0: 'Vida',
      1: 'Automóvil',
      2: 'Salud',
      3: 'Hogar'
    };
    return types[type] || 'Desconocido';
  }

  getPolicyStatusName(status: number): string {
    const statuses: { [key: number]: string } = {
      0: 'Activa',
      1: 'Cancelada'
    };
    return statuses[status] || 'Desconocido';
  }

  getTypeIconClass(type: number): string {
    const iconClasses: { [key: number]: string } = {
      0: 'type-auto',
      1: 'type-home', 
      2: 'type-life',
      3: 'type-health'
    };
    return iconClasses[type] || 'type-default';
  }

  getStatusClass(status: number): string {
    const classes: { [key: number]: string } = {
      0: 'status-active',
      1: 'status-cancelled'
    };
    return classes[status] || 'status-unknown';
  }

  getDaysUntilExpiry(endDate: string): number {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES');
  }

  // Métodos para cancelación de pólizas
  cancelPolicy(policyId: number): void {
    if (confirm('¿Está seguro de cancelar esta póliza? Esta acción no se puede deshacer.')) {
      // Obtener el cliente actual para el endpoint específico
      const currentUser = this.store.selectSnapshot(state => state.auth.user);
      
      if (currentUser && currentUser.role === 'client') {
        // Usar el endpoint específico de cancelación
        this.store.dispatch(new CancelPolicy({ 
          customerId: currentUser.id, 
          policyId: policyId
        })).subscribe({
          next: () => {
            console.log('Póliza cancelada exitosamente');
          },
          error: (error) => {
            console.error('Error al cancelar póliza:', error);
            alert('Error al cancelar la póliza. Por favor, inténtelo nuevamente.');
          }
        });
      }
    }
  }

  // Métodos para edición de información personal
  openEditModal(): void {
    const currentUser = this.store.selectSnapshot(state => state.auth.user);
    if (currentUser) {
      this.editForm.patchValue({
        phone: currentUser.phone || '',
        email: currentUser.email || ''
      });
    }
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editForm.reset();
  }

  savePersonalInfo(): void {
    if (this.editForm.invalid) {
      this.markFormGroupTouched(this.editForm);
      return;
    }

    const currentUser = this.store.selectSnapshot(state => state.auth.user);
    if (currentUser) {
      // Dispatch acción para actualizar el perfil del cliente
      this.store.dispatch(new UpdateCustomerProfile(
        currentUser.id, 
        {
          email: this.editForm.value.email,
          phone: this.editForm.value.phone
        }
      )).subscribe({
        next: () => {
          console.log('Perfil actualizado exitosamente');
          
          // Actualizar el usuario en el estado de autenticación
          const updatedUser = {
            ...currentUser,
            email: this.editForm.value.email,
            phone: this.editForm.value.phone
          };
          
          // Dispatch acción para actualizar el usuario en AuthState
          this.store.dispatch(new UpdateUserProfile(updatedUser));
          
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error al actualizar perfil:', error);
          alert('Error al actualizar el perfil. Por favor, inténtelo nuevamente.');
        }
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
