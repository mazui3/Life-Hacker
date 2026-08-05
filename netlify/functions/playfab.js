// Parse stats from pipe-separated string
function parseStats(statsStr) {
  const result = {};
  if (!statsStr) return result;
  const parts = statsStr.split("|");
  for (const part of parts) {
    const colonIndex = part.lastIndexOf(":");
    if (colonIndex !== -1) {
      const key = part.slice(0, colonIndex).toLowerCase().trim();
      const val = parseInt(part.slice(colonIndex + 1), 10);
      if (key && !isNaN(val)) {
        result[key] = val;
      }
    }
  }
  return result;
}

// Serialize stats back to pipe-separated string
function serializeStats(stats) {
  return Object.entries(stats)
    .map(([key, val]) => `${key}:${val}`)
    .join("|");
}

export const handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const titleId = process.env.PLAYFAB_TITLE_ID || "F6CF6";
    const secretKey = process.env.PLAYFAB_SECRET_KEY; // 必须在 Netlify 后台配置好

    const body = event.body ? JSON.parse(event.body) : {};
    const { action, playFabId } = body; // 👈 统一改为接收前端传来的 playFabId

    if (!action || !playFabId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Missing action or playFabId" }),
      };
    }

    // 1. 获取 Unity 玩家在 PlayFab 上的数据
    if (action === "get_stats") {
      // 💡 注意：这里改用了 Server 端的 API (Server/GetUserData)
      const response = await fetch(`https://${titleId}.playfabapi.com/Server/GetUserData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-SecretKey": secretKey // 👈 使用管理员密钥鉴权

        },
        body: JSON.stringify({
          PlayFabId: playFabId, // 👈 直接用 Unity 那个 ID 查
          Keys: ["search_stats", "search_cate", "game_time", "game_timestamp", "timestamp", "time_stamp", "weather_data", "weather", "forecast", "weather_forecast", "player_state"],
        }),
      });

      const data = await response.json();

      if (response.ok && data.code === 200) {
        const userData = data.data.Data || {};
        const searchStatsStr = userData.search_stats ? userData.search_stats.Value : "";
        const searchCateStr = userData.search_cate ? userData.search_cate.Value : "";
        const gameTimeVal = (userData.game_time || userData.game_timestamp || userData.timestamp || userData.time_stamp)?.Value || "";
        const weatherVal = (userData.weather_data || userData.weather || userData.forecast || userData.weather_forecast)?.Value || "";
        const playerStateVal = userData.player_state ? userData.player_state.Value : "";
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            stats: searchStatsStr,
            cate: searchCateStr,
            gameTime: gameTimeVal,
            weatherData: weatherVal,
            playerState: playerStateVal,
          }),
        };
      } else {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: data.errorMessage || "Failed to fetch user stats" }),
        };
      }
    }

    // 2. 修改/递增 Unity 玩家在 PlayFab 上的数据
    if (action === "update_stats" || action === "update_batch_stats") {
      const { keyword, category, items } = body;
      // 先获取当前数据
      const getResponse = await fetch(`https://${titleId}.playfabapi.com/Server/GetUserData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-SecretKey": secretKey
        },
        body: JSON.stringify({
          PlayFabId: playFabId,
          Keys: ["search_stats", "search_cate", "game_time", "game_timestamp", "timestamp", "time_stamp", "weather_data", "weather", "forecast", "weather_forecast"],
        }),
      });

      const getData = await getResponse.json();
      let statsMap = {};
      let cateMap = {};
      let gameTimeVal = "";
      let weatherVal = "";
      
      if (getResponse.ok && getData.code === 200) {
        const userData = getData.data.Data || {};
        const searchStatsStr = userData.search_stats ? userData.search_stats.Value : "";
        statsMap = parseStats(searchStatsStr);
        const searchCateStr = userData.search_cate ? userData.search_cate.Value : "";
        cateMap = parseStats(searchCateStr);
        gameTimeVal = (userData.game_time || userData.game_timestamp || userData.timestamp || userData.time_stamp)?.Value || "";
        weatherVal = (userData.weather_data || userData.weather || userData.forecast || userData.weather_forecast)?.Value || "";
      }

      // 递增计数
      if (action === "update_batch_stats" && Array.isArray(items)) {
        for (const item of items) {
          const itemCat = item.category;
          const itemKw = item.keyword;
          if (itemCat) statsMap[itemCat.toLowerCase().trim()] = (statsMap[itemCat.toLowerCase().trim()] || 0) + 1;
          if (itemKw) statsMap[itemKw.toLowerCase().trim()] = (statsMap[itemKw.toLowerCase().trim()] || 0) + 1;
        }
      } else {
        if (category) {
          statsMap[category.toLowerCase().trim()] = (statsMap[category.toLowerCase().trim()] || 0) + 1;
          // Also increment search_cate for this category
          cateMap[category.toLowerCase().trim()] = (cateMap[category.toLowerCase().trim()] || 0) + 1;
        }
        if (keyword) statsMap[keyword.toLowerCase().trim()] = (statsMap[keyword.toLowerCase().trim()] || 0) + 1;
      }
      const updatedStatsStr = serializeStats(statsMap);
      const updatedCateStr = serializeStats(cateMap);

      // 💡 注意：这里改用了 Server 端的 API (Server/UpdateUserData)
      const updateResponse = await fetch(`https://${titleId}.playfabapi.com/Server/UpdateUserData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-SecretKey": secretKey
        },
        body: JSON.stringify({
          PlayFabId: playFabId, // 👈 锁定该 Unity 玩家
          Data: { 
            search_stats: updatedStatsStr,
            search_cate: updatedCateStr
          },
        }),
      });

      const updateData = await updateResponse.json();

      if (updateResponse.ok && updateData.code === 200) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, stats: updatedStatsStr, cate: updatedCateStr, gameTime: gameTimeVal }),
        };
      } else {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: updateData.errorMessage || "Failed to update user stats" }),
        };
      }
    }
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Invalid action" }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: error.message }) };
  }
};
