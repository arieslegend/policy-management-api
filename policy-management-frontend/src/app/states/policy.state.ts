import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';

export interface Policy {
  id: number;
  type: 'Vida' | 'Automóvil' | 'Salud' | 'Hogar';
  startDate: string;
  endDate: string;
  insuredAmount: number;
  status: 'Activa' | 'Cancelada';
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

export class SelectClient {
  static readonly type = '[Policy] Select Client';
  constructor(public payload: Client | null) {}
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
  private apiBaseUrl = 'https://localhost:7001/api';

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
      // Simulación de datos - en producción usarías fetch real
      const mockPolicies: Policy[] = [
        {
          id: 1,
          type: 'Vida',
          startDate: '2024-01-01',
          endDate: '2025-01-01',
          insuredAmount: 100000,
          status: 'Activa',
          clientId: 1,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          type: 'Automóvil',
          startDate: '2024-06-01',
          endDate: '2025-06-01',
          insuredAmount: 50000,
          status: 'Activa',
          clientId: 2,
          createdAt: '2024-06-01T00:00:00Z'
        },
        {
          id: 3,
          type: 'Salud',
          startDate: '2023-12-01',
          endDate: '2024-12-01',
          insuredAmount: 75000,
          status: 'Cancelada',
          clientId: 1,
          createdAt: '2023-12-01T00:00:00Z'
        },
        {
          id: 4,
          type: 'Hogar',
          startDate: '2024-03-01',
          endDate: '2025-03-01',
          insuredAmount: 120000,
          status: 'Activa',
          clientId: 2,
          createdAt: '2024-03-01T00:00:00Z'
        }
      ];
      
      ctx.dispatch(new LoadPoliciesSuccess(mockPolicies));
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
    ctx.patchState({ isLoading: true, error: null });
    
    try {
      // Simulación de datos
      const mockClients: Client[] = [
        {
          id: 1,
          identificationNumber: '1234567890',
          fullName: 'Juan Pérez',
          email: 'juan@example.com',
          phone: '+1234567890',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          identificationNumber: '0987654321',
          fullName: 'María García',
          email: 'maria@example.com',
          phone: '+0987654321',
          createdAt: '2024-06-01T00:00:00Z'
        }
      ];
      
      ctx.dispatch(new LoadClientsSuccess(mockClients));
    } catch (error) {
      ctx.dispatch(new LoadClientsFailure('Error al cargar clientes'));
    }
  }

  @Action(LoadClientsSuccess)
  loadClientsSuccess(ctx: StateContext<PolicyStateModel>, action: LoadClientsSuccess) {
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
      // Simulación de creación
      const newPolicy: Policy = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
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
      const currentPolicies = ctx.getState().policies;
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
