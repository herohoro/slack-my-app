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

//仮で全て取得することにする。
export const getContentByChannel = async (channel, startPageSize = 0) => {
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
  console.log("***** 投稿件数___" + _contentLength(rows) + "件もある〜");
  if (rows) {
    return rows.slice(startPageSize).map((item) => _buildContent(item));
  }

  return [];
};
// チャンネル内の投稿件数を確認する
function _contentLength(rows) {
  return rows.length;
}

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

//無限スクロールを試すが上手く行かない。error:can't resolve 'child_process'
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

export const Index = async (channel) => {
  const [list, setList] = useState([]); //表示するデータ
  const [hasMore, setHasMore] = useState(true); //再読み込み判定

  //項目を読み込むときのコールバック
  //pageは取得したクエリ：channelごとに変化するから....

  const loadMore = async(channel, (startPageSize = 0));
  {
    // const response = await fetch(`http://localhost:3000/api/test?page=${page}`);  //API通信
    const sheets = getSheets();
    const params = {
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: channel,
    };
    const response = await sheets.spreadsheets.values.get(params);

    // const data = await response.json();  //取得データ
    const rows = response.data.values;
    if (rows) {
      return rows.slice(startPageSize).map((item) => _buildContent(item));
    }

    //データ件数が0件の場合、処理終了
    if (rows.length < 1) {
      setHasMore(false);
      return;
    }
    //取得データをリストに追加
    //data==rowsだから....
    setList([...list, ...rows]);
  }

  //各スクロール要素
  // content=list, post=valueとして考えると....
  const items = (
    <>
      {list.map((value) => (
        <div className={styles.post}>
          <p>{value.id}</p>
          <div className={styles.textcols}>
            <p>{value.name}</p>
            <p>{value.date}</p>
          </div>
          <p className={styles.textContent}>{value.post}</p>
        </div>
      ))}
    </>
  );

  //全体のスタイル
  const root_style = {
    marginLeft: "50px",
    marginTop: "50px",
  };

  //ロード中に表示する項目
  const loader = (
    <div className="loader" key={0}>
      Loading ...
    </div>
  );

  return (
    <div style={root_style}>
      <InfiniteScroll
        loadMore={loadMore} //項目を読み込む際に処理するコールバック関数
        hasMore={hasMore} //読み込みを行うかどうかの判定
        loader={loader}
      >
        {" "}
        {/* 読み込み最中に表示する項目 */}
        {items} {/* 無限スクロールで表示する項目 */}
      </InfiniteScroll>
    </div>
  );
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
