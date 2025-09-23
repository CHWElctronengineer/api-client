export const formatJson = (jsonString) => {
  try {
    const jsonObject = JSON.parse(jsonString);
    return JSON.stringify(jsonObject, null, 2); // 들여쓰기 2칸으로 포맷팅
  } catch (e) {
    // JSON 형식이 아닌 경우 원본 문자열 반환
    return jsonString;
  }
};