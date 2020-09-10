/**
 * Format the date in YYYY-MM-DD.HH:MM format and return it
 *
 * @param {Date} dateObj
 */
export function formatDate(dateObj) {
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();
  let result = `${dateObj.getFullYear()}-`;
  result += month < 10 ? '0' : '';
  result += `${month}-`;
  result += date < 10 ? '0' : '';
  result += `${date}.`;
  result += `${dateObj.getHours()}:${dateObj.getMinutes()}`;
  return result;
}
