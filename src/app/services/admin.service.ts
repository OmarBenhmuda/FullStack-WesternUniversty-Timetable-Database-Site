import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

const ip = window.location.href.substr(0, window.location.href.length - 1)

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  url: string = ip + ':3000/api/'
  // url: string = "http://localhost:3000/api/"

  constructor(private http: HttpClient) { }

  makeAdmin(email) {
    const url = `${this.url}makeAdmin`
    return this.http.post(url, email, httpOptions)

  }

  changeUserAccess(email) {
    const url = `${this.url}changeUserAccess`
    return this.http.post(url, email, httpOptions)

  }
}
