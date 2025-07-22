export const generateTrackingId = () => {
  const prefix = "FC";
  const now = Date.now();
  //   const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0"); // Random number between 0 and 9999, padded to 4 digits

  return `${prefix}-${now}`;
};
