import { TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { NgxsModule } from '@ngxs/store';

import { 
  PolicyState, 
  LoadPolicies, 
  LoadPoliciesSuccess, 
  LoadPoliciesFailure,
  LoadClients,
  LoadClientsSuccess,
  LoadClientsFailure,
  CreateClient,
  UpdateClient,
  DeleteClient,
  CreatePolicy,
  UpdatePolicy,
  DeletePolicy,
  SelectClient,
  PolicyStateModel 
} from './policy.state';

declare global {
  var jasmine: any;
  var spyOn: any;
}

describe('PolicyState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([PolicyState])]
    });

    store = TestBed.inject(Store);
  });

  describe('Selectors', () => {
    it('should select policies', () => {
      const state: PolicyStateModel = {
        policies: [{ id: 1, type: 0, startDate: '2024-01-01', endDate: '2024-12-31', insuredAmount: 1000, status: 0, clientId: 1, createdAt: '2024-01-01' }],
        clients: [],
        selectedPolicy: null,
        selectedClient: null,
        isLoading: false,
        error: null
      };
      const result = PolicyState.policies(state);
      
      expect(result).toEqual(state.policies);
    });

    it('should select clients', () => {
      const state: PolicyStateModel = {
        policies: [],
        clients: [{ id: 1, identificationNumber: '12345678901', fullName: 'John Doe', email: 'john@example.com', phone: '1234567890', createdAt: '2024-01-01' }],
        selectedPolicy: null,
        selectedClient: null,
        isLoading: false,
        error: null
      };
      const result = PolicyState.clients(state);
      
      expect(result).toEqual(state.clients);
    });

    it('should select selected client', () => {
      const client = { id: 1, identificationNumber: '12345678901', fullName: 'John Doe', email: 'john@example.com', phone: '1234567890', createdAt: '2024-01-01' };
      const state: PolicyStateModel = {
        policies: [],
        clients: [],
        selectedPolicy: null,
        selectedClient: client,
        isLoading: false,
        error: null
      };
      const result = PolicyState.selectedClient(state);
      
      expect(result).toEqual(client);
    });

    it('should select loading state', () => {
      const state: PolicyStateModel = {
        policies: [],
        clients: [],
        selectedPolicy: null,
        selectedClient: null,
        isLoading: true,
        error: null
      };
      const result = PolicyState.isLoading(state);
      
      expect(result).toBeTruthy();
    });

    it('should select error state', () => {
      const state: PolicyStateModel = {
        policies: [],
        clients: [],
        selectedPolicy: null,
        selectedClient: null,
        isLoading: false,
        error: 'Test error'
      };
      const result = PolicyState.error(state);
      
      expect(result).toBe('Test error');
    });
  });

  describe('Actions', () => {
    it('should handle LoadPolicies action', () => {
      store.dispatch(new LoadPolicies());
      
      expect(store.selectSnapshot(PolicyState.isLoading)).toBeTruthy();
    });

    it('should handle LoadPoliciesSuccess action', () => {
      const policies = [{ id: 1, type: 0, startDate: '2024-01-01', endDate: '2024-12-31', insuredAmount: 1000, status: 0, clientId: 1, createdAt: '2024-01-01' }];
      
      store.dispatch(new LoadPoliciesSuccess(policies));
      
      expect(store.selectSnapshot(PolicyState.policies)).toEqual(policies);
      expect(store.selectSnapshot(PolicyState.isLoading)).toBeFalsy();
    });

    it('should handle LoadPoliciesFailure action', () => {
      const error = 'Failed to load policies';
      
      store.dispatch(new LoadPoliciesFailure(error));
      
      expect(store.selectSnapshot(PolicyState.error)).toBe(error);
      expect(store.selectSnapshot(PolicyState.isLoading)).toBeFalsy();
    });

    it('should handle LoadClients action', () => {
      store.dispatch(new LoadClients());
      
      expect(store.selectSnapshot(PolicyState.isLoading)).toBeTruthy();
    });

    it('should handle LoadClientsSuccess action', () => {
      const clients = [{ id: 1, identificationNumber: '12345678901', fullName: 'John Doe', email: 'john@example.com', phone: '1234567890', createdAt: '2024-01-01' }];
      
      store.dispatch(new LoadClientsSuccess(clients));
      
      expect(store.selectSnapshot(PolicyState.clients)).toEqual(clients);
      expect(store.selectSnapshot(PolicyState.isLoading)).toBeFalsy();
    });

    it('should handle LoadClientsFailure action', () => {
      const error = 'Failed to load clients';
      
      store.dispatch(new LoadClientsFailure(error));
      
      expect(store.selectSnapshot(PolicyState.error)).toBe(error);
      expect(store.selectSnapshot(PolicyState.isLoading)).toBeFalsy();
    });

    it('should handle SelectClient action', () => {
      const client = { id: 1, identificationNumber: '12345678901', fullName: 'John Doe', email: 'john@example.com', phone: '1234567890', createdAt: '2024-01-01' };
      
      store.dispatch(new SelectClient(client));
      
      expect(store.selectSnapshot(PolicyState.selectedClient)).toEqual(client);
    });

    it('should handle CreateClient action', () => {
      const newClient = { identificationNumber: '12345678901', fullName: 'John Doe', email: 'john@example.com', phone: '1234567890' };
      
      store.dispatch(new CreateClient(newClient));
      
      expect(store.selectSnapshot(PolicyState.isLoading)).toBeTruthy();
    });

    it('should handle UpdateClient action', () => {
      const updateData = { id: 1, client: { fullName: 'John Updated' } };
      
      store.dispatch(new UpdateClient(updateData));
      
      expect(store.selectSnapshot(PolicyState.isLoading)).toBeTruthy();
    });

    it('should handle DeleteClient action', () => {
      const clientId = 1;
      
      store.dispatch(new DeleteClient(clientId));
      
      expect(store.selectSnapshot(PolicyState.isLoading)).toBeTruthy();
    });

    it('should handle CreatePolicy action', () => {
      const newPolicy = { type: 0, status: 0, startDate: '2024-01-01', endDate: '2024-12-31', insuredAmount: 1000, clientId: 1 };
      
      store.dispatch(new CreatePolicy(newPolicy));
      
      expect(store.selectSnapshot(PolicyState.isLoading)).toBeTruthy();
    });

    it('should handle UpdatePolicy action', () => {
      const updateData = { id: 1, policy: { insuredAmount: 1500 } };
      
      store.dispatch(new UpdatePolicy(updateData));
      
      expect(store.selectSnapshot(PolicyState.isLoading)).toBeTruthy();
    });

    it('should handle DeletePolicy action', () => {
      const policyId = 1;
      
      store.dispatch(new DeletePolicy(policyId));
      
      expect(store.selectSnapshot(PolicyState.isLoading)).toBeTruthy();
    });
  });
});
