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
  timetableCourses;
  timetableName: string;

  showAddTimetable = false;
  showAddCourse = false;
  showDeleteTimetable = false;
  showFindTimetable = false;
  showAddReview = false;
  constructor(public courseService: CourseService) { }

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

  //These buttons control the divs that are shown for the timetable UI
  addTimetableView() {
    this.showAddTimetable = !this.showAddTimetable;
  }
  addCourseView() {
    this.showAddCourse = !this.showAddCourse;
  }
  deleteTimetableView() {
    this.showDeleteTimetable = !this.showDeleteTimetable;
  }
  findTimetableView() {
    this.showFindTimetable = !this.showFindTimetable;
  }
  addReviewView() {
    this.showAddReview = !this.showAddReview;
  }



  addTimetable() {

    const userData = JSON.parse(localStorage.getItem('user'))
    const name = sanitize((<HTMLInputElement>document.getElementById("addTimetableName")).value.trim())
    const desc = sanitize((<HTMLInputElement>document.getElementById("addTimetableDesc")).value.trim())
    const visiblity = sanitize((<HTMLInputElement>document.getElementById("visibility")).value)
    const lastEdited = new Date();

    const timetable = {
      timetable: {
        name: name,
        desc: desc,
        visibility: visiblity,
        courses: [],
        lastEdited: lastEdited
      },
      email: userData.email,
      name: name
    }

    this.courseService.addTimetable(timetable).subscribe();
  }

  deleteTimetable() {
    const name = sanitize((<HTMLInputElement>document.getElementById("deleteTimetableName")).value.trim())
    const userData = JSON.parse(localStorage.getItem('user'));

    const info = {
      name: name,
      email: userData.email
    }

    this.courseService.deleteTimetable(info).subscribe();

  }

  addCourse() {
    const name = sanitize((<HTMLInputElement>document.getElementById("addCourseTimetableName")).value.trim())
    const subject = sanitize((<HTMLInputElement>document.getElementById("subjectName")).value.trim())
    const code = sanitize((<HTMLInputElement>document.getElementById("courseCode")).value.trim())
    const userData = JSON.parse(localStorage.getItem('user'));

    const info = {
      name: name,
      course: {
        subject: subject,
        catalog_nbr: code
      },
      date: new Date(),
      email: userData.email
    }

    this.courseService.addCourse(info).subscribe();

  }

  findTimetable() {
    const userData = JSON.parse(localStorage.getItem('user'));
    const name = sanitize((<HTMLInputElement>document.getElementById("findTimetableName")).value.trim())

    this.courseService.findTimetable(userData.email, name).subscribe(res => {
      this.timetableCourses = res;
      this.timetableName = name;
    });
  }

  addReview() {
    const userData = JSON.parse(localStorage.getItem('user'));
    const reviewedBy = userData.email;
    const subject = sanitize((<HTMLInputElement>document.getElementById("subject")).value.trim())
    const courseCode = sanitize((<HTMLInputElement>document.getElementById("courseCode")).value.trim())
    const date = new Date();
    const msg = sanitize((<HTMLInputElement>document.getElementById("msg")).value.trim());
    console.log(reviewedBy);



    const review = {

      "reviewedBy": reviewedBy,
      "subject": subject,
      "catalog_nbr": courseCode,
      "date": date,
      "msg": msg


    }


    this.courseService.addReview(review).subscribe();



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