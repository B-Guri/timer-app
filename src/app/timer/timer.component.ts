import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { interval, fromEvent, buffer, debounceTime, filter, map } from 'rxjs';

const observable = interval(1000);

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})

export class TimerComponent implements OnInit {
  minutes:number;
  seconds:number;
  isTimerWork: boolean;
  subscription: any;

  @ViewChild('start_btn') start_btn!: ElementRef;
  @ViewChild('stop_btn') stop_btn!: ElementRef;
  @ViewChild('wait_btn') wait_btn!: ElementRef;
  @ViewChild('reset_btn') reset_btn!: ElementRef;

  constructor(){
    this.minutes = 0; 
    this.seconds = 0;
    this.isTimerWork = false;
  }

  ngAfterViewInit():void{
    fromEvent(this.start_btn.nativeElement, "click").subscribe(() => {this.startTimer()});
    fromEvent(this.stop_btn.nativeElement, "click").subscribe(() => {this.stopTimer()});
    fromEvent(this.reset_btn.nativeElement, "click").subscribe(() => {this.resetTimer()});

    const click$ = fromEvent(this.wait_btn.nativeElement, "click");
    const doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(500))),
      map((clicks) => clicks.length),
      filter((clicksLength) => clicksLength >= 2)
    )
    doubleClick$.subscribe(() => {this.waitTimer()});
  }

  ngOnInit(): void {
  }

  startTimer():void{
    if(this.isTimerWork) return;
    this.isTimerWork = true; 
    this.subscription = observable.subscribe(() => {
      if(this.seconds >= 59){
        this.minutes += 1;
        this.seconds = 0;
      }
      else{
        this.seconds += 1;
      }
    });
  }

  stopTimer():void{
    this.subscription.unsubscribe();
    this.minutes = 0;
    this.seconds = 0;
    this.isTimerWork = false;
  }

  waitTimer():void{
    this.subscription.unsubscribe();
    this.isTimerWork = false;
  }

  resetTimer():void{
    this.stopTimer();
    this.startTimer();
  }
}
