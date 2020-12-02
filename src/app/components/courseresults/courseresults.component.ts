import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Course } from 'src/app/models/Course';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-courseresults',
  templateUrl: './courseresults.component.html',
  styleUrls: ['./courseresults.component.css']
})

export class CourseresultsComponent implements OnInit {
  public courses: Course[];

  constructor(public courseService: CourseService) { }

  ngOnInit() {
    this.courseService.getAll().subscribe(res => this.courses = res)
  }

  updateCourses() {
    this.courseService.getSpecific("ACTURSCI", "1021B", "LEC").subscribe(res => this.courses = res)
  }
}
