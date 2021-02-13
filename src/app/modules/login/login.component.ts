import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LoginRequestModel } from '../services/auth/models/login-request.model';
import { AUTH_STATE_TOKEN_NAME, AuthActions, IAuthStateModel } from '../services/auth/models/auth-state.model';
import { from, Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthState } from '../services/auth/auth.state';
import { Router } from '@angular/router';
import { FormsHelper } from '../../helpers/forms.helper';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  isLoading$!: Observable<boolean>;
  @Select(AuthState.errorMessage) errorMessage$!: Observable<string | null>;
  loginForm = new FormGroup({
    email: new FormControl({value: '', disabled: false}, [Validators.email]),
    password: new FormControl({value: '', disabled: false}, [Validators.minLength(6)]),
  });

  constructor(private store: Store,
              private router: Router) {
    this.isLoading$ = store.select(AuthState.isLoading).pipe(
      tap((isLoading) => FormsHelper.setDisabledFormGroupControlsState(this.loginForm, isLoading))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.store.dispatch(new AuthActions.Login(new LoginRequestModel(
      this.loginForm.controls.email.value,
      this.loginForm.controls.password.value
    ))).pipe(
      switchMap((state: {[AUTH_STATE_TOKEN_NAME]: IAuthStateModel}) => {
        if (state.auth.accessToken) {
          this.router.navigate(['/']);
        }

        return of(undefined);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
}
