import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Logout } from '../../states/auth.state';
import { LoadPolicies, LoadClients, DeleteClient, DeletePolicy, SelectClient, SelectPolicy } from '../../states/policy.state';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientFormComponent } from '../../components/client-form/client-form.component';
import { PolicyFormComponent } from '../../components/policy-form/policy-form.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ClientFormComponent, PolicyFormComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {
  policies$!: Observable<any[]>;
  clients$!: Observable<any[]>;
  user$!: Observable<any>;
  isLoading$!: Observable<boolean>;
  activePoliciesCount$!: Observable<number>;

  showClientForm = false;
  showPolicyForm = false;
  selectedClient: any = null;
  selectedPolicy: any = null;

  // Filtros
  showClientFilters = false;
  showPolicyFilters = false;
  clientFilters!: FormGroup;
  policyFilters!: FormGroup;

  // Datos filtrados
  filteredClients$!: Observable<any[]>;
  filteredPolicies$!: Observable<any[]>;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    this.policies$ = this.store.select(state => state.policy.policies);
    this.clients$ = this.store.select(state => state.policy.clients);
    this.user$ = this.store.select(state => state.auth.user);
    this.isLoading$ = this.store.select(state => state.policy.isLoading);

    this.store.dispatch(new LoadPolicies());
    this.store.dispatch(new LoadClients());

    // Inicializar filtros
    this.clientFilters = this.fb.group({
      name: [''],
      email: [''],
      identificationNumber: ['']
    });

    this.policyFilters = this.fb.group({
      type: [''],
      status: [''],
      startDate: [''],
      endDate: ['']
    });

    // Crear observables para las estadísticas
    this.activePoliciesCount$ = this.policies$.pipe(
      map(policies => policies?.filter(p => p.status === 0).length || 0)
    );

    // Inicializar datos filtrados
    this.filteredClients$ = this.clients$;
    this.filteredPolicies$ = this.policies$;

    // Suscribirse a cambios de pólizas para forzar detección
    this.policies$.pipe(take(1)).subscribe(() => {
      this.cdr.detectChanges();
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

  getStatusClass(status: number): string {
    const classes: { [key: number]: string } = {
      0: 'status-active',
      1: 'status-cancelled'
    };
    return classes[status] || 'status-unknown';
  }

  getClientName(clientId: number): string {
    const clients = this.store.selectSnapshot((state: any) => state.policy.clients);
    const client = clients.find((c: any) => c.id === clientId);
    return client ? client.fullName : 'Desconocido';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES');
  }

  // Métodos CRUD para Clientes
  createClient(): void {
    this.selectedClient = null;
    this.showClientForm = true;
    this.showPolicyForm = false;
  }

  editClient(client: any): void {
    this.selectedClient = client;
    this.showClientForm = true;
    this.showPolicyForm = false;
  }

  deleteClient(clientId: number): void {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.store.dispatch(new DeleteClient(clientId));
    }
  }

  // Métodos CRUD para Pólizas
  createPolicy(): void {
    this.selectedPolicy = null;
    this.showPolicyForm = true;
    this.showClientForm = false;
  }

  editPolicy(policy: any): void {
    this.selectedPolicy = policy;
    this.showPolicyForm = true;
    this.showClientForm = false;
  }

  deletePolicy(policyId: number): void {
    if (confirm('¿Está seguro de eliminar esta póliza?')) {
      this.store.dispatch(new DeletePolicy(policyId));
    }
  }

  // Manejo de formularios
  onClientSaved(): void {
    this.showClientForm = false;
    this.selectedClient = null;
  }

  onClientCancelled(): void {
    this.showClientForm = false;
    this.selectedClient = null;
  }

  onPolicySaved(): void {
    this.showPolicyForm = false;
    this.selectedPolicy = null;
    
    // Forzar actualización usando múltiples métodos seguros
    setTimeout(() => {
      try {
        // Método 1: ChangeDetectorRef si está disponible
        if (this.cdr) {
          this.cdr.detectChanges();
        }
        
        // Método 2: ApplicationRef para forzar tick completo (con verificación)
        if (this.appRef) {
          this.appRef.tick();
        }
        
        // Método 3: Recargar observable para forzar nueva referencia
        this.policies$ = this.store.select(state => state.policy.policies);
      } catch (error) {
        console.error('Error al forzar actualización:', error);
      }
    }, 100);
  }

  onPolicyCancelled(): void {
    this.showPolicyForm = false;
    this.selectedPolicy = null;
  }

  // Métodos para filtros de clientes
  toggleClientFilters(): void {
    this.showClientFilters = !this.showClientFilters;
  }

  applyClientFilters(): void {
    const filters = this.clientFilters.value;
    
    this.filteredClients$ = this.clients$.pipe(
      map(clients => {
        return clients.filter(client => {
          const nameMatch = !filters.name || 
            client.fullName.toLowerCase().includes(filters.name.toLowerCase());
          const emailMatch = !filters.email || 
            client.email.toLowerCase().includes(filters.email.toLowerCase());
          const idMatch = !filters.identificationNumber || 
            client.identificationNumber.includes(filters.identificationNumber);
          
          return nameMatch && emailMatch && idMatch;
        });
      })
    );
  }

  clearClientFilters(): void {
    this.clientFilters.reset();
    this.filteredClients$ = this.clients$;
  }

  // Métodos para filtros de pólizas
  togglePolicyFilters(): void {
    this.showPolicyFilters = !this.showPolicyFilters;
  }

  applyPolicyFilters(): void {
    const filters = this.policyFilters.value;
    
    this.filteredPolicies$ = this.policies$.pipe(
      map(policies => {
        return policies.filter(policy => {
          const typeMatch = !filters.type || policy.type === parseInt(filters.type);
          const statusMatch = !filters.status || policy.status === parseInt(filters.status);
          const startDateMatch = !filters.startDate || 
            new Date(policy.startDate) >= new Date(filters.startDate);
          const endDateMatch = !filters.endDate || 
            new Date(policy.endDate) <= new Date(filters.endDate);
          
          return typeMatch && statusMatch && startDateMatch && endDateMatch;
        });
      })
    );
  }

  clearPolicyFilters(): void {
    this.policyFilters.reset();
    this.filteredPolicies$ = this.policies$;
  }
}
