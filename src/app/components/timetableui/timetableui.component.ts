import { Component, Input, OnInit } from '@angular/core';
import { Timetable } from 'src/app/models/Timetable';

@Component({
  selector: 'app-timetableui',
  templateUrl: './timetableui.component.html',
  styleUrls: ['./timetableui.component.css']
})
export class TimetableuiComponent implements OnInit {
  @Input() course: Timetable["courses"];
  constructor() { }

  ngOnInit(): void {
  }

}
