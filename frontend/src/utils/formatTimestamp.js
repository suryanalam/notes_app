const getFormattedTimestamp = (timestamp) => {
  const utcDate = new Date(timestamp);

  const day = String(utcDate.getDate()).padStart(2, "0");
  const month = String(utcDate.getMonth() + 1).padStart(2, "0");
  const year = utcDate.getFullYear();
  const hours = String(utcDate.getHours()).padStart(2, "0");
  const minutes = String(utcDate.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export default getFormattedTimestamp;
