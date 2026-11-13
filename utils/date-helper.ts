const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// converts "12/11/2026" (MM/DD/YYYY) into the label the calendar uses, e.g. "Friday, 11 December, 2026"
export function formatDate(date: string): string {
  const [month, day, year] = date.split('/').map(Number);
  const d = new Date(year, month - 1, day);

  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date "${date}", expected MM/DD/YYYY`);
  }

  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}
