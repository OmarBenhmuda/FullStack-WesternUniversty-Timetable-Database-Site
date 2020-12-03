import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Course } from '../models/Course'
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Timetable } from '../models/Timetable';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}


//Initializing the ip used for the api because the AWS server api changes everytime u stop and start it
const ip = window.location.href.substr(0, window.location.href.length - 1)

@Injectable({
  providedIn: 'root'
})
export class CourseService {



  // url: string = ip + ':3000/api/'
  url: string = "http://localhost:3000/api/"

  getAll() {
    return this.http.get<Course[]>(this.url);
  }


  constructor(private http: HttpClient) { }

  getSpecific(subject: string, code: string, component: string) {
    let url: string
    if (subject != '' && code != '' && component != '') {
      url = this.url + 'getCourses/' + subject + '/' + code + '/' + component;
    } else if (subject != '' && code != '' && component == '') {
      url = this.url + subject + '/' + code;
    } else if (subject != '' && code == '' && component == '') {
      url = this.url + subject
    } else {
      alert("enter a subject")
      return;
    }
    return this.http.get<Course[]>(url);
  }


  addTimetable(timetable) {
    return this.http.post<Timetable>(this.url + 'q4', timetable, httpOptions)
  }

  findTimetable(timetable) {
    const url = this.url + 'q6/' + timetable
    return this.http.get(url);

  }

  addCourse(timetable) {
    return this.http.put(this.url + 'q5', timetable, httpOptions)
  }

  addUser(user) {
    return this.http.post(this.url + 'addUser', user, httpOptions)
  }

  getUser(email) {
    return this.http.get(this.url + "getUser/" + email)
  }
}
