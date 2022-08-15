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
//出だし10件表示する
export const getPostsByChannel = async (channel) => {
  let results = [];
  const sheets = getSheets();
  const params = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: channel,
  };
  const response = await sheets.spreadsheets.values.get(params);
  const rows = response.data.values;
  results = results.concat(rows);
  // console.log("出だし10件のraws" + results);
  console.log("***** 投稿件数___" + _contentLength(rows) + "件もある〜");
  if (results) {
    console.log("出だし10件のretrun ");
    return results.slice(0, 10).map((item, id) => _buildContent(item, id));
  }

  return [];
};
//仮で全て取得することにする。
const getAllPostsByChannel = async (channel) => {
  let results = [];
  const sheets = getSheets();
  const params = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: channel,
  };
  const response = await sheets.spreadsheets.values.get(params);
  const rows = response.data.values;
  results = results.concat(rows);
  // console.log(results);
  console.log("***** 全投稿件数___" + _contentLength(rows) + "件もある〜");
  if (results) {
    // console.log(
    //   "getAllPostsByCannel **** " +
    //     results.slice(0).map((item, id) => _buildContent(item, id))
    // );
    return results.slice(0).map((item, id) => _buildContent(item, id));
  }

  return [];
};
// チャンネル内の投稿件数を確認する
function _contentLength(results) {
  return results.length;
}

function _buildContent(item, id) {
  const row = item;

  const post = {
    id: id,
    date: row[0],
    name: row[1],
    post: row[2],
  };
  console.log("*** buildContent  " + post.id + post);
  return post;
}
// 10件ずつ小出しにする
export async function getPostsByChannelBefore(channel, id, pageSize = 10) {
  const allPosts = await getAllPostsByChannel(channel);
  console.log("今のid **** " + id);
  const Min_posts = Number(id) * 10;
  const Max_posts = (Number(id) + 1) * 10;
  console.log(Min_posts);
  console.log(Max_posts);
  console.log(
    "10件ずつ小出し " +
      allPosts
        .filter(
          (post) => Number(post.id) < Max_posts && Number(post.id) >= Min_posts
        )
        .slice(0, pageSize)
  );
  return allPosts
    .filter(
      (post) => Number(post.id) < Max_posts && Number(post.id) >= Min_posts
    )
    .slice(0, pageSize);
}
//idによるパスを作ってページを当てる
export const getChannelBeforeLink = (channel, id) => {
  return `/channel/${encodeURIComponent(channel)}/before/${id}`;
};
// fetchリンクに習って1件取得する
export async function getPostByChannelBeforeOne(channel, id, pageSize = 1) {
  const allPosts = await getAllPostsByChannel(channel);
  console.log("今のid **** " + id);
  const Min_posts = Number(id);
  const Max_posts = Number(id) + 1;
  console.log(Min_posts);
  console.log(Max_posts);
  console.log(
    "10件ずつ小出し " +
      allPosts
        .filter(
          (post) => Number(post.id) < Max_posts && Number(post.id) >= Min_posts
        )
        .slice(0, pageSize)
  );
  return allPosts
    .filter(
      (post) => Number(post.id) < Max_posts && Number(post.id) >= Min_posts
    )
    .slice(0, pageSize);
}

//まずはじめの投稿を何かを取得する作戦
// はじめの投稿と取得した10件ターンとで重複があったらreadmoreボタンを非表示にする
export const getFirstPostByChannel = async (channel) => {
  const sheets = getSheets();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: channel,
  });
  const rows = response.data.values;

  if (!rows.length) {
    return null;
  }
  console.log(
    "はじめの投稿retrun  " +
      rows.slice(0, 1).map((item, id) => _buildContent(item, id))
  );
  return rows.slice(0, 1).map((item, id) => _buildContent(item, id));
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

//キャッシュは失敗中
// export const cacheTest = () => {
//   const channels = async () => {
//     const sheets = getSheets();
//     const rangeName = "B2:C";
//     const sheetsName = await sheets.spreadsheets.values.get({
//       spreadsheetId: process.env.SPREADSHEET_ID,
//       range: rangeName,
//     });
//     const rows = sheetsName.data.values;
//     // console.log(rows);
//     if (rows) {
//       return rows
//         .slice(1)
//         .sort()
//         .filter((name) => name[1] !== "TRUE" && name[0] !== "")
//         .map((row) => {
//           return row[0];
//         });
//     }

//     return [].map((channel) => _content(channel));
//   };
//   // チャンネル１件ずつ取り出す
//   let allChannelContent = [];
//   const _content = async (channel) => {
//     const sheets = getSheets();
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: SPREADSHEET_ID,
//       range: channel,
//     });
//     const rows = response.data.values;

//     if (rows) {
//       return rows.slice().map((row, id) => {
//         return {
//           id: id + 1,
//           date: row[0],
//           name: row[1],
//           post: row[2],
//         };
//       });
//     }
//     return [];
//   };
//   // 各チャンネル内にある投稿内容は配列[]になってまとまっているがチャンネル間はまとめられていない。。。
//   allChannelContent = allChannelContent.concat(channels);
//   console.log(allChannelContent);
//   //   fs.writeFileSync(POST_INDEX_CACHE, JSON.stringify(allChannelContent));
//   //   console.log(
//   //     `Cached ${allChannelContent.length} posts into ${POST_INDEX_CACHE}`
//   //   );
//   return;
// };
