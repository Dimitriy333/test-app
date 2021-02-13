import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequestModel } from './models/login-request.model';
import { Config } from '../../../models/config';
import { Observable } from 'rxjs';
import { AuthTokenModel } from './models/auth-token.model';
import { map } from 'rxjs/operators';
import { BaseHttpResponseModel } from '../../../models/base-http-response.model';

@Injectable()
export class AuthService {
  constructor(private httpClient: HttpClient) {
  }

  login(request: LoginRequestModel): Observable<AuthTokenModel> {
    return this.httpClient.post(`${Config.serverUrl}auth/login`, request).pipe(
      map((response) => new AuthTokenModel((response as BaseHttpResponseModel<AuthTokenModel>).data?.accessToken))
    );
  }
}
