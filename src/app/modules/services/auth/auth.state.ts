import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, delay, finalize, map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AUTH_STATE_TOKEN, AuthActions, IAuthStateModel } from './models/auth-state.model';
import { HttpErrorResponse } from '@angular/common/http';

@State({
  name: AUTH_STATE_TOKEN,
  defaults: {
    accessToken: null,
    isLoading: false,
    email: null,
    errorMessage: null
  }
})
@Injectable()
export class AuthState {
  @Selector()
  static isAuthenticated(state: IAuthStateModel): boolean {
    return !!state.accessToken;
  }

  @Selector()
  static isLoading(state: IAuthStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static email(state: IAuthStateModel): string | null {
    return state.email;
  }

  @Selector()
  static errorMessage(state: IAuthStateModel): string | null {
    return state.errorMessage;
  }

  constructor(private authService: AuthService) {
  }

  @Action(AuthActions.Login)
  login(ctx: StateContext<IAuthStateModel>, action: AuthActions.Login): Observable<IAuthStateModel> {
    return ctx.dispatch(new AuthActions.IsLoading()).pipe(
      mergeMap(() => this.authService.login(action.request)),
      map((resp) => ctx.patchState({
        accessToken: resp.accessToken,
        email: action.request.email,
        errorMessage: null
      })),
      catchError((err: HttpErrorResponse) => of(ctx.patchState({
        errorMessage: err?.error?.error || 'Unknown error'
      }))),
      finalize(() => ctx.patchState({isLoading: false}))
    );
  }

  @Action(AuthActions.IsLoading)
  authIsLoading(ctx: StateContext<IAuthStateModel>, action: AuthActions.IsLoading): IAuthStateModel {
    return ctx.patchState({
      isLoading: action.isLoading
    });
  }

  @Action(AuthActions.Logout)
  logout(ctx: StateContext<IAuthStateModel>): IAuthStateModel {
    return ctx.setState({
      accessToken: null,
      email: null,
      isLoading: false,
      errorMessage: null
    });
  }
}
