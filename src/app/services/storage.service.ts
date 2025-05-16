import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private userToken = new BehaviorSubject<string | undefined>(undefined);
  userToken$ = this.userToken.asObservable();

  async Store<T>(StorageKey: string, Value: T) {
    const encryptvalue = (JSON.stringify(Value));
    await Preferences.set({
      key: StorageKey,
      value: encryptvalue,
    });
  }
  // : Promise<T> 
  async get<T>(StorageKey: string) {
    return Preferences.get({
      key: StorageKey,
    }).then((res) => {
      return JSON.parse(res.value ?? '') as T;
    }).catch(() => {
      return null;
    });
  }

  async removeItem(StorageKey: string) {
    await Preferences.remove({
      key: StorageKey
    });
  }

  async Clear() {
    await Preferences.clear();
  }

  setUserToken(userToken: string | undefined) {
    this.userToken.next(userToken);
  }

}
