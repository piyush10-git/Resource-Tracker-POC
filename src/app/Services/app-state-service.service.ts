import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateServiceService {
  private DataStore : Map<string, any> = new Map();
  constructor() {}

  GetData<T>(key: string): T | null {
    return this.DataStore.has(key) ? this.DataStore.get(key) as T : null;
  }

  SetData(key: string, data: any) {
    this.DataStore.set(key, data);
  }

  DeleteData(key: string) {
    this.DataStore.delete(key);
  }

  Clear() {
    this.DataStore.clear();
  }

}
