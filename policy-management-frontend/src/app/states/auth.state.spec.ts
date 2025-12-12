import { TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { NgxsModule } from '@ngxs/store';
import { of, throwError } from 'rxjs';

import { AuthState, AuthStateModel, Login, LoginSuccess, LoginFailure, Logout, UpdateUserProfile } from './auth.state';

declare global {
  var jasmine: any;
  var spyOn: any;
}

describe('AuthState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AuthState])]
    });

    store = TestBed.inject(Store);
  });

  describe('Selectors', () => {
    it('should select user', () => {
      const user = { id: 1, identificationNumber: '12345678901', fullName: 'John Doe', email: 'john@example.com', phone: '1234567890', role: 'admin' as const };
      const state: AuthStateModel = {
        user,
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false
      };
      const result = AuthState.user(state);
      
      expect(result).toEqual(user);
    });

    it('should select isAuthenticated', () => {
      const state: AuthStateModel = {
        user: null,
        token: null,
        isAuthenticated: true,
        isLoading: false
      };
      const result = AuthState.isAuthenticated(state);
      
      expect(result).toBeTruthy();
    });

    it('should select isAdmin when user is admin', () => {
      const user = { id: 1, identificationNumber: '12345678901', fullName: 'John Doe', email: 'john@example.com', phone: '1234567890', role: 'admin' as const };
      const state: AuthStateModel = {
        user,
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false
      };
      const result = AuthState.isAdmin(state);
      
      expect(result).toBeTruthy();
    });

    it('should select isAdmin when user is not admin', () => {
      const user = { id: 2, identificationNumber: '98765432109', fullName: 'Jane Doe', email: 'jane@example.com', phone: '0987654321', role: 'client' as const };
      const state: AuthStateModel = {
        user,
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false
      };
      const result = AuthState.isAdmin(state);
      
      expect(result).toBeFalsy();
    });

    it('should select isAdmin when user is null', () => {
      const state: AuthStateModel = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      };
      const result = AuthState.isAdmin(state);
      
      expect(result).toBeFalsy();
    });
  });

  describe('Actions', () => {
    it('should handle Login action', () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      
      store.dispatch(new Login(credentials));
      
      expect(store.selectSnapshot((state: any) => state.auth.isLoading)).toBeTruthy();
    });

    it('should handle LoginSuccess action', () => {
      const user = { id: 1, identificationNumber: '12345678901', fullName: 'John Doe', email: 'john@example.com', phone: '1234567890', role: 'admin' as const };
      const token = 'test-token';
      
      store.dispatch(new LoginSuccess({ user, token }));
      
      expect(store.selectSnapshot(AuthState.user)).toEqual(user);
      expect(store.selectSnapshot(AuthState.isAuthenticated)).toBeTruthy();
      expect(store.selectSnapshot((state: any) => state.auth.isLoading)).toBeFalsy();
    });

    it('should handle LoginFailure action', () => {
      const error = 'Invalid credentials';
      
      store.dispatch(new LoginFailure({ error }));
      
      expect(store.selectSnapshot(AuthState.isAuthenticated)).toBeFalsy();
      expect(store.selectSnapshot((state: any) => state.auth.isLoading)).toBeFalsy();
    });

    it('should handle Logout action', () => {
      store.dispatch(new Logout());
      
      expect(store.selectSnapshot(AuthState.user)).toBeNull();
      expect(store.selectSnapshot((state: any) => state.auth.token)).toBeNull();
      expect(store.selectSnapshot(AuthState.isAuthenticated)).toBeFalsy();
    });

    it('should handle UpdateUserProfile action', () => {
      const updatedUser = { id: 1, identificationNumber: '12345678901', fullName: 'John Updated', email: 'john@example.com', phone: '1234567890', role: 'admin' as const };
      
      store.dispatch(new UpdateUserProfile(updatedUser));
      
      expect(store.selectSnapshot(AuthState.user)).toEqual(updatedUser);
    });
  });
});
