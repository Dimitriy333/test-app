import { Injectable } from '@angular/core';
import { AuthState } from './auth.state';
import { Store } from '@ngxs/store';
import { CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(): boolean {
    return this.store.selectSnapshot(AuthState.isAuthenticated);
  }
}
