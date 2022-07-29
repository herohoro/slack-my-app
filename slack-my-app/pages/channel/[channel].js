import { getChannels, getContentByChannel } from "../../lib/spreadsheet";
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

export async function getStaticProps({ params: { channel } }) {
  const content = await getContentByChannel(channel);

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
    },
    revalidate: 60,
  };
}
export default function RenderContent({ content, channels }) {
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
                {channels.map((channel, id) => {
                  return (
                    <li
                      key={id}
                      className={activeName === channel ? "active" : null}
                    >
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
                {content.map((post) => {
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
                {console.log("GET!!!____content")}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
