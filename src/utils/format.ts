export const formatUSD = (num: number) => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K";
  }
  return num.toFixed(1);
};

export function abbreviateUSD(num: number) {
  let scaled = num;
  let suffix = "";

  if (num >= 1e9) {
    scaled = num / 1e9;
    suffix = "B";
  } else if (num >= 1e6) {
    scaled = num / 1e6;
    suffix = "M";
  } else if (num >= 1e3) {
    scaled = num / 1e3;
    suffix = "K";
  }

  // 소수 1자리 고정
  return { scaled: Number(scaled.toFixed(1)), suffix };
}
