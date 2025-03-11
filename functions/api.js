/*
 * Copyright (c) molikai-work (2025)
 * molikai-work 的特定修改和新增部分
 * 根据 MIT 许可证发布
 */

// UpTimerRobot API 代理
export async function onRequest(context) {
    const { request, env } = context;
    const method = request.method.toUpperCase();

    // 处理 OPTIONS 请求，直接返回 CORS 标头
    if (method === "OPTIONS") {
        return new Response(null, { status: 204, headers: getCorsHeaders() });
    }

    // 仅允许 POST 请求
    if (method !== "POST") {
        return sendErrorResponse(405, "Method Not Allowed");
    }

    try {
        const requestBody = await request.json();
        const apiKeyMapping = await parseApiKeyMapping(env.API_KEY_MAPPING);

        // 过滤请求参数
        const filteredBody = filterParams(requestBody, [
            "api_key", "custom_uptime_ranges", "log_types", "logs", "logs_end_date", "logs_start_date",
        ]);

        // 校验 API 密钥
        if (!isValidApiKey(filteredBody.api_key, apiKeyMapping)) {
            return sendErrorResponse(403, "Invalid API key");
        }

        // 更新 API 密钥并添加格式参数
        filteredBody.api_key = apiKeyMapping[filteredBody.api_key];
        filteredBody.format = "json";

        // 检查 KV 中是否有缓存
        let cachedResponse = await getCachedResponse(env.KV, filteredBody.api_key);
        if (cachedResponse) {
            return new Response(cachedResponse, { status: 200, headers: getCorsHeaders() });
        }

        // 请求 UptimeRobot API
        const apiUrl = "https://api.uptimerobot.com/v2/getMonitors";
        const apiResponse = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filteredBody),
        });

        // 解析 API 响应
        const responseBody = await parseJson(apiResponse);

        // 如果要隐藏 URL，则修改返回数据中的 monitors.url、monitor.sub_type 以及 monitor.port 字段
        if (env.HIDE_URL === "true" && responseBody?.monitors) {
            responseBody.monitors.forEach(monitor => {
                monitor.url = null;
                monitor.sub_type = null;
                monitor.port = null;
            });
        }

        // 如果要隐藏 Auth 信息，则修改返回数据中的 monitors.http_username、monitors.http_password 以及 monitors.http_auth_type 字段
        if (env.HIDE_AUTH === "true" && responseBody?.monitors) {
            responseBody.monitors.forEach(monitor => {
                monitor.http_username = null;
                monitor.http_password = null;
                monitor.http_auth_type = null;
            });
        }

        // 缓存 API 响应
        if (apiResponse.status === 200 && env.KV) {
            await cacheResponse(env.KV, filteredBody.api_key, responseBody, env.KV_TTL);
        }

        // 返回 API 响应
        return new Response(JSON.stringify(responseBody), {
            status: apiResponse.status,
            headers: getCorsHeaders(),
        });
    } catch (error) {
        // 处理错误
        console.error("Error processing request:", error);
        return sendErrorResponse(500, "Internal Server Error");
    }
}

// 解析 API 密钥映射
async function parseApiKeyMapping(apiKeyMappingEnv) {
    try {
        return JSON.parse(apiKeyMappingEnv || "{}");
    } catch (error) {
        throw new Error("Error parsing API_KEY_MAPPING");
    }
}

// 校验 API 密钥是否有效
function isValidApiKey(apiKey, apiKeyMapping) {
    return apiKey && apiKeyMapping[apiKey];
}

// 发送错误响应
function sendErrorResponse(status, message) {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: getCorsHeaders(),
    });
}

// 获取 CORS 标头
function getCorsHeaders() {
    return {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=180, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
    };
}

// 解析 JSON 响应并返回数据或错误
async function parseJson(response) {
    try {
        const text = await response.text();
        return JSON.parse(text);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
    }
}

// 过滤请求参数
function filterParams(requestBody, allowedParams) {
    return Object.fromEntries(
        Object.entries(requestBody).filter(([key]) => allowedParams.includes(key)),
    );
}

// 获取 KV 缓存中的响应
async function getCachedResponse(KV, cacheKey) {
    try {
        return KV ? await KV.get(cacheKey) : null;
    } catch (kvError) {
        console.error("KV get error:", kvError);
        return null;
    }
}

// 将响应保存到 KV 缓存
async function cacheResponse(KV, cacheKey, responseBody, TTL = 180) {
    try {
        await KV.put(cacheKey, JSON.stringify(responseBody), { expirationTtl: TTL });
    } catch (kvError) {
        console.error("KV put error:", kvError);
    }
}
