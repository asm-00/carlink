function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDefaultTripDates(defaultTripDays = 4) {
  const days = Math.max(1, Math.min(30, Math.round(defaultTripDays)));
  const start = new Date();
  start.setDate(start.getDate() + 1);

  const end = new Date(start);
  end.setDate(start.getDate() + days);

  return {
    startDate: toDateInputValue(start),
    endDate: toDateInputValue(end),
  };
}
