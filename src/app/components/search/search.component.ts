import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/Course';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  courses: Course[]
  timetableCourses;
  timetableName: string;


  constructor(private courseService: CourseService) {
  }

  ngOnInit(): void {
    this.courseService.getAll().subscribe(res => this.courses = res)
  }

  onSearch() {
    const subject = sanitize((<HTMLInputElement>document.getElementById("subjectSearch")).value)
    const course = sanitize((<HTMLInputElement>document.getElementById("courseSearch")).value)
    const comp = sanitize((<HTMLInputElement>document.getElementById("componentSearch")).value)


    this.courseService.getSpecific(subject, course, comp).subscribe(res => this.courses = res)
  }

  addTimetable() {
    const timetableInput = sanitize((<HTMLInputElement>document.getElementById("timetableInput")).value)
    if (timetableInput == '') {
      alert("Please enter a timetable name")
    } else {
      const timetable = {
        "timetable_name": timetableInput,
        "courses": []
      }
      this.courseService.addTimetable(timetable).subscribe()
    }
  }


  findTimetable() {
    const timetableInput = sanitize((<HTMLInputElement>document.getElementById("timetableInput")).value)
    if (timetableInput == '') {
      alert("Please enter a timetable name")
    } else {
      // this.courseService.findTimetable(timetableInput).subscribe(res => {
      //   this.timetableCourses = res;
      //   this.timetableName = timetableInput;
      // })
    }
  }

  addCourse() {
    const timetableInput = sanitize((<HTMLInputElement>document.getElementById("timetableInput")).value)
    const subject = sanitize((<HTMLInputElement>document.getElementById("subjectSearch")).value)
    const course = sanitize((<HTMLInputElement>document.getElementById("courseSearch")).value)

    if (timetableInput == '' || subject == '' || course == '') {
      alert("Enter a subject and course code in their input fields to add it to desired timetable in the timetable input field")
    } else {
      const timetable = {
        "timetable_name": timetableInput,
        "subject": subject,
        "catalog_nbr": course
      }
      this.courseService.addCourse(timetable).subscribe();
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
