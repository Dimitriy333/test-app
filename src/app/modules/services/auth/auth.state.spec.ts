import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { AuthState } from './auth.state';
import { AUTH_STATE_TOKEN_NAME, AuthActions, IAuthStateModel } from './models/auth-state.model';
import { AuthService } from './auth.service';
import { LoginRequestModel } from './models/login-request.model';
import { interval, Observable, throwError } from 'rxjs';
import { AuthTokenModel } from './models/auth-token.model';
import { map, take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export const errorEmail = 'error@error.error';

export class AuthServiceMock {
  login(request: LoginRequestModel): Observable<AuthTokenModel> {
    if (request.email && request.email !== errorEmail) {
      return interval(100).pipe(
        take(1),
        map(() => new AuthTokenModel('token'))
      );
    }

    return throwError(new HttpErrorResponse({error: {error: 'error'}}));
  }
}

describe('Auth', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([AuthState])
      ],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceMock
        }
      ]
    });

    store = TestBed.inject(Store);
  });

  it('it toggles IsLoading', () => {
    store.dispatch(new AuthActions.IsLoading(true));

    let isLoading = store.selectSnapshot((state) => (state[AUTH_STATE_TOKEN_NAME] as IAuthStateModel).isLoading);
    expect(isLoading).toBe(true);

    store.dispatch(new AuthActions.IsLoading(false));

    isLoading = store.selectSnapshot((state) => (state[AUTH_STATE_TOKEN_NAME] as IAuthStateModel).isLoading);
    expect(isLoading).toBe(false);
  });

  it('should login success', async () => {
    const email = 'email@email.email';
    const promise = store.dispatch(new AuthActions.Login(new LoginRequestModel(email, '123456'))).toPromise();
    let state: IAuthStateModel = store.selectSnapshot(AuthState);

    expect(state.isLoading).toBe(true);

    await promise;

    state = store.selectSnapshot(AuthState);

    expect(state.accessToken).toBe('token');
    expect(state.isLoading).toBe(false);
    expect(state.errorMessage).toBe(null);
    expect(state.email).toBe(email);
  });

  it('should login fail', async () => {
    await store.dispatch(new AuthActions.Login(new LoginRequestModel('', ''))).toPromise();

    const state = store.selectSnapshot(AuthState) as IAuthStateModel;

    expect(state.errorMessage).toBe('error');
    expect(state.accessToken).toBe(null);
    expect(state.isLoading).toBe(false);
    expect(state.email).toBe(null);
  });
});
