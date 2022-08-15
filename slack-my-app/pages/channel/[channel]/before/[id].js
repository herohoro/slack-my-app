import {
  getChannels,
  getPostsByChannelBefore,
} from "../../../../lib/spreadsheet";
import styles from "../../../../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

// 今はコンポネントしないで記述する。
export async function getStaticPaths() {
  const channels = await getChannels();

  return {
    paths: [],
    fallback: "blocking",
  };
}
// cacheTestを読み込むとエラーになる
export async function getStaticProps({ params: { channel, id } }) {
  const posts = await getPostsByChannelBefore(channel, id, 10);

  if (!posts.length === 0) {
    console.log(`Failed to find post for channel: ${channel}_${id}`);
    return {
      props: {
        redirect: "/channel",
      },
      revalidate: 30,
    };
  }

  const [channels] = await Promise.all([getChannels()]);

  return {
    props: {
      posts,

      channels,
    },
    revalidate: 60,
  };
}
export default function RenderPostsByChannelBeforeId({ posts, channels }) {
  const router = useRouter();
  const activeName = decodeURI(router.asPath).substring(
    decodeURI(router.asPath).indexOf("/", 1)
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

                      {/* {console.log(channel)} */}
                    </li>
                  );
                })}
                {console.log("終了!!!____chennel")}
              </ul>
            </div>
          </div>
          <div className={styles.main}>
            <div className={styles.header}>{activeName}</div>
            {/* {cache} */}
            <div className={styles.scroll}>
              <div>
                {/* {content} */}
                {posts.map((post) => {
                  // console.log(content);
                  return (
                    <div className={styles.post}>
                      <p>{post.id}</p>
                      <div className={styles.textcols}>
                        <p>{post.name}</p>
                        <p>{post.date}</p>
                      </div>
                      <p className={styles.textContent}>{post.post}</p>
                      {/* {console.log(post)} */}
                    </div>
                  );
                })}
                {/* 末尾を含まないターンでは次ボタンを押されたら10件追加したい */}
                {console.log("終了!!!____content")}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
