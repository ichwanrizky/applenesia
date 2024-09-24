export const formattedDateNow = () => {
  // format date
  const currendDate = new Date();
  const formattedDate = new Date(currendDate);
  formattedDate.setHours(formattedDate.getHours() + 7);

  return formattedDate as Date;
};
