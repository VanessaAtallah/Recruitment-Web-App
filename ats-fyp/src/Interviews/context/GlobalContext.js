import React from "react";

// Create a context with default values for the global state and functions
const GlobalContext = React.createContext({
  // Current index of the month being viewed
  monthIndex: 0,
  // Function to set the current month index
  setMonthIndex: (index) => {},
  
  // Index of the month for a smaller calendar component (e.g., a sidebar calendar)
  smallCalendarMonth: 0,
  // Function to set the index of the month for the smaller calendar
  setSmallCalendarMonth: (index) => {},

  // Currently selected day
  daySelected: null,
  // Function to set the currently selected day
  setDaySelected: (day) => {},

  // Boolean to control the visibility of the event modal
  showEventModal: false,
  // Function to set the visibility of the event modal
  setShowEventModal: () => {},

  // Function to dispatch actions to the calendar events reducer
  dispatchCalEvent: ({ type, payload }) => {},

  // Array to store all saved events
  savedEvents: [],

  // Currently selected event
  selectedEvent: null,
  // Function to set the currently selected event
  setSelectedEvent: () => {},

  // Function to set labels for categorizing events
  setLabels: () => {},
  // Array to store label data
  labels: [],

  // Function to update a specific label
  updateLabel: () => {},

  // Array to store events filtered based on certain criteria (e.g., by label)
  filteredEvents: [],
});

// Export the context to be used in other components
export default GlobalContext;
