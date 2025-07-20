import { Injectable } from '@angular/core';
import { HttpAPIClientService } from './http-api-client.service';
import { ArrayToMapConvertor } from '../UtilityFunctions/ConvertStringsToIds';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LookupServiceService {

  constructor(private httpApiClient: HttpAPIClientService) { }

  private dropdownOptionsSubject = new BehaviorSubject<any>(null);
  dropdownOptions$ = this.dropdownOptionsSubject.asObservable();

  GetDropdownOptions() {
    // Fetch dropdown options from the server
    this.httpApiClient.GetDropdownOptions().subscribe((response: any) => {
      console.log('dropdown options', response);
      if (response?.success) {
        const dropdownOptionsArray = response?.data;
        // Convert the dropdown options to a map structure
        const optionsMap: any = {};
        for (let key in response?.data) {
          optionsMap[key] = ArrayToMapConvertor(response?.data[key]);
        }
        // Update the BehaviorSubject with the new dropdown options
        this.dropdownOptionsSubject.next({dropdownOptionsArray, optionsMap});
      }
    })
  }

}
