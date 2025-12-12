import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { environment } from '../../environments/environment';

export interface Policy {
  id: number;
  type: number; // 0=Vida, 1=Automóvil, 2=Salud, 3=Hogar
  startDate: string;
  endDate: string;
  insuredAmount: number;
  status: number; // 0=Activa, 1=Cancelada
  clientId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Client {
  id: number;
  identificationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PolicyStateModel {
  policies: Policy[];
  clients: Client[];
  selectedPolicy: Policy | null;
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;
}

export class LoadPolicies {
  static readonly type = '[Policy] Load Policies';
}

export class LoadPoliciesSuccess {
  static readonly type = '[Policy] Load Policies Success';
  constructor(public payload: Policy[]) {}
}

export class LoadPoliciesFailure {
  static readonly type = '[Policy] Load Policies Failure';
  constructor(public payload: string) {}
}

export class LoadClients {
  static readonly type = '[Policy] Load Clients';
}

export class LoadClientsSuccess {
  static readonly type = '[Policy] Load Clients Success';
  constructor(public payload: Client[]) {}
}

export class LoadClientsFailure {
  static readonly type = '[Policy] Load Clients Failure';
  constructor(public payload: string) {}
}

export class CreatePolicy {
  static readonly type = '[Policy] Create Policy';
  constructor(public payload: Omit<Policy, 'id' | 'createdAt' | 'updatedAt'>) {}
}

export class UpdatePolicy {
  static readonly type = '[Policy] Update Policy';
  constructor(public payload: { id: number; policy: Partial<Policy> }) {}
}

export class DeletePolicy {
  static readonly type = '[Policy] Delete Policy';
  constructor(public payload: number) {}
}

export class SelectPolicy {
  static readonly type = '[Policy] Select Policy';
  constructor(public payload: Policy | null) {}
}

export class CreateClient {
  static readonly type = '[Client] Create Client';
  constructor(public payload: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {}
}

export class UpdateClient {
  static readonly type = '[Client] Update Client';
  constructor(public payload: { id: number; client: Partial<Client> }) {}
}

export class DeleteClient {
  static readonly type = '[Client] Delete Client';
  constructor(public payload: number) {}
}

export class CancelPolicy {
  static readonly type = '[Policy] Cancel Policy';
  constructor(public customerId: number, public policyId: number) {}
}

export class SelectClient {
  static readonly type = '[Policy] Select Client';
  constructor(public payload: Client | null) {}
}

export class UpdateCustomerProfile {
  static readonly type = '[Customer] Update Profile';
  constructor(public customerId: number, public profile: { email?: string; phone?: string }) {}
}

@State<PolicyStateModel>({
  name: 'policy',
  defaults: {
    policies: [],
    clients: [],
    selectedPolicy: null,
    selectedClient: null,
    isLoading: false,
    error: null
  }
})
@Injectable()
export class PolicyState {
  private apiBaseUrl = environment.apiUrl;

  private async fetchWithAuth(endpoint: string, options?: RequestInit): Promise<Response> {
    // Verificar si estamos en el navegador
    const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      ...options?.headers as { [key: string]: string }
    };

    // Solo agregar token si estamos en el navegador
    if (isBrowser) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return fetch(`${this.apiBaseUrl}${endpoint}`, {
      ...options,
      headers
    });
  }

  @Selector()
  static policies(state: PolicyStateModel): Policy[] {
    return state.policies;
  }

  @Selector()
  static clients(state: PolicyStateModel): Client[] {
    return state.clients;
  }

  @Selector()
  static selectedPolicy(state: PolicyStateModel): Policy | null {
    return state.selectedPolicy;
  }

  @Selector()
  static selectedClient(state: PolicyStateModel): Client | null {
    return state.selectedClient;
  }

  @Selector()
  static isLoading(state: PolicyStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static error(state: PolicyStateModel): string | null {
    return state.error;
  }

  @Action(LoadPolicies)
  async loadPolicies(ctx: StateContext<PolicyStateModel>) {
    ctx.patchState({ isLoading: true, error: null });
    
    try {
      const response = await this.fetchWithAuth('/policies');
      if (!response.ok) throw new Error('Error al cargar pólizas');
      
      const policies: Policy[] = await response.json();
      ctx.dispatch(new LoadPoliciesSuccess(policies));
    } catch (error) {
      ctx.dispatch(new LoadPoliciesFailure('Error al cargar pólizas'));
    }
  }

  @Action(LoadPoliciesSuccess)
  loadPoliciesSuccess(ctx: StateContext<PolicyStateModel>, action: LoadPoliciesSuccess) {
    ctx.patchState({
      policies: action.payload,
      isLoading: false
    });
  }

  @Action(LoadPoliciesFailure)
  loadPoliciesFailure(ctx: StateContext<PolicyStateModel>, action: LoadPoliciesFailure) {
    ctx.patchState({
      error: action.payload,
      isLoading: false
    });
  }

  @Action(LoadClients)
  async loadClients(ctx: StateContext<PolicyStateModel>) {
    console.log('PolicyState: Iniciando carga de clientes desde API');
    ctx.patchState({ isLoading: true, error: null });
    
    try {
      console.log('PolicyState: Haciendo petición a /clients');
      const response = await this.fetchWithAuth('/clients');
      console.log('PolicyState: Response status:', response.status);
      
      if (!response.ok) throw new Error('Error al cargar clientes');
      
      const clients: Client[] = await response.json();
      console.log('PolicyState: Clientes recibidos:', clients.length);
      console.log('PolicyState: Emails de clientes:', clients.map(c => c.email));
      
      ctx.dispatch(new LoadClientsSuccess(clients));
    } catch (error) {
      console.error('PolicyState: Error al cargar clientes:', error);
      ctx.dispatch(new LoadClientsFailure('Error al cargar clientes'));
    }
  }

  @Action(LoadClientsSuccess)
  loadClientsSuccess(ctx: StateContext<PolicyStateModel>, action: LoadClientsSuccess) {
    console.log('PolicyState: Guardando clientes en estado:', action.payload.length);
    ctx.patchState({
      clients: action.payload,
      isLoading: false
    });
  }

  @Action(LoadClientsFailure)
  loadClientsFailure(ctx: StateContext<PolicyStateModel>, action: LoadClientsFailure) {
    ctx.patchState({
      error: action.payload,
      isLoading: false
    });
  }

  @Action(CreatePolicy)
  async createPolicy(ctx: StateContext<PolicyStateModel>, action: CreatePolicy) {
    ctx.patchState({ isLoading: true, error: null });
    
    try {
      const response = await this.fetchWithAuth('/policies', {
        method: 'POST',
        body: JSON.stringify(action.payload)
      });
      
      if (!response.ok) throw new Error('Error al crear póliza');
      
      const newPolicy: Policy = await response.json();
      const currentPolicies = ctx.getState().policies;
      ctx.patchState({
        policies: [...currentPolicies, newPolicy],
        isLoading: false
      });
    } catch (error) {
      ctx.patchState({
        error: 'Error al crear póliza',
        isLoading: false
      });
    }
  }

  @Action(UpdatePolicy)
  async updatePolicy(ctx: StateContext<PolicyStateModel>, action: UpdatePolicy) {
    ctx.patchState({ isLoading: true, error: null });
    
    try {
      const response = await this.fetchWithAuth(`/policies/${action.payload.id}`, {
        method: 'PUT',
        body: JSON.stringify(action.payload.policy)
      });
      
      if (!response.ok) throw new Error('Error al actualizar póliza');
      
      const currentPolicies = ctx.getState().policies;
      
      // Actualizar exactamente como UpdateClient - SIN usar respuesta de API
      const updatedPolicies = currentPolicies.map(policy =>
        policy.id === action.payload.id
          ? { ...policy, ...action.payload.policy, updatedAt: new Date().toISOString() }
          : policy
      );
      
      ctx.patchState({
        policies: updatedPolicies,
        isLoading: false
      });
    } catch (error) {
      ctx.patchState({
        error: 'Error al actualizar póliza',
        isLoading: false
      });
    }
  }

  @Action(DeletePolicy)
  async deletePolicy(ctx: StateContext<PolicyStateModel>, action: DeletePolicy) {
    ctx.patchState({ isLoading: true, error: null });
    
    try {
      const response = await this.fetchWithAuth(`/policies/${action.payload}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Error al eliminar póliza');
      
      const currentPolicies = ctx.getState().policies;
      const filteredPolicies = currentPolicies.filter(policy => policy.id !== action.payload);
      
      ctx.patchState({
        policies: filteredPolicies,
        isLoading: false
      });
    } catch (error) {
      ctx.patchState({
        error: 'Error al eliminar póliza',
        isLoading: false
      });
    }
  }

  @Action(CreateClient)
  async createClient(ctx: StateContext<PolicyStateModel>, action: CreateClient) {
    ctx.patchState({ isLoading: true, error: null });
    
    try {
      const response = await this.fetchWithAuth('/clients', {
        method: 'POST',
        body: JSON.stringify(action.payload)
      });
      
      if (!response.ok) throw new Error('Error al crear cliente');
      
      const newClient: Client = await response.json();
      const currentClients = ctx.getState().clients;
      ctx.patchState({
        clients: [...currentClients, newClient],
        isLoading: false
      });
    } catch (error) {
      ctx.patchState({
        error: 'Error al crear cliente',
        isLoading: false
      });
    }
  }

  @Action(UpdateClient)
  async updateClient(ctx: StateContext<PolicyStateModel>, action: UpdateClient) {
    ctx.patchState({ isLoading: true, error: null });
    
    try {
      const response = await this.fetchWithAuth(`/clients/${action.payload.id}`, {
        method: 'PUT',
        body: JSON.stringify(action.payload.client)
      });
      
      if (!response.ok) throw new Error('Error al actualizar cliente');
      
      const currentClients = ctx.getState().clients;
      const updatedClients = currentClients.map(client =>
        client.id === action.payload.id
          ? { ...client, ...action.payload.client, updatedAt: new Date().toISOString() }
          : client
      );
      
      ctx.patchState({
        clients: updatedClients,
        isLoading: false
      });
    } catch (error) {
      ctx.patchState({
        error: 'Error al actualizar cliente',
        isLoading: false
      });
    }
  }

  @Action(DeleteClient)
  async deleteClient(ctx: StateContext<PolicyStateModel>, action: DeleteClient) {
    ctx.patchState({ isLoading: true, error: null });
    
    try {
      const response = await this.fetchWithAuth(`/clients/${action.payload}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Error al eliminar cliente');
      
      const currentClients = ctx.getState().clients;
      const filteredClients = currentClients.filter(client => client.id !== action.payload);
      
      ctx.patchState({
        clients: filteredClients,
        isLoading: false
      });
    } catch (error) {
      ctx.patchState({
        error: 'Error al eliminar cliente',
        isLoading: false
      });
    }
  }

  @Action(CancelPolicy)
  async cancelPolicy(ctx: StateContext<PolicyStateModel>, action: CancelPolicy) {
    ctx.patchState({ isLoading: true, error: null });
    
    try {
      const response = await this.fetchWithAuth(`/customers/${action.customerId}/policies/${action.policyId}/cancel`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Error al cancelar póliza');
      
      // Actualizar estado de la póliza localmente
      const currentPolicies = ctx.getState().policies;
      const updatedPolicies = currentPolicies.map(policy =>
        policy.id === action.policyId ? { ...policy, status: 1 } : policy
      );
      
      ctx.patchState({
        policies: updatedPolicies,
        isLoading: false
      });
    } catch (error) {
      ctx.patchState({
        error: 'Error al cancelar póliza',
        isLoading: false
      });
    }
  }

  @Action(UpdateCustomerProfile)
  async updateCustomerProfile(ctx: StateContext<PolicyStateModel>, action: UpdateCustomerProfile) {
    ctx.patchState({ isLoading: true, error: null });
    
    try {
      const response = await this.fetchWithAuth(`/customers/${action.customerId}/profile`, {
        method: 'PUT',
        body: JSON.stringify(action.profile)
      });
      
      if (!response.ok) throw new Error('Error al actualizar perfil');
      
      ctx.patchState({ isLoading: false });
    } catch (error) {
      ctx.patchState({
        error: 'Error al actualizar perfil',
        isLoading: false
      });
    }
  }

  @Action(SelectPolicy)
  selectPolicy(ctx: StateContext<PolicyStateModel>, action: SelectPolicy) {
    ctx.patchState({
      selectedPolicy: action.payload
    });
  }

  @Action(SelectClient)
  selectClient(ctx: StateContext<PolicyStateModel>, action: SelectClient) {
    ctx.patchState({
      selectedClient: action.payload
    });
  }
}
