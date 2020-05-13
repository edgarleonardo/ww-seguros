import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LifeService {

  constructor(private http: HttpClient, private route:Router) { }

  postRequest(body) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log('body:', body);
    return this.http.post(`${environment.apiUrl}/api/Solicitudes/vida`, body, httpOptions);
  }

  returnData(id):Observable<any>{
    return this.http.get(`${environment.apiUrl}/api/Solicitudes/vida/${id}`)
  }
  
  id=null;
  getID(id){
      this.id=id;
      console.log("hola, soy ",id);
      this.route.navigateByUrl('/dashboard/requests/new-requests/life');
  }
}
