export const formatDateTime = timeToFormat => {
  const [date, time] = timeToFormat.split(/\.(?=[^.]+$)/);

  return `${date.trim()} - ${time.trim()}`;
};
