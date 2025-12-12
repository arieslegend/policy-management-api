import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './states/auth.state';
import { PolicyState } from './states/policy.state';

declare global {
  var jasmine: any;
  var spyOn: any;
}

export function configureTestBed() {
  TestBed.configureTestingModule({
    imports: [
      NgxsModule.forRoot([AuthState, PolicyState])
    ]
  });

  // Add comprehensive cleanup to prevent NG0205 errors
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
}
