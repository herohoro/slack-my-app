const fs = require("fs");

const path = require("path");
const POST_INDEX_CACHE = path.resolve(".post_index_data");

const GCP_SERVICEACCOUNT_EMAIL = process.env.GCP_SERVICEACCOUNT_EMAIL;
const GCP_SERVICEACCOUNT_PRIVATE_KEY =
  process.env.GCP_SERVICEACCOUNT_PRIVATE_KEY;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

import { GoogleApis, google } from "googleapis";

const getSheets = () => {
  const googleapis = new GoogleApis();
  const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
  const jwt = new googleapis.auth.JWT(
    GCP_SERVICEACCOUNT_EMAIL,
    undefined,
    (GCP_SERVICEACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes
  );
  return google.sheets({ version: "v4", auth: jwt });
};

exports.exists = function () {
  return fs.existsSync(POST_INDEX_CACHE);
};

exports.get = function () {
  return JSON.parse(fs.readFileSync(POST_INDEX_CACHE));
};

exports.set = async function () {
  // チャンネル=記事、投稿=記事内ブロックと置き換えて考える
  // チャンネル一覧を取得
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

  //   fs.writeFileSync(POST_INDEX_CACHE, JSON.stringify(allChannelContent));
  //   console.log(
  //     `Cached ${allChannelContent.length} posts into ${POST_INDEX_CACHE}`
  //   );
  retrun;
};
exports.expire = function () {
  return fs.unlinkSync(POST_INDEX_CACHE);
};
