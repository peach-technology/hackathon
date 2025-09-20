// 두 포맷 공통 파서: [TOKEN0, TOKEN1, APR%문자열] 반환
const parsePoolTokens = (poolName = "", dexName = "") => {
  // 1) 먼저 dexName 제거
  const trimmed = poolName.replace(dexName, "").trim();

  // 2) 포맷 A: "TOKEN0 / TOKEN1 0.05%"
  //    공백과 슬래시로 나누면 [token0, token1, apr] 가 됨
  const a = trimmed.split(/\/|\s+/).filter(Boolean);
  if (a.length >= 3 && /%$/.test(a[a.length - 1])) {
    const token0 = (a[0] || "").toUpperCase();
    const token1 = (a[1] || "").toUpperCase();
    const aprStr = a[2] || "";
    return [token0, token1, aprStr];
  }

  // 3) 포맷 B: "uniswap-v3-unichain-weth-usdc-3000"
  //    하이픈으로 분해 후, dexName 분해 길이만큼을 잘라냄 → [token0, token1, feeBps]
  const nameParts = poolName.split("-").filter(Boolean);
  const dexParts = dexName.split("-").filter(Boolean);
  const rest = nameParts.slice(dexParts.length); // 기대: [token0, token1, feeBps]

  if (rest.length >= 3) {
    const token0 = (rest[0] || "").toUpperCase();
    const token1 = (rest[1] || "").toUpperCase();
    const feeBps = rest[2] || ""; // e.g., "3000"
    const aprStr = /^\d+$/.test(feeBps) ? `${(Number(feeBps) / 100).toFixed(2)}%` : `${feeBps}`;
    return [token0, token1, aprStr];
  }

  // 4) 실패 시 빈값
  return ["", "", ""];
};

export default parsePoolTokens;
