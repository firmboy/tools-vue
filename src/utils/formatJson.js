/**
 * 格式化JSON字符串
 * @param {string|object} json 需要格式化的JSON字符串或对象
 * @param {number} indent 缩进空格数，默认为2
 * @returns {string} 格式化后的JSON字符串
 */
export function formatJson(json, indent = 2) {
  try {
    // 如果输入是字符串，先尝试解析
    const obj = typeof json === 'string' ? JSON.parse(json) : json;
    // 返回格式化的JSON字符串
    return JSON.stringify(obj, null, indent);
  } catch (error) {
    console.error('JSON格式化失败:', error);
    return '无效的JSON';
  }
} 