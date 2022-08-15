import { getChannels, getPostsByChannel } from "../../lib/spreadsheet";
import styles from "../../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
// import Posts from "../../components/posts";

// 今はコンポネントしないで記述する。
export async function getStaticPaths() {
  const channels = await getChannels();

  return {
    paths: channels.map((channel) => `/channel/${encodeURIComponent(channel)}`),
    fallback: "blocking",
  };
}
// cacheTestを読み込むとエラーになる
export async function getStaticProps({ params: { channel } }) {
  const posts = await getPostsByChannel(channel);
  // const content = await Index(channel);

  if (!posts.length === 0) {
    console.log(`Failed to find post for channel: ${channel}`);
    return {
      props: {
        redirect: "/",
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
export default function RenderContent({ posts, channels }) {
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
                {channels.map((channel, id) => {
                  return (
                    <li
                      className={activeName === channel ? "active" : null}
                      key={id}
                    >
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
            <div className={styles.header}>{activeName}</div>
            {/* {cache} */}
            <div className={styles.scroll}>
              <div>
                {/* <Posts channel={activeName} /> */}
                {posts.map((post, key) => {
                  console.log(key);
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
