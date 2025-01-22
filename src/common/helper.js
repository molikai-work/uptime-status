/**
 * 格式化数值，保留两位小数并转换为字符串
 * @param {number} value - 需要格式化的数值
 * @returns {string} - 返回格式化后的字符串
 */
export function formatNumber(value) {
    return (Math.floor(value * 100) / 100).toString();
}

/**
 * 将秒数格式化为小时、分钟、秒的可读文本
 * @param {number} seconds - 需要格式化的秒数
 * @returns {string} - 返回格式化后的时间字符串
 */
export function formatDuration(seconds) {
    let s = parseInt(seconds); // 转换为整数
    let m = 0;
    let h = 0;

    // 计算分钟和剩余秒数
    if (s >= 60) {
        m = parseInt(s / 60);
        s = parseInt(s % 60);

        // 计算小时和剩余分钟数
        if (m >= 60) {
            h = parseInt(m / 60);
            m = parseInt(m % 60);
        }
    }

    // 生成格式化的时间文本
    let text = `${s} 秒`;
    if (m > 0) {text = `${m} 分 ${text}`;}
    if (h > 0) {text = `${h} 小时 ${text}`;}

    return text;
}
