import { GoogleApis, google } from "googleapis";
const postIndexCache = require("./post-index-cache.js");

const getSheets = () => {
  const googleapis = new GoogleApis();
  const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
  const jwt = new googleapis.auth.JWT(
    process.env.GCP_SERVICEACCOUNT_EMAIL,
    undefined,
    (process.env.GCP_SERVICEACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes
  );
  return google.sheets({ version: "v4", auth: jwt });
};

// シート１をチャンネル一覧として取得
const channels = async () => {
  const sheets = getSheets();
  const rangeName = "B2:C";
  const params = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: rangeName,
  };
  const sheetsName = await sheets.spreadsheets.values.get(params);
  const rows = sheetsName.data.values;
  // console.log(rows);
  if (rows) {
    return rows
      .slice(1)
      .sort()
      .filter((name) => name[1] !== "TRUE" && name[0] !== "")
      .map((row) => row[0]);
  }
  return [];
};
export const getChannels = channels;

//仮で末尾10件取得して画面遷移を早くさせる
export const getContentByChannel = async (channel, startPageSize = -5) => {
  // if (postIndexCache.exists()) {
  //   // キャッシュがある場合に参照する
  //   results = postIndexCache.get();
  //   console.log("Found cached posts.");
  // } else {
  const sheets = getSheets();
  const params = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: channel,
  };
  const response = await sheets.spreadsheets.values.get(params);
  const rows = response.data.values;

  if (rows) {
    return rows.slice(startPageSize).map((item) => _buildContent(item));
  }

  return [];
};

function _buildContent(item, id) {
  const row = item;

  const content = {
    id: id + 1,
    date: row[0],
    name: row[1],
    post: row[2],
  };
  return content;
}

// little-render_02：-15から-6を取得
export const getPartPost = async (
  channel,
  startPageSize = -15,
  pageSize = -6
) => {
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: channel,
  });
  const rows = response.data.values;
  if (rows) {
    return rows.slice(startPageSize, pageSize).map((row, id) => {
      // console.log(row);
      return {
        id: id + 1,
        date: row[0],
        name: row[1],
        post: row[2],
      };
    });
  }

  return [];
  // }
};

// little-render_04：0から-16までを取得
export const getRemainPost = async (channel, pageSize = -16) => {
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: channel,
  });
  const rows = response.data.values;
  if (rows) {
    return rows.slice(0, pageSize).map((row) => {
      return {
        date: row[0],
        name: row[1],
        post: row[2],
      };
    });
  }

  return [];
};

//まずはじめの投稿を何かを取得する作戦
// はじめの投稿と取得した10件ターンとで重複があったらreadmoreボタンを非表示にする
export const getFirstPost = async (channel) => {
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: channel,
  });
  const rows = response.data.values;
  if (!rows.length) {
    return null;
  }

  return _buildContent(rows[0]);
};

// 10ずつ取得できる数式を入れたい.....
// useEffectで回数をカウントする？
// -10,-1 → -20,-11 → -30,-21....-10*n,-1-10*(n-1)
// もし残りのはじめの投稿を含んでいなかったら次へ進む
// 仮：今は残り全部を取得するようにしておく
// export const getReadmoreContent = async (channel) => {
//   const sheets = getSheets();
//   const response = await sheets.spreadsheets.values.get({
//     spreadsheetId: process.env.SPREADSHEET_ID,
//     range: channel,
//   });
//   const rows = response.data.values;

//   if (rows) {
//     return rows.slice(0, -11).map((row, id) => {
//       return {
//         id: id + 1,
//         date: row[0],
//         name: row[1],
//         post: row[2],
//       };
//     });
//   }
//   return [];
// };
export const cacheTest = () => {
  const channels = async () => {
    const sheets = getSheets();
    const rangeName = "B2:C";
    const sheetsName = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: rangeName,
    });
    const rows = sheetsName.data.values;
    // console.log(rows);
    if (rows) {
      return rows
        .slice(1)
        .sort()
        .filter((name) => name[1] !== "TRUE" && name[0] !== "")
        .map((row) => {
          return row[0];
        });
    }

    return [].map((channel) => _content(channel));
  };
  // チャンネル１件ずつ取り出す
  let allChannelContent = [];
  const _content = async (channel) => {
    const sheets = getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: channel,
    });
    const rows = response.data.values;

    if (rows) {
      return rows.slice().map((row, id) => {
        return {
          id: id + 1,
          date: row[0],
          name: row[1],
          post: row[2],
        };
      });
    }
    return [];
  };
  // 各チャンネル内にある投稿内容は配列[]になってまとまっているがチャンネル間はまとめられていない。。。
  allChannelContent = allChannelContent.concat(channels);
  console.log(allChannelContent);
  //   fs.writeFileSync(POST_INDEX_CACHE, JSON.stringify(allChannelContent));
  //   console.log(
  //     `Cached ${allChannelContent.length} posts into ${POST_INDEX_CACHE}`
  //   );
  return;
};
