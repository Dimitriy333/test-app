import { StateToken } from '@ngxs/store';
import { LoginRequestModel } from './login-request.model';

export interface IAuthStateModel {
  accessToken: string | null;
  isLoading: boolean;
  email: string | null;
  errorMessage: string | null;
}

export const AUTH_STATE_TOKEN_NAME = 'auth';
export const AUTH_STATE_TOKEN = new StateToken<IAuthStateModel>(AUTH_STATE_TOKEN_NAME);

export namespace AuthActions {
  export class Login {
    static readonly type = '[Auth] Login';

    constructor(public request: LoginRequestModel) {
    }
  }

  export class Logout {
    static readonly type = '[Auth] Logout';
  }

  export class IsLoading {
    static readonly type = '[Auth] IsLoading';

    constructor(public isLoading: boolean = true) {
    }
  }
}
