import {
  getChannels,
  getPostsByChannelBack,
  // getChannelBeforeLink,
} from "../../../../lib/spreadsheet";
import styles from "../../../../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
// import Posts from "../../../../components/posts";

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
  const posts = await getPostsByChannelBack(channel, id);

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
      id,
      channels,
    },
    revalidate: 60,
  };
}
export default function RenderPostsByChannelBeforeId({ posts, id, channels }) {
  const router = useRouter();
  const currentName = decodeURI(router.asPath).substring(
    decodeURI(router.asPath).lastIndexOf("/", 8) + 1
  );
  const pageNum = currentName.split("/")[2];
  const activeName = currentName.split("/")[0];

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
                    </li>
                  );
                })}
                {console.log("終了!!!____chennel")}
              </ul>
            </div>
          </div>
          <div className={styles.main}>
            <div className={styles.header}>
              {activeName + ":  " + (Number(pageNum) + 2) + " page"}
            </div>
            {/* {cache} */}
            <Link
              href="/channel/[channel]/before/[id]"
              as={`/channel/${encodeURIComponent(activeName)}/before/${
                Number(id) + 1
              }`}
              //コンポにするとなぜかエラー
              // as={getChannelBeforeLink(
              //   (channel = { activeName }),
              //   (id = { id })
              // )}
              passHref
            >
              <a>Old ↑</a>
            </Link>
            <>
              <a onClick={() => router.back()}>↓ New</a>
            </>
            <div className={styles.scroll}>
              <div>
                {console.log(id)}
                {console.log(activeName)}
                {posts.map((post) => {
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
                {console.log("終了!!!____content")}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
