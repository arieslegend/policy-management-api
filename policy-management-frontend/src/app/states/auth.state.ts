import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Router } from '@angular/router';
import { PolicyStateModel } from './policy.state';
import { Store } from '@ngxs/store';

export interface User {
  id: number;
  identificationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'client';
}

export interface AuthStateModel {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { email: string; password: string }) {}
}

export class LoginSuccess {
  static readonly type = '[Auth] Login Success';
  constructor(public payload: { user: User; token: string }) {}
}

export class LoginFailure {
  static readonly type = '[Auth] Login Failure';
  constructor(public payload: { error: string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class UpdateUserProfile {
  static readonly type = '[Auth] Update User Profile';
  constructor(public payload: User) {}
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  }
})
@Injectable()
export class AuthState {
  constructor(private router: Router, private store: Store) {}

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Selector()
  static user(state: AuthStateModel): User | null {
    return state.user;
  }

  @Selector()
  static isAdmin(state: AuthStateModel): boolean {
    return state.user?.role === 'admin';
  }

  @Selector()
  static isClient(state: AuthStateModel): boolean {
    return state.user?.role === 'client';
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    ctx.patchState({ isLoading: true });
    
    // Simulación de autenticación básica
    // En producción, esto llamaría a una API real
    setTimeout(() => {
      console.log('Intentando login con:', action.payload.email);
      
      // Validación para administrador
      if (action.payload.email === 'admin@policy.com' && action.payload.password === 'Admin2024!') {
        const adminUser: User = {
          id: 1,
          identificationNumber: 'ADMIN001',
          fullName: 'Administrador',
          email: 'admin@policy.com',
          phone: '+1234567890',
          role: 'admin'
        };
        console.log('Login admin exitoso');
        ctx.dispatch(new LoginSuccess({ user: adminUser, token: 'admin-token' }));
        return;
      }
      
      // Validación dinámica para clientes - usar selectSnapshot para obtener estado actualizado
      const store = ctx.getState as any;
      console.log('Estado completo disponible:', Object.keys(store));
      
      // Usar selectSnapshot del store para obtener clientes del estado de políticas
      let clients = [];
      try {
        console.log('Intentando obtener clientes usando selectSnapshot...');
        const policyState = this.store.selectSnapshot(state => state.policy);
        console.log('PolicyState obtenido:', policyState);
        
        if (policyState && policyState.clients) {
          clients = policyState.clients;
          console.log('Clientes obtenidos desde selectSnapshot:', clients.length);
        } else {
          console.log('No se encontraron clientes en el estado de políticas');
        }
      } catch (error) {
        console.error('Error al usar selectSnapshot:', error);
      }
      
      console.log('Clientes disponibles:', clients.map((c: any) => c.email));
      
      const client = clients.find((c: any) => c.email === action.payload.email);
      console.log('Cliente encontrado:', client);
      
      if (client && action.payload.password === 'client123') {
        const clientUser: User = {
          id: client.id,
          identificationNumber: client.identificationNumber,
          fullName: client.fullName,
          email: client.email,
          phone: client.phone,
          role: 'client'
        };
        console.log('Login cliente exitoso para:', client.email);
        ctx.dispatch(new LoginSuccess({ user: clientUser, token: 'client-token' }));
      } else {
        console.log('Login fallido - Cliente no encontrado o contraseña incorrecta');
        console.log('Email buscado:', action.payload.email);
        console.log('Contraseña recibida:', action.payload.password);
        ctx.dispatch(new LoginFailure({ error: 'Credenciales inválidas' }));
      }
    }, 1000);
  }

  @Action(LoginSuccess)
  loginSuccess(ctx: StateContext<AuthStateModel>, action: LoginSuccess) {
    ctx.patchState({
      user: action.payload.user,
      token: action.payload.token,
      isAuthenticated: true,
      isLoading: false
    });
    
    console.log('LoginSuccess - User role:', action.payload.user.role);
    
    // Redirigir según el rol
    if (action.payload.user.role === 'admin') {
      console.log('Redirigiendo a /admin');
      this.router.navigate(['/admin']);
    } else {
      console.log('Redirigiendo a /client');
      this.router.navigate(['/client']);
    }
  }

  @Action(LoginFailure)
  loginFailure(ctx: StateContext<AuthStateModel>, action: LoginFailure) {
    ctx.patchState({
      isLoading: false
    });
    // Aquí podrías mostrar un mensaje de error
    console.error(action.payload.error);
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
    this.router.navigate(['/login']);
  }

  @Action(UpdateUserProfile)
  updateUserProfile(ctx: StateContext<AuthStateModel>, action: UpdateUserProfile) {
    ctx.patchState({
      user: action.payload
    });
  }
}
