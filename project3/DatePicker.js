        function DatePicker(id, callBackFunc) {
          this.id=id;
          // call callBackFunc on click
          this.callBackFunc=callBackFunc;

          // create container
          var containerClassName="container";
          var containerDiv=document.createElement("DIV");
          containerDiv.classList.add(containerClassName);
          document.getElementById(id).appendChild(containerDiv);

          this.containerDiv=containerDiv;
        }


        DatePicker.prototype.render=function(date) {
          var i,j;
          // metadata for names of weeks and months
          var num2weekday=["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
          var num2month=["January","Febuary","March","April","May","June","July","August","September","October","November","December"];

          // a class
          function MyDate(date) {
            this.year=date.getFullYear();
            this.month=date.getMonth()+1;
            this.day=date.getDate();
            this.weekday=date.getDay()%7;
            this.isCurrentMonth=true;
          }

          MyDate.prototype.toString= function() {
            return this.month+"/"+this.day+"/"+this.year;

          };
          // *** SOME HELPER FUNCTIONS***//

          // a function that gets meta data of this month
          // such as how many days are there and how to arrange the
          // dates
          function getMonthDays(thisDate) {
            var startingDateStr=thisDate.month+"/1/"+thisDate.year;
            var dayOfMonth = new Date(startingDateStr);
            var dateStartingPoint= new Date(startingDateStr);
            var iterDate;
            dateStartingPoint.setDate(dateStartingPoint.getDate()-dateStartingPoint.getDay());

            var arrayOfDates=[];
            dayOfMonth=dateStartingPoint;

            for (var ii=0;ii<42;ii++) {
              iterDate=new MyDate(dayOfMonth);
              if (dayOfMonth.getMonth()!=thisDate.month-1) {
                iterDate.isCurrentMonth=false;
              }
              arrayOfDates.push(iterDate);
              dayOfMonth.setDate(dayOfMonth.getDate()+1);
            }
            return arrangeDates(arrayOfDates);
          }

          // a function that gets the month-year title of the datepicker
          function getMonthYear(thisDate) {
            return num2month[thisDate.month-1].toUpperCase()+" "+thisDate.year;
          }

          // arrange an array of dats into weeks
          function arrangeDates(arrayOfDates) {
            var arrayOfWeeks=[];
            var oneWeek=[];
            for (i=0;i<arrayOfDates.length;i++) {
              var thisDay=arrayOfDates[i];
              oneWeek.push(thisDay);
              if (thisDay.weekday==6) {
                arrayOfWeeks.push(oneWeek);
                oneWeek=[];
              }
            }
            return arrayOfWeeks.slice(0,6);
          }

          function changeMonth(previousDate,amount) {
            var newDate=previousDate;
            if (amount===1) {
              // increase by 1
              if (newDate.month==12) {
                newDate.year=newDate.year+1;
                newDate.month=1;
              } else {
                newDate.month=newDate.month+1;
              }
            } else {
              // decrease by 1
              if (newDate.month==1) {
                newDate.year=newDate.year-1;
                newDate.month=12;
              } else {
                newDate.month=newDate.month-1;
              }
            }
            newDate.day=1;
            return newDate;
          }

          var self=this;
          var id=this.id;
          var datepickerDiv=document.getElementById(id);
          var myDate=new MyDate(date);


          // add container
          var containerDiv=this.containerDiv;


          // add header bar (including the year and month)
          var headerBarClassName="headerBar";
          var headerBarDiv=document.createElement("DIV");
          headerBarDiv.classList.add(headerBarClassName);
          containerDiv.appendChild(headerBarDiv);


          // add header bar (including the year and month)



          var monthButtomClassName="monthButtom";
          var prevMonthDiv= document.createElement("DIV");
          prevMonthDiv.classList.add(monthButtomClassName);
          prevMonthDiv.innerHTML="<";
          headerBarDiv.appendChild(prevMonthDiv);

          // make a copy of myDate
          var aDate=new MyDate(new Date());
          aDate.year=myDate.year;
          aDate.month=myDate.month;
          aDate.day=myDate.day;

          (function(someDate) {
            prevMonthDiv.addEventListener("click", function() {
              containerDiv.innerHTML="";
              var newDate=changeMonth(someDate,-1);
              self.render(new Date(newDate.toString()));
            },false);
          })(aDate);

          // add year and week name
          var monthYearBarClassName="monthYearBar";
          var monthYearBarDiv=document.createElement("DIV");
          monthYearBarDiv.classList.add(monthYearBarClassName);
          monthYearBarDiv.innerHTML=getMonthYear(myDate);
          headerBarDiv.appendChild(monthYearBarDiv);



          var nextMonthDiv= document.createElement("DIV");
          nextMonthDiv.classList.add(monthButtomClassName);
          nextMonthDiv.innerHTML=">";
          headerBarDiv.appendChild(nextMonthDiv);

          (function(someDate) {
            nextMonthDiv.addEventListener("click", function() {
              containerDiv.innerHTML="";
              var newDate=changeMonth(someDate,+1);

              self.render(new Date(newDate.toString()));
            },false);
          })(aDate);



          // add weekday div
          var weekdayBarClassName="weekdayBar";
          var weekdayBarDiv=document.createElement("DIV");
          weekdayBarDiv.classList.add(weekdayBarClassName);
          containerDiv.appendChild(weekdayBarDiv);


          //
          var paddingBarClassName="paddingBar";
          var paddingBarDiv=document.createElement("DIV");
          paddingBarDiv.classList.add(paddingBarClassName);
          containerDiv.appendChild(paddingBarDiv);

          // add weekday div
          var weekdaysContainerClassName="weekdaysContainer";
          var weekdaysContainerDiv=document.createElement("DIV");
          weekdaysContainerDiv.classList.add(weekdaysContainerClassName);
          containerDiv.appendChild(weekdaysContainerDiv);

          // add weekday names
          var weekdayNamesClassName="weekdayNames";
          var weekdayNamesDiv;
          for (i = 0;i<7;i++) {
            weekdayNamesDiv=document.createElement("DIV");
            weekdayNamesDiv.innerHTML=num2weekday[i];
            weekdayNamesDiv.classList.add(weekdayNamesClassName);
            weekdayBarDiv.appendChild(weekdayNamesDiv);
          }

          // add days
          // each day in the selected month should have a property
          // that on fires on click

          var thisMonthDates=getMonthDays(myDate);
          var weekRowDiv;
          var daysInAMonthDiv;
          var weekRowClassName="weekRow";
          var daysInAMonthClassName="daysInAMonth";
          var daysNotInAMonthClassName="daysNotInAMonth";
          var oneDayClassName="oneDay";
          var selectedClassName="selected";
          var floatDirection;
          for (i=0;i<thisMonthDates.length;i++) {
            if (i===0 || thisMonthDates[i][0].isCurrentMonth) {
              floatDirection="left";
              weekRowDiv=document.createElement("DIV");
              weekRowDiv.classList.add(weekRowClassName);
              weekdaysContainerDiv.appendChild(weekRowDiv);

              var oneWeekDays=thisMonthDates[i];
              for (j=0;j<oneWeekDays.length;j++) {
                daysInAMonthDiv=document.createElement("DIV");

                daysInAMonthDiv.innerHTML=oneWeekDays[j].day;
                daysInAMonthDiv.style.float=floatDirection;
                weekRowDiv.appendChild(daysInAMonthDiv);
                daysInAMonthDiv.classList.add(oneDayClassName);
                if (oneWeekDays[j].isCurrentMonth) {
                  // need to add callBackFunc here
                  daysInAMonthDiv.classList.add(daysInAMonthClassName);
                  var selectedDate=oneWeekDays[j];
                  (function(selectedDate,daysInAMonthDiv) {
                    daysInAMonthDiv.addEventListener("click",function() {
                      //

                      var arrOfAllDates=document.getElementById(self.id).getElementsByClassName(daysInAMonthClassName);
                      var currentClassList;
                      for (var jj=0;jj<arrOfAllDates.length;jj++) {
                        arrOfAllDates[jj].classList.remove(selectedClassName);
                      }

                      daysInAMonthDiv.classList.add(selectedClassName);
                      // execute callBackFunc
                      self.callBackFunc(self.id,selectedDate);
                    },false);
                  })(selectedDate,daysInAMonthDiv);
                  //
                } else {
                  daysInAMonthDiv.classList.add(daysNotInAMonthClassName);

                }
              }
            }

          }

          // on click right


        };