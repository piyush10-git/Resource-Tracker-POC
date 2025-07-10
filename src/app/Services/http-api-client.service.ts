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
    const endpointURI = this.serverURI;
    return this.httpClient.get(endpointURI);
  }

  GetResourceById(id: number) {
    const endpointURI = this.serverURI + `/${id}`;
    return this.httpClient.get(endpointURI);
  }

  GetResourceStatistics() {
    const endpointURI = this.serverURI + '/statistics';
    return this.httpClient.get(endpointURI);
  }

  CreateResource(data: any) {
    const endpointURI = this.serverURI;
    return this.httpClient.post(endpointURI, data);
  }

  UpdateResource(data: any) {
    const endpointURI = this.serverURI;
    return this.httpClient.put(endpointURI, data);
  }

  DeleteResource(id: number) {
    const endpointURI = this.serverURI + `/${id}`;
    return this.httpClient.delete(endpointURI);
  }

  DeleteMultipleResource(ids: number[]) {
    let params = new HttpParams();
    ids.forEach(id => {
      params = params.append('EmpIds', id.toString());
    });

    const endpointURI = this.serverURI + `/Delete-Multiple`;
    return this.httpClient.delete(endpointURI, { params });
  }

  CheckEmailExists(email: string) {
    const endpointURI = this.serverURI + `/check-email-exist?emailId=${email}`;
    return this.httpClient.get(endpointURI);
  }
}
