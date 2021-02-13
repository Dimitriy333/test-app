import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { IAuthStateModel } from './modules/services/auth/models/auth-state.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test-app';
  readonly email$: Observable<string | null>;
  readonly accessToken$: Observable<string | null>;

  constructor(store: Store) {
    this.email$ = store.select((state: IAuthStateModel) => state.email);
    this.accessToken$ = store.select((state: IAuthStateModel) => state.accessToken);
  }
}
