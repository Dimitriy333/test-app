import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { AuthState } from '../services/auth/auth.state';
import { AuthService } from '../services/auth/auth.service';
import { AuthServiceMock, errorEmail } from '../services/auth/auth.state.spec';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

@Component({selector: 'app', template: ''})
class AppComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: Store;
  let router: Router;
  let loader: HarnessLoader;

  const fillData = (email: string, password: string): void => {
    const emailControl = fixture.debugElement.query(By.css('input[formControlName="email"]')).nativeElement;
    const passwordControl = fixture.debugElement.query(By.css('input[formControlName="password"]')).nativeElement;

    emailControl.value = email;
    emailControl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    passwordControl.value = password;
    passwordControl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  const clickSubmit = (): void => {
    const submitButton = fixture.debugElement.query(By.css('.login__form__button')).nativeElement;
    submitButton.click();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: '',
            pathMatch: 'full',
            component: AppComponent
          },
          {
            path: 'login',
            component: LoginComponent
          },
          {
            path: '**',
            redirectTo: 'login'
          }
        ]),
        NgxsModule.forRoot([AuthState]),
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatPseudoCheckboxModule
      ],
      declarations: [
        LoginComponent
      ],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceMock
        }
      ]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    router.initialNavigation();
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should component init', () => {
    expect(component).toBeTruthy();
  });

  it('should fill success data and navigate to root', fakeAsync(() => {
    spyOn(router, 'navigate');

    fillData('email@email.email', '123456');

    expect(component.loginForm.valid).toBe(true);

    clickSubmit();

    tick(100);

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should fill error data and display error', fakeAsync(() => {
    spyOn(router, 'navigate');

    fillData(errorEmail, '123456');

    expect(component.loginForm.valid).toBe(true);

    clickSubmit();

    tick(100);

    expect(router.navigate).not.toHaveBeenCalled();

    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(By.css('.login__form__error_message')).nativeElement;

    expect(errorMessage.textContent).toContain('error');
  }));
});
