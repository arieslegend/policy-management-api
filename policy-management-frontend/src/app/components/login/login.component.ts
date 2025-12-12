import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Login } from '../../states/auth.state';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      this.store.dispatch(new Login({ email, password }));
      
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
    return { email: 'client@policy.com', password: 'client123' };
  }
}
