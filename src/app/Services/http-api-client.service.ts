import { HttpClient, HttpParams } from '@angular/common/http';
import { ApplicationModule, Injectable } from '@angular/core';
import { Environment } from '../../Environment/Environment';
import { map, Observable } from 'rxjs';
import { ApiResoponse, Resource } from '../Interfaces/Interfaces';
import { ParseGetResourceByIdResponse } from '../UtilityFunctions/MapingFunctions';

@Injectable({
  providedIn: 'root'
})
export class HttpAPIClientService {
  private serverURI: string = Environment.URI + '/resources';

  constructor(private httpClient: HttpClient) { }

  GetResources(): Observable<any[]> {
    const endpointURI = this.serverURI + '/get-all-resources';
    return this.httpClient.get<ApiResoponse>(endpointURI).pipe(
      map(response => response.data.map((resource: any) => {
        resource.billable = resource.billable ? 'Yes' : 'No';
        resource.empId = resource.empId.toString();
        return resource;
      })))
  }

  GetResourceById(id: number): Observable<Resource | null> {
    const endpointURI = this.serverURI + `/get-resource-id/${id}`;
    return this.httpClient.get<ApiResoponse>(endpointURI).pipe(
      map((response: ApiResoponse) => {
        if (response.success) {
          return ParseGetResourceByIdResponse(response.data);
        }
        return null;
      })
    );
  }

  GetResourceStatistics(): Observable<any> {
    const endpointURI = this.serverURI + '/get-resource-statistics';
    return this.httpClient.get(endpointURI);
  }

  CreateResource(data: any): Observable<any> {
    const endpointURI = this.serverURI + '/create-new-resource';
    return this.httpClient.post(endpointURI, data);
  }

  ImportExcelData(data: any): Observable<any> {
    const endpointURI = this.serverURI + '/import-excel-data';
    return this.httpClient.post(endpointURI, data);
  }

  UpdateResource(data: any): Observable<any> {
    const endpointURI = this.serverURI + '/update-resource';
    return this.httpClient.put(endpointURI, data);
  }

  DeleteResource(id: number): Observable<any> {
    const endpointURI = this.serverURI + `/delete-resource/${id}`;
    return this.httpClient.delete(endpointURI);
  }

  DeleteMultipleResource(ids: number[]): Observable<any> {
    let params = new HttpParams();
    ids.forEach(id => {
      params = params.append('EmpIds', id.toString());
    });

    const endpointURI = this.serverURI + `/delete-multiple-resources`;
    return this.httpClient.delete(endpointURI, { params });
  }

  CheckEmailExists(email: string): Observable<any> {
    const endpointURI = this.serverURI + `/check-email-exist?emailId=${email}`;
    return this.httpClient.get(endpointURI);
  }

  GetDropdownOptions(): Observable<any> {
    const endpointURI = this.serverURI + '/dropdown-options';
    return this.httpClient.get(endpointURI);
  }

  BulkEditResources(data: any): Observable<any> {
    const endpointURI = this.serverURI + '/bulk-edit';
    return this.httpClient.put(endpointURI, data);
  }

  GetRoleOptions(): Observable<any> {
    const endpoint = this.serverURI + '/role-options';
    return this.httpClient.get(endpoint);
  }

}
