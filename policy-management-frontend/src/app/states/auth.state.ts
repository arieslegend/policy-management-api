import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Router } from '@angular/router';

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
  constructor(private router: Router) {}

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
      
      if (action.payload.email === 'admin@policy.com' && action.payload.password === 'admin123') {
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
      } else if (action.payload.email === 'client@policy.com' && action.payload.password === 'client123') {
        const clientUser: User = {
          id: 2,
          identificationNumber: 'CLIENT001',
          fullName: 'Cliente Demo',
          email: 'client@policy.com',
          phone: '+0987654321',
          role: 'client'
        };
        console.log('Login client exitoso');
        ctx.dispatch(new LoginSuccess({ user: clientUser, token: 'client-token' }));
      } else {
        console.log('Login fallido');
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
}
