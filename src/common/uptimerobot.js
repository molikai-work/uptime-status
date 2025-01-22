import axios from "axios"; // 引入 axios 用于 HTTP 请求
import dayjs from "dayjs"; // 引入 dayjs 处理日期时间
import { formatNumber } from "./helper"; // 引入格式化数字的工具函数

/**
 * 获取 UptimeRobot 监控信息
 * @param {string} apikey - API 密钥
 * @param {number} days - 要获取的天数
 * @returns {Promise<Array>} - 返回一个包含监控信息的数组
 */
export async function GetMonitors(apikey, days) {
    // UptimeRobot API URL
    const apiUrl = window.Config.ApiUrl || "https://api.uptimerobot.com/v2/getMonitors";

    const dates = []; // 存储日期数组
    const today = dayjs(new Date().setHours(0, 0, 0, 0)); // 获取当天 00:00:00 时间点

    // 生成最近 days 天的日期
    for (let d = 0; d < days; d++) {
        dates.push(today.subtract(d, "day"));
    }

    // 计算时间范围（以 Unix 时间戳表示）
    const ranges = dates.map((date) => `${date.unix()}_${date.add(1, "day").unix()}`);
    const start = dates[dates.length - 1].unix(); // 计算起始时间戳
    const end = dates[0].add(1, "day").unix(); // 计算结束时间戳
    ranges.push(`${start}_${end}`); // 加入总时间范围

    // 发送给 API 的请求数据
    const postdata = {
        api_key: apikey,
        format: "json", // 期望返回 JSON 数据
        logs: 1, // 启用日志数据
        log_types: "1-2", // 仅获取宕机和恢复日志
        logs_start_date: start, // 日志起始时间
        logs_end_date: end, // 日志结束时间
        custom_uptime_ranges: ranges.join("-"), // 自定义时间范围
    };

    // 发送 POST 请求到 UptimeRobot API
    const response = await axios.post(apiUrl, postdata, { timeout: 10000 });
    if (response.data.stat !== "ok") { throw response.data.error; } // 如果 API 返回错误，则抛出异常

    return response.data.monitors.map((monitor) => {
        const ranges = monitor.custom_uptime_ranges.split("-"); // 拆分自定义可用率范围
        const average = formatNumber(ranges.pop()); // 取出最后一个值作为整体平均可用率

        const daily = []; // 存储每日数据
        const map = {}; // 用于日期索引映射

        // 遍历日期数组，初始化 daily 数据
        dates.forEach((date, index) => {
            map[date.format("YYYYMMDD")] = index; // 记录日期索引
            daily[index] = {
                date: date, // 日期对象
                uptime: formatNumber(ranges[index]), // 可用率
                down: { times: 0, duration: 0 }, // 记录宕机次数和持续时间
            };
        });

        // 统计日志中的宕机数据
        const total = monitor.logs.reduce((total, log) => {
            if (log.type === 1) { // 1 代表宕机事件
                const date = dayjs.unix(log.datetime).format("YYYYMMDD"); // 获取日志日期
                total.duration += log.duration; // 累加宕机时长
                total.times += 1; // 累加宕机次数
                daily[map[date]].down.duration += log.duration; // 记录到 daily 数据中
                daily[map[date]].down.times += 1;
            }
            return total;
        }, { times: 0, duration: 0 }); // 初始化总计对象

        // 组装最终结果对象
        const result = {
            id: monitor.id, // 监控 ID
            name: monitor.friendly_name, // 监控名称
            url: monitor.url, // 监控 URL
            average: average, // 平均可用率
            daily: daily, // 每日可用率数据
            total: total, // 总宕机时长与次数
            status: "unknow", // 初始状态（未知）
        };

        // 根据状态码设置状态信息
        if (monitor.status === 2) { result.status = "ok"; } // 2 代表正常运行
        if (monitor.status === 9) { result.status = "down"; } // 9 代表宕机

        return result;
    });
}
