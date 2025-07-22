export function ExcelDateToJSDate(serial: number): string {
  const utc_days = Math.floor(serial - 25569); // Excel epoch starts at 1900-01-01
  const utc_value = utc_days * 86400; // seconds in a day
  const date_info = new Date(utc_value * 1000); // milliseconds

  // Format to YYYY-MM-DD
  const year = date_info.getUTCFullYear();
  const month = String(date_info.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date_info.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
