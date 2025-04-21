export const convertUnits = (
  value: number,
  from: string,
  to: string
): number => {
  if (from === to) return value;
  if (from === "centimetres" && to === "millimetres") return value * 10;
  if (from === "millimetres" && to === "centimetres") return value / 10;
  return value;
};
