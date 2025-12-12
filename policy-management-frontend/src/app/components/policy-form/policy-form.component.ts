import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CreatePolicy, UpdatePolicy } from '../../states/policy.state';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-policy-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.scss']
})
export class PolicyFormComponent implements OnInit {
  @Input() policy: any = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  policyForm!: FormGroup;
  isEdit = false;
  isLoading = false;
  clients$!: Observable<any[]>;

  policyTypes = [
    { value: 0, label: 'Vida' },
    { value: 1, label: 'Automóvil' },
    { value: 2, label: 'Salud' },
    { value: 3, label: 'Hogar' }
  ];

  policyStatuses = [
    { value: 0, label: 'Activa' },
    { value: 1, label: 'Cancelada' },
    { value: 2, label: 'Vencida' }
  ];

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.policy;
    this.clients$ = this.store.select(state => state.policy.clients);
    this.initForm();
  }

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.policyForm = this.fb.group({
      type: [this.policy?.type || 0, [Validators.required]],
      clientId: [this.policy?.clientId || '', [Validators.required]],
      startDate: [
        this.policy?.startDate ? new Date(this.policy.startDate).toISOString().split('T')[0] : today,
        [Validators.required]
      ],
      endDate: [
        this.policy?.endDate ? new Date(this.policy.endDate).toISOString().split('T')[0] : '',
        [Validators.required]
      ],
      insuredAmount: [
        this.policy?.insuredAmount || '',
        [
          Validators.required,
          Validators.min(0.01),
          Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')
        ]
      ],
      status: [this.policy?.status || 0, [Validators.required]]
    });

    // Validar que la fecha de fin sea posterior a la de inicio
    this.policyForm.get('startDate')?.valueChanges.subscribe(() => {
      this.validateDateRange();
    });

    this.policyForm.get('endDate')?.valueChanges.subscribe(() => {
      this.validateDateRange();
    });
  }

  private validateDateRange(): void {
    const startDate = this.policyForm.get('startDate')?.value;
    const endDate = this.policyForm.get('endDate')?.value;
    const endDateControl = this.policyForm.get('endDate');

    if (startDate && endDate) {
      if (new Date(endDate) <= new Date(startDate)) {
        endDateControl?.setErrors({ ...endDateControl?.errors, dateRange: true });
      } else {
        endDateControl?.setErrors(endDateControl?.errors ? { ...endDateControl?.errors, dateRange: undefined } : null);
      }
    }
  }

  onSubmit(): void {
    if (this.policyForm.invalid) {
      this.markFormGroupTouched(this.policyForm);
      return;
    }

    this.isLoading = true;
    const formData = this.policyForm.value;

    // Debug: mostrar el valor del tipo
    console.log('Tipo de póliza:', formData.type, typeof formData.type);

    // Convertir fechas al formato ISO
    formData.startDate = new Date(formData.startDate).toISOString();
    formData.endDate = new Date(formData.endDate).toISOString();

    // Debug: mostrar el formData completo
    console.log('FormData completo:', formData);

    if (this.isEdit) {
      this.store.dispatch(new UpdatePolicy({ id: this.policy.id, policy: formData })).subscribe({
        next: () => {
          this.isLoading = false;
          this.saved.emit();
        },
        error: (error) => {
          console.error('Error al actualizar póliza:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.store.dispatch(new CreatePolicy(formData)).subscribe({
        next: () => {
          this.isLoading = false;
          this.saved.emit();
        },
        error: (error) => {
          console.error('Error al crear póliza:', error);
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
    const control = this.policyForm.get(field);
    if (!control || !control.touched) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }

    if (control.hasError('min')) {
      return 'El monto debe ser mayor a 0';
    }

    if (control.hasError('pattern')) {
      if (field === 'insuredAmount') {
        return 'Formato de monto inválido (ej: 1000.50)';
      }
      return 'Formato inválido';
    }

    if (control.hasError('dateRange')) {
      return 'La fecha de fin debe ser posterior a la de inicio';
    }

    return '';
  }
}
