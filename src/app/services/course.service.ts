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



  url: string = ip + ':3000/api/'
  // url: string = "http://localhost:3000/api/"

  getAll() {
    return this.http.get<Course[]>(this.url);
  }


  constructor(private http: HttpClient) { }

  getSpecific(subject: string, code: string, component: string) {
    let url: string
    if (subject != '' && code != '' && component != '') {
      url = this.url + 'getCourses/' + subject + '/' + code + '/' + component;
    } else if (subject != '' && code != '' && component == '') {
      url = this.url + 'getCourses/' + subject + '/' + code;
    } else if (subject != '' && code == '' && component == '') {
      url = this.url + 'getCourses/' + subject
    } else {
      alert("enter a subject")
      return;
    }
    return this.http.get<Course[]>(url);
  }

  getKeyword(keyword: string) {
    const url = `${this.url}getCoursesByKeyword/${keyword}`
    return this.http.get<Course[]>(url);
  }



  addUser(user) {
    return this.http.post(this.url + 'addUser', user, httpOptions)
  }

  getUser(email) {
    return this.http.get(this.url + "getUser/" + email)
  }

  addTimetable(timetable) {
    return this.http.post(`${this.url}addTimetable`, timetable, httpOptions)
  }

  deleteTimetable(info) {
    return this.http.post(`${this.url}deleteTimetable`, info, httpOptions)
  }
  addCourse(info) {
    return this.http.post(`${this.url}addCourse`, info, httpOptions)
  }

  findTimetable(email, timetable_name) {
    return this.http.get(`${this.url}findTimetable/${email}/${timetable_name}`);

  }

  addReview(review) {
    return this.http.post(`${this.url}addReview`, review, httpOptions)
  }

  changeReviewVisibility(id) {
    return this.http.post(`${this.url}changeReviewVisibility`, id, httpOptions)
  }

}
