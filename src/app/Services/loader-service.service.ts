import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderServiceService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show() {
    console.log('show called!');
    this.loadingSubject.next(true);
  }

  hide() {
    console.log('hide called!');
    this.loadingSubject.next(false);
  }

}
