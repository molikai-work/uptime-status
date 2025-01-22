window.Config = {
    // 网站显示标题
    SiteName: "Site Status",

    // UptimeRobot Api Url
    // 官方 API 地址: https://api.uptimerobot.com/v2/getMonitors
    // 免费计划请求速率限制为 1 分钟 10 次
    ApiUrl: "https://api.uptimerobot.com/v2/getMonitors",

    // UptimeRobot Api Key
    // 可以添加使用多个 Api Key，以数组形式
    // 支持使用数组来排序监控站点的显示顺序
    ApiKeys: [
        "m798394721-1e1f5d316f861d45fa59c0d8",
        "m798394735-d65b28f39861eef93173840a",
        "m798394741-52ccb001d5c17e285311b54f",
        "m798394750-b74c343230b943430f5e71c6",
    ],

    // 显示日志天数
    // 免费计划最多能获取近 90 天的数据
    CountDays: 60,

    // 是否显示检测站点的链接
    ShowLink: true,

    // 检测站点的链接的链接的 rel 属性
    LinkRel: "noopener noreferrer",

    // 检测站点的链接的链接的target 属性
    LinkTarget: "_blank",

    // 时间轴方向
    // 填 asc 或 desc，等同于显示日期“从旧到新”或“从新到旧”
    TimelineDirection: "asc",

    // 导航栏菜单
    Navi: [
        {
            text: "示例",
            url: "https://example.com/",
        },
        {
            text: "NET",
            url: "https://example.net/",
            target: "_blank",
        },
        {
            text: "ORG",
            url: "https://example.org/",
            rel: "external nofollow noopener noreferrer",
            target: "_blank",
        },
    ],

    // 页脚信息
    Footer: {
        CopyrightName: "SiteStatus", // 版权信息
        CopyrightUrl: "/", // 版权链接
        StartYear: 2025, // 网站创建年份，会自动更新年份
    },
};
