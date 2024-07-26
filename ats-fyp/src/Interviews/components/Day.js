import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
// Import the global context to access shared state and functions
import GlobalContext from "../context/GlobalContext";

// Define a functional component named Day which takes 'day' and 'rowIdx' as props
export default function Day({ day, rowIdx }) {
  // Initialize a state variable to store events for the specific day
  const [dayEvents, setDayEvents] = useState([]);
  // Destructure necessary functions and variables from the global context
  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
  } = useContext(GlobalContext);

  // useEffect hook to filter and set events for the specific day whenever filteredEvents or day changes
useEffect(() => {
  // Filter events that match the given day
  const events = filteredEvents.filter(
    (evt) =>
      // Compare the formatted date of the event with the formatted date of the current day
      // Format both dates to "DD-MM-YY" to ensure they match
      dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
  );

  // Update the state with the filtered events
  setDayEvents(events);
}, [filteredEvents, day]); // Depend on filteredEvents and day to re-run the effect when these change

  
  // Function to get the CSS class for highlighting the current day
  function getCurrentDayClass() {
    // Return specific CSS classes if the day matches the current day
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }

  // Render the component UI
  return (
    <div className="border border-gray-200 flex flex-col">
      <header className="flex flex-col items-center">
        {/* Display the day of the week if it's the first row */}
        {rowIdx === 0 && (
          <p className="text-sm mt-1">
            {day.format("ddd").toUpperCase()}
          </p>
        )}
        {/* Display the day number with specific styling for the current day */}
        <p
          className={`text-sm p-1 my-1 text-center  ${getCurrentDayClass()}`}
        >
          {day.format("DD")}
        </p>
      </header>
      {/* Div for day events, sets the selected day and shows event modal on click */}
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day);
          setShowEventModal(true);
        }}
      >
        {/* Map over dayEvents to render each event */}
        {dayEvents.map((evt, idx) => (
          <div
            key={idx} // Unique key for each event
            onClick={() => setSelectedEvent(evt)} // Set the selected event on click
            className={`bg-${evt.label}-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`} // Dynamic class for event styling
          >
            {evt.title} {/* Display the event title */}
          </div>
        ))}
      </div>
    </div>
  );
}
