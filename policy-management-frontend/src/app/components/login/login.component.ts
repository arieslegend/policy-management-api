import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Login } from '../../states/auth.state';
import { LoadClients } from '../../states/policy.state';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // No cargar clientes automáticamente para evitar el error NG0205
    console.log('LoginComponent: Componente inicializado');
  }

  ngOnDestroy(): void {
    console.log('LoginComponent: Destruyendo componente');
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      
      // Cargar clientes justo antes del login para evitar el error NG0205
      this.store.dispatch(new LoadClients()).subscribe({
        next: () => {
          console.log('LoginComponent: Clientes cargados, procediendo con login');
          // Esperar un momento y luego hacer login
          setTimeout(() => {
            this.store.dispatch(new Login({ email, password }));
          }, 500);
        },
        error: (error) => {
          console.error('LoginComponent: Error al cargar clientes', error);
          // Continuar con login incluso si falla la carga de clientes
          this.store.dispatch(new Login({ email, password }));
        }
      });
      
      // Suscribirse al estado de carga
      this.store.select(state => state.auth.isLoading).subscribe(loading => {
        this.isLoading = loading;
      });
    }
  }

  // Credenciales de demostración
  get adminCredentials() {
    return { email: 'admin@policy.com', password: 'Admin2024!' };
  }

  get clientCredentials() {
    return { email: 'Cualquier email de cliente existente', password: 'client123' };
  }
}
