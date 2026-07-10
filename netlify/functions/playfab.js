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
  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  try {
    const titleId = process.env.PLAYFAB_TITLE_ID || "F6CF6"; // Fallback Title ID if not set
    const secretKey = process.env.PLAYFAB_SECRET_KEY; // Optional secret key

    // 打印日志，方便我们在 Netlify 部署面板或本地终端一眼看出问题
    console.log("收到的原始 Body:", event.body);

    let body = {};
    if (event.body) {
      try {
        // 如果原本就是对象，直接用；如果是字符串，才去 parse
        body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      } catch (parseError) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "JSON 解析失败: " + parseError.message, raw: event.body }),
        };
      }
    }
    const { action } = body;

    if (!action) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Missing action in request body",
          debugReceivedBody: body, // 👈 把收到的东西原封不动丢回给前端，让我们在浏览器里看看它到底收到了啥
          debugRawBody: event.body
        }),
      };
    }

    if (action === "login") {
      const { customId } = body;
      if (!customId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "Missing customId" }),
        };
      }

      // Call PlayFab Client/LoginWithCustomID
      const response = await fetch(`https://${titleId}.playfabapi.com/Client/LoginWithCustomID`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          TitleId: titleId,
          CustomId: customId,
          CreateAccount: false,
        }),
      });

      const data = await response.json();

      if (response.ok && data.code === 200 && data.status === "OK") {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            sessionTicket: data.data.SessionTicket,
            playFabId: data.data.PlayFabId,
          }),
        };
      } else {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: data.errorMessage || "PlayFab login failed",
            details: data,
          }),
        };
      }
    }

    if (action === "get_stats") {
      const sessionTicket = event.headers["x-authorization"] || event.headers["X-Authorization"] || body.sessionTicket;
      if (!sessionTicket) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "Missing Session Ticket" }),
        };
      }

      // Call PlayFab Client/GetUserData
      const response = await fetch(`https://${titleId}.playfabapi.com/Client/GetUserData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": sessionTicket,
          'X-SecretKey': process.env.PLAYFAB_SECRET_KEY
        },
        body: JSON.stringify({
          Keys: ["search_stats"],
        }),
      });

      const data = await response.json();

      if (response.ok && data.code === 200 && data.status === "OK") {
        const userData = data.data.Data || {};
        const searchStatsStr = userData.search_stats ? userData.search_stats.Value : "";
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            stats: searchStatsStr,
          }),
        };
      } else {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: data.errorMessage || "Failed to fetch user stats",
          }),
        };
      }
    }

    if (action === "update_stats") {
      const sessionTicket = event.headers["x-authorization"] || event.headers["X-Authorization"] || body.sessionTicket;
      const { keyword, category } = body;

      if (!sessionTicket) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "Missing Session Ticket" }),
        };
      }

      // 1. Fetch current user data
      const getResponse = await fetch(`https://${titleId}.playfabapi.com/Client/GetUserData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": sessionTicket,
          'X-SecretKey': process.env.PLAYFAB_SECRET_KEY
        },
        body: JSON.stringify({
          Keys: ["search_stats"],
        }),
      });

      const getData = await getResponse.json();
      let statsMap = {};

      if (getResponse.ok && getData.code === 200 && getData.status === "OK") {
        const userData = getData.data.Data || {};
        const searchStatsStr = userData.search_stats ? userData.search_stats.Value : "";
        statsMap = parseStats(searchStatsStr);
      }

      // 2. Increment counts
      if (category) {
        const catKey = category.toLowerCase().trim();
        statsMap[catKey] = (statsMap[catKey] || 0) + 1;
      }
      if (keyword) {
        const kwKey = keyword.toLowerCase().trim();
        statsMap[kwKey] = (statsMap[kwKey] || 0) + 1;
      }

      const updatedStatsStr = serializeStats(statsMap);

      // 3. Save back to PlayFab Client/UpdateUserData
      const updateResponse = await fetch(`https://${titleId}.playfabapi.com/Client/UpdateUserData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": sessionTicket,
          'X-SecretKey': process.env.PLAYFAB_SECRET_KEY
        },
        body: JSON.stringify({
          Data: {
            search_stats: updatedStatsStr,
          },
        }),
      });

      const updateData = await updateResponse.json();

      if (updateResponse.ok && updateData.code === 200 && updateData.status === "OK") {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            stats: updatedStatsStr,
          }),
        };
      } else {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: updateData.errorMessage || "Failed to update user stats",
          }),
        };
      }
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: "Invalid action" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message || "Internal server error" }),
    };
  }
};
