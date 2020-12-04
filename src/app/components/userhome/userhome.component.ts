import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/Course';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.css']
})
export class UserhomeComponent implements OnInit {
  courses: Course[]
  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
  }

  onSearch() {
    const subject = sanitize((<HTMLInputElement>document.getElementById("subjectSearch")).value.trim().toUpperCase())
    const course = sanitize((<HTMLInputElement>document.getElementById("courseSearch")).value.trim().toUpperCase())
    const comp = sanitize((<HTMLInputElement>document.getElementById("componentSearch")).value.trim().toUpperCase())
    const keyword = sanitize((<HTMLInputElement>document.getElementById("keywordSearch")).value.trim().toUpperCase())

    if ((subject + course + comp) == "" && keyword != "") {
      this.courseService.getKeyword(keyword).subscribe(res => this.courses = res);
    } else {
      this.courseService.getSpecific(subject, course, comp).subscribe(res => this.courses = res)
    }
  }

}


//For input sanitization
function sanitize(string) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match) => (map[match]));
}