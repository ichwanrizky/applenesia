export const WarrantyDisplay = (warranty: number) => {
  if (warranty < 30) {
    return `${warranty} hari`;
  } else if (warranty % 30 === 0 && warranty < 360) {
    return `${warranty / 30} bulan`;
  } else if (warranty === 360) {
    return `1 tahun`;
  } else if (warranty > 30 && warranty % 30 !== 0 && warranty < 360) {
    return `${warranty} hari`;
  } else {
    return `${warranty} hari`;
  }
};
