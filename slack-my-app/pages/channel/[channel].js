import {
  getChannels,
  getContentByChannel,
  // getReadmoreContent,
  getFirstPost,
} from "../../lib/spreadsheet";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

// 今はコンポネントしないで記述する。
export async function getStaticPaths() {
  const channels = await getChannels();

  return {
    paths: channels.map((channel) => `/channel/${channel}`),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params: { channel, pageSize } }) {
  const content = await getContentByChannel(channel);
  // const readmore = await getReadmoreContent(channel);
  const first = await getFirstPost(channel, pageSize);

  if (!content) {
    console.log(`Failed to find post for channel: ${channel}`);
    return {
      props: {
        redirect: "/channel",
      },
      revalidate: 30,
    };
  }

  const channels = await getChannels();

  return {
    props: {
      content,
      channels,
      // readmore,
      first,
    },
    revalidate: 60,
  };
}
export default function RenderContent({ content, channels, first }) {
  const router = useRouter();
  const activeName = decodeURI(router.asPath).substring(
    decodeURI(router.asPath).lastIndexOf("/") + 1
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Spreadsheet CMS</title>
        <meta name="description" content="Next.js Spreadsheet CMS" />
      </Head>

      <main>
        <div className={styles.wrapper}>
          <div className={styles.sidebar}>
            <div className={styles.scroll}>
              <ul>
                {/* {console.log({ channels })} */}
                {channels.map((channel) => {
                  return (
                    <li className={activeName === channel ? "active" : null}>
                      <Link
                        href="/channel/[channel]"
                        as={`/channel/${channel}`}
                        passHref
                      >
                        <a>{channel}</a>
                      </Link>

                      {/* {console.log(id + "::" + channel)} */}
                    </li>
                  );
                })}
                {console.log("GET!!!____chennel")}
              </ul>
            </div>
          </div>
          <div className={styles.main}>
            <div className={styles.header}>{activeName}</div>
            <div className={styles.scroll}>
              <div>
                <p>はじめの投稿</p>
                {console.log(first)}
                {first.map((post) => {
                  return (
                    <div className={styles.post}>
                      <div className={styles.textcols}>
                        <p>{post.name}</p>
                        <p>{post.date}</p>
                      </div>
                      <p className={styles.textContent}>{post.post}</p>
                    </div>
                  );
                })}

                {/* 先頭を含まないターンでは戻るボタンを押したら続きが10件追加されるようにしたい */}
                {/* {content.length <= 10 ? null : <button>readmore!!!</button>} */}
                {console.log(content.length)}
                {/* 裏で既に全件数取得できていないと10件以上続きがあるかどうかは不明のまま */}
                {<button type="button">Read more!!</button>}

                {content.map((post) => {
                  return (
                    <div className={styles.post}>
                      <p>{post.id}</p>
                      <div className={styles.textcols}>
                        <p>{post.name}</p>
                        <p>{post.date}</p>
                      </div>
                      <p className={styles.textContent}>{post.post}</p>
                    </div>
                  );
                })}
                {/* 末尾を含まないターンでは次ボタンを押されたら10件追加したい */}
                {console.log("GET!!!____content")}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
