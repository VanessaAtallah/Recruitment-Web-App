import dayjs from "dayjs";

// Function to generate a matrix representing the days of a month
export function getMonth(month = dayjs().month()) {
  // Ensure month is a whole number
  month = Math.floor(month);
  
  // Get the current year
  const year = dayjs().year();

  // Get the day of the week for the first day of the month
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  
  // Initialize a counter for the days of the month
  let currentMonthCount = 0 - firstDayOfTheMonth;

  // Create a matrix representing the days of the month
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      // Increment the counter to represent the current day of the month
      currentMonthCount++;

      // Create a dayjs object representing the current day
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });

  // Return the matrix representing the days of the month
  return daysMatrix;
}
