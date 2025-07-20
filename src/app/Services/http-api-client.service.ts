import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '../../Environment/Environment';

@Injectable({
  providedIn: 'root'
})
export class HttpAPIClientService {
  private serverURI: string = Environment.URI;

  constructor(private httpClient: HttpClient) { }

  GetResources() {
    const endpointURI = this.serverURI + '/get-all-resources';
    return this.httpClient.get(endpointURI);
  }

  GetResourceById(id: number) {
    const endpointURI = this.serverURI + `/get-resource-id/${id}`;
    return this.httpClient.get(endpointURI);
  }

  GetResourceStatistics() {
    const endpointURI = this.serverURI + '/get-resource-statistics';
    return this.httpClient.get(endpointURI);
  }

  CreateResource(data: any) {
    const endpointURI = this.serverURI + '/create-new-resource';
    return this.httpClient.post(endpointURI, data);
  }

  ImportExcelData(data: any) {
    const endpointURI = this.serverURI + '/import-excel-data';
    return this.httpClient.post(endpointURI, data);
  }

  UpdateResource(data: any) {
    const endpointURI = this.serverURI + '/update-resource';
    return this.httpClient.put(endpointURI, data);
  }

  DeleteResource(id: number) {
    const endpointURI = this.serverURI + `/delete-resource/${id}`;
    return this.httpClient.delete(endpointURI);
  }

  DeleteMultipleResource(ids: number[]) {
    let params = new HttpParams();
    ids.forEach(id => {
      params = params.append('EmpIds', id.toString());
    });

    const endpointURI = this.serverURI + `/delete-multiple-resources`;
    return this.httpClient.delete(endpointURI, { params });
  }

  CheckEmailExists(email: string) {
    const endpointURI = this.serverURI + `/check-email-exist?emailId=${email}`;
    return this.httpClient.get(endpointURI);
  }

  GetDropdownOptions() {
    const endpointURI = this.serverURI + '/dropdown-options';
    return this.httpClient.get(endpointURI);
  }
}
