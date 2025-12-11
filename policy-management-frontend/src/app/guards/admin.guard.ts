import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    console.log('AdminGuard - Verificando permisos de administrador');
    
    return this.store.select((state: any) => state.auth).pipe(
      filter((authState: any) => authState.isAuthenticated), // Esperar a que esté autenticado
      take(1),
      map((authState: any) => {
        console.log('AdminGuard - Auth state completo:', authState);
        
        const isAdmin = authState.user?.role === 'admin';
        console.log('AdminGuard - isAdmin:', isAdmin);
        console.log('AdminGuard - user:', authState.user);
        
        if (!isAdmin) {
          console.log('AdminGuard - No es admin, redirigiendo a /client');
          this.router.navigate(['/client']);
          return false;
        }
        
        console.log('AdminGuard - Es admin, permitiendo acceso');
        return true;
      })
    );
  }
}
