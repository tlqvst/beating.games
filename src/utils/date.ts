export function isDateParseable(dateString: string): boolean {
  // Attempt to create a new Date object from the date string
  const parsedDate = new Date(dateString);

  // Check if the parsed date is a valid date
  // The getTime() method returns NaN for invalid dates
  return !isNaN(parsedDate.getTime());
}
