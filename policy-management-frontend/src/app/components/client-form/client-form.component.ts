import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CreateClient, UpdateClient } from '../../states/policy.state';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  @Input() client: any = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  clientForm!: FormGroup;
  isEdit = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.client;
    this.initForm();
  }

  private initForm(): void {
    this.clientForm = this.fb.group({
      identificationNumber: [
        this.client?.identificationNumber || '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$'),
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      fullName: [
        this.client?.fullName || '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$'),
          Validators.maxLength(100)
        ]
      ],
      email: [
        this.client?.email || '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(100)
        ]
      ],
      phone: [
        this.client?.phone || '',
        [
          Validators.required,
          Validators.pattern('^[+]?[0-9\\s\\-\\(\\)]+$'),
          Validators.maxLength(20)
        ]
      ]
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.markFormGroupTouched(this.clientForm);
      return;
    }

    this.isLoading = true;
    const formData = this.clientForm.value;

    if (this.isEdit) {
      this.store.dispatch(new UpdateClient({ id: this.client.id, client: formData })).subscribe({
        next: () => {
          this.isLoading = false;
          this.saved.emit();
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.store.dispatch(new CreateClient(formData)).subscribe({
        next: () => {
          this.isLoading = false;
          this.saved.emit();
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.clientForm.get(field);
    if (!control || !control.touched) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    if (control.hasError('pattern')) {
      switch (field) {
        case 'identificationNumber':
          return 'Debe ser un número de 10 dígitos';
        case 'fullName':
          return 'Solo se permiten letras y espacios';
        case 'email':
          return 'Formato de email inválido';
        case 'phone':
          return 'Formato de teléfono inválido';
        default:
          return 'Formato inválido';
      }
    }

    if (control.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }

    if (control.hasError('maxlength')) {
      return `Máximo ${control.errors?.['maxlength'].requiredLength} caracteres`;
    }

    if (control.hasError('email')) {
      return 'Email inválido';
    }

    return '';
  }
}
