import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { getMonth } from "../util";
import "../interview.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// SmallCalendar component renders a compact calendar view
function SmallCalendar({ onDateSelected }) {
  // State to manage the current month index
  const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
  // State to hold the current month's dates
  const [currentMonth, setCurrentMonth] = useState(getMonth());

  // Update currentMonth when currentMonthIdx changes
  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIdx));
  }, [currentMonthIdx]);

  // Accessing global context for monthIndex and setDaySelected function
  const {
    monthIndex,
    setSmallCalendarMonth,
    setDaySelected,
  } = useContext(GlobalContext);

  // Sync monthIndex with currentMonthIdx
  useEffect(() => {
    setCurrentMonthIdx(monthIndex);
  }, [monthIndex]);

  // Handler for moving to the previous month
  function handlePrevMonth() {
    setCurrentMonthIdx(currentMonthIdx - 1);
  }

  // Handler for moving to the next month
  function handleNextMonth() {
    setCurrentMonthIdx(currentMonthIdx + 1);
  }

  // Handler for clicking on a day
  function handleDayClick(day, e) {
    e.stopPropagation(); // Prevent the event from bubbling up
    setDaySelected(day); // Set the selected day in the global context
    onDateSelected(day.format("YYYY-MM-DD")); // Notify parent component about the selected date
  }
  
  // Render the SmallCalendar component
  return (
    <div className="small-calendar">
      <header>
        <p> 
          {/* Button to move to the previous month */}
          <FaArrowLeft onClick={handlePrevMonth}/>  
          {/* Display the current month and year */}
          {dayjs(new Date(dayjs().year(), currentMonthIdx)).format(
            "MMMM YYYY"
          )}
          {/* Button to move to the next month */}
          <FaArrowRight onClick={handleNextMonth}/>
        </p>
      </header>
      {/* Render the grid of days */}
      <div className="grid">
        {/* Render the headers for each day */}
        {currentMonth[0].map((day, i) => (
          <span key={i} className="text-sm py-1 text-center">
            {/* Display the first letter of each day */}
            {day.format("dd").charAt(0)}
          </span>
        ))}
        {/* Render each day of the month */}
        {currentMonth.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the event from bubbling up
                  setSmallCalendarMonth(currentMonthIdx); // Set the small calendar month in the global context
                  handleDayClick(day, e); // Handle the click on the day
                }}
              >
                {/* Display the day of the month */}
                <span className="text-sm">{day.format("D")}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default SmallCalendar;
