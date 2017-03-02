Vue.component('f-calendar', {
    data () {
        return {
            fListShow:false,
            fMonthShow:true,
            fToDayDisabled: true,
            currentDate: new Date(),
            events: [],
        }
    },
    props: {
        events: {
            type: Array,
            default: []
        }
    },
    computed: {
        title: {
            get: function (){
                var date = this.currentDate;
                return date.getFullYear() + "-" + (1 + date.getMonth());
            }
        },
        currentDates: function () {
            return this.getCalendar();
        },
        currentEvents: function(){
            return this.getCalList();
        }
    },
    methods: {
        fShowMonth(event){
            event.stopPropagation();
            this.fListShow = false;
            this.fMonthShow = true;
            var now = new Date(); // today
            var current = new Date(this.currentDate);
            if(this._isSameDay(now,current)){
                this.fToDayDisabled = true;
            }
        },
        fShowList(event){
            event.stopPropagation();
            this.fListShow = true;
            this.fMonthShow = false;
            this.fToDayDisabled = false;
        },
        fToDay(event){
            event.stopPropagation();
            this.fListShow = false;
            this.fMonthShow = true;
            this.fToDayDisabled = true;
            this.currentDate = new Date();
            //console.log(event.target.tagName + " -- " + this._format(this.currentDate, "yyyy-MM-dd"));
        },
        fPrevMonth(event){
            event.stopPropagation();
            this.fToDayDisabled = false;
            this.fListShow = false;
            this.fMonthShow = true;
            this.currentDate = this.changeMonth(this.currentDate, -1);
            //console.log(event.target.tagName + " -- " + this._format(this.currentDate, "yyyy-MM-dd"));
        },
        fNextMonth(event){
            event.stopPropagation();
            this.fToDayDisabled = false;
            this.fListShow = false;
            this.fMonthShow = true;
            this.currentDate = this.changeMonth(this.currentDate, 1);
            //console.log(event.target.tagName + " -- " + this._format(this.currentDate, "yyyy-MM-dd"));
        },
        changeMonth: function changeMonth(date, num) {
            var dt = new Date(date);
            return new Date(dt.setMonth(dt.getMonth() + num));
        },
        getCalendar() {
            var now = new Date(); // today
            var current = new Date(this.currentDate);
            var startDate = this._getStartDate(current);
            var curWeekDay = startDate.getDay();
            // begin date of this table may be some day of last month
            startDate.setDate(startDate.getDate() - curWeekDay + 1);
            //getDay()  0（周日） 到 6（周六）
            //getDate() 1 ~ 31
            //getFullYear()
            //getMonth() 月份 (0 ~ 11)
            var calendar = [];
            for (var perWeek = 0; perWeek < 6; perWeek++) {
                var week = [];
                for (var perDay = 0; perDay < 7; perDay++) {
                    week.push({
                        monthDay: startDate.getDate(),
                        isToday: now.toDateString() == startDate.toDateString(),
                        isCurMonth: startDate.getMonth() == current.getMonth(),
                        weekDay: perDay,
                        date: new Date(startDate),
                        events: this.slotEvents(startDate)
                    });

                    startDate.setDate(startDate.getDate() + 1);
                }
                calendar.push(week);
            }
            return calendar;
        },
        _getStartDate: function (date) {
            // return first day of this month
            return new Date(date.getFullYear(), date.getMonth(), 1);
        },
        _getEndDate: function (date) {
            // get last day of this month
            var dt = new Date(date.getFullYear(), date.getMonth() + 1, 1); // 1st day of next month
            return new Date(dt.setDate(dt.getDate() - 1)); // last day of this month
        },
        slotEvents: function (date) {
            // find all events start from this date
            var cellIndexArr = [];
            var thisDayEvents = this.events.filter(function (day) {
                var dt = new Date(day.start);
                var st = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
                var ed = day.end ? new Date(day.end) : st;
                // console.log('slotEvt', st, ed, date)
                return date >= st && date <= ed;
            });
            if(thisDayEvents.length > 0){
                // sort by duration
                thisDayEvents.sort(function (a, b) {
                    var at = new Date(a.start);
                    var bt = new Date(b.start);
                    return at.getTime() - bt.getTime();
//                    if (!a.cellIndex) return 1;
//                    if (!b.cellIndex) return -1;
//                    return a.cellIndex - b.cellIndex;
                });
            }
            // mark cellIndex and place holder
            for (var i = 0; i < thisDayEvents.length; i++) {
                thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || i + 1;
                thisDayEvents[i].isShow = true;
                if (thisDayEvents[i].cellIndex == i + 1 || i > 2) continue;
                thisDayEvents.splice(i, 0, {
                    title: 'holder',
                    cellIndex: i + 1,
                    start: this._format(date, 'yyyy-MM-dd'),
                    end: this._format(date, 'yyyy-MM-dd'),
                    isShow: false
                });
            }
            //console.log(JSON.stringify(thisDayEvents))

            return thisDayEvents;
        },
        getCalList: function getCalList(){
            var thisEventList = this.events;
            thisEventList.sort(function(a,b){
                var at = new Date(a.start);
                var bt = new Date(b.start);
                return at.getTime() - bt.getTime();
            });
            var eventList = [];
            var perDate = null;
            var weeks = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
            var _format = this._format;
            var _getFullHourName = this._getFullHourName;
            var _isSameDay = this._isSameDay;
            thisEventList.forEach(function(item, index, array) {
                var at = new Date(item.start);
                var addHeader = false;
                if (perDate != null) {
                    if(_isSameDay(perDate,at)){
                        addHeader = false;
                    }else{
                        addHeader = true;
                    }
                } else {
                    addHeader = true;
                }
                if(addHeader) {
                    eventList.push({
                        isHeader: true,
                        time: weeks[at.getDay()],
                        title:'',
                        date: _format(at, 'yyyy-MM-dd')
                    });
                }
                eventList.push({
                    isHeader: false,
                    time: _getFullHourName(at) + " - " + _getFullHourName(new Date(item.end)),
                    title:item.title,
                    date: _format(at, 'yyyy-MM-dd')
                });
                perDate = at;
            });
            return eventList;
        },
        _isSameDay(now,current){
            return (now.getFullYear() == current.getFullYear()
            && now.getMonth() == current.getMonth()
            && now.getDate() == current.getDate());
        },
        _getFullHourName(date){
            var h = date.getHours();
            var m = date.getMinutes();
            return ((h < 10) ? "0" + h : "" + h) + ":" + ((m < 10) ? "0" + m : "" + m) + (h > 12 ? "pm" : "am");
        },
        _getHourName(date){
            return date.getHours() > 12 ? "pm" : "am";
        },
        _format: function (date, _format) {
            if (typeof date === 'string') {
                date = new Date(date.replace(/-/g, '/'));
            } else {
                date = new Date(date);
            }

            var map = {
                'M': date.getMonth() + 1,
                'd': date.getDate(),
                'h': date.getHours(),
                'm': date.getMinutes(),
                's': date.getSeconds(),
                'q': Math.floor((date.getMonth() + 3) / 3),
                'S': date.getMilliseconds()
            };

            _format = _format.replace(/([yMdhmsqS])+/g, function (all, t) {
                var v = map[t];
                if (v !== undefined) {
                    if (all.length > 1) {
                        v = '0' + v;
                        v = v.substr(v.length - 2);
                    }
                    return v;
                } else if (t === 'y') {
                    return String(date.getFullYear()).substr(4 - all.length);
                }
                return all;
            });
            return _format;
        }
    },
    template: '   <div class="comp-full-calendar"> ' +
    '       <div class="full-calendar-header"> ' +
    '           <div class="header-left"> ' +
    '               <button class="ivu-btn ivu-btn-ghost" type="button" @click="fToDay" :disabled="fToDayDisabled"> ' +
    '                   <span>今天</span> ' +
    '               </button> ' +
    '           </div> ' +
    '           <div class="header-center"> ' +
    '               <span class="prev-month" @click="fPrevMonth">&lt;</span> ' +
    '               <span class="title">{{title}}</span> ' +
    '               <span class="next-month" @click="fNextMonth">&gt;</span></div> ' +
    '           <div class="header-right"> ' +
    '               <button class="ivu-btn ivu-btn-ghost" type="button" @click="fShowMonth"> ' +
    '                   <span>月历</span> ' +
    '               </button> ' +
    '               <button class="ivu-btn ivu-btn-ghost" type="button"> ' +
    '                   <span>日历</span> ' +
    '               </button> ' +
    '               <button class="ivu-btn ivu-btn-ghost" type="button" @click="fShowList"> ' +
    '                   <span>列表</span> ' +
    '               </button> ' +
    '           </div> ' +
    '       </div> ' +
    '       <div class="full-calendar-body"> ' +
    '           <div class="weeks" v-show="fMonthShow"> ' +
    '               <strong class="week">周一</strong> ' +
    '               <strong class="week">周二</strong> ' +
    '               <strong class="week">周三</strong> ' +
    '               <strong class="week">周四</strong> ' +
    '               <strong class="week">周五</strong> ' +
    '               <strong class="week">周六</strong> ' +
    '               <strong class="week">周日</strong> ' +
    '           </div> ' +
    '           <div class="dates" v-show="fMonthShow"> ' +
    '               <div class="dates-bg"> ' +
    '                   <div class="week-row" v-for="items in currentDates"> ' +
    '                       <div v-for="item in items" :class="{ \'day-cell\': true, \'today\': item.isToday, \'not-cur-month\': !item.isCurMonth  }"> ' +
        '                           <p class="day-number">{{item.monthDay}}</p> ' +
    '                       </div> ' +
    '                   </div> ' +
    '               </div> ' +
    '               <div class="dates-events" v-show="fMonthShow"> ' +
    '                   <div class="events-week" v-for="items in currentDates"> ' +
    '                       <div v-for="item in items" track-by="$index" ' +
    '                            :class="{ \'events-day\': true, \'today\': item.isToday, \'not-cur-month\': !item.isCurMonth  }"> ' +
        '                           <p class="day-number">{{item.monthDay}}</p> ' +
    '                           <div v-for="event in item.events" class="event-box"> ' +
    '                               <p class="event-item">{{event.title}}</p> ' +
    '                           </div> ' +
    '                       </div> ' +
    '                   </div> ' +
    '               </div> ' +
    '           </div> ' +
    '           <div class="lists" v-show="fListShow"> ' +
    '               <table class="list-table"> ' +
    '                   <tbody> ' +
    '                   <template v-for="item in currentEvents"> ' +
    '                       <tr class="list-header" v-if="item.isHeader"> ' +
    '                           <td colspan="3"> ' +
    '                               <a class="list-header-main" >{{item.time}}</a> ' +
    '                               <a class="list-header-alt">{{item.date}}</a> ' +
    '                           </td> ' +
    '                       </tr> ' +
    '                       <tr class="list-item" v-if="!item.isHeader"> ' +
    '                           <td class="fc-list-item-time fc-widget-content">{{item.time}}</td> ' +
    '                           <td class="fc-list-item-marker fc-widget-content"> ' +
    '                               <span class="fc-event-dot"></span> ' +
    '                           </td> ' +
    '                           <td class="fc-list-item-title fc-widget-content"> ' +
    '                               <a>{{item.title}}</a> ' +
    '                           </td> ' +
    '                       </tr> ' +
    '                   </template> ' +
    '                   </tbody> ' +
    '               </table> ' +
    '           </div> ' +
    '       </div> ' +
    '   </div> '
})