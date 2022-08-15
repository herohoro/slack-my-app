import { useInfiniteQuery } from "@tanstack/react-query";
// import axios from "axios";
import PostItem from "./post";
import InfiniteScroll from "react-infinite-scroller";
import { getPostByChannelBeforeOne } from "../lib/spreadsheet";

const Posts = (channel) => {
  const fetchPosts = async ({ id = 0 }) => {
    const data = await getPostByChannelBeforeOne(channel, id, 1);
    // const data = `http://localhost:3000/channel/${encodeURIComponent(
    //   channel
    // )}/before/${id}`;

    // const { data } = await axios.get(
    //   `https://swapi.dev/api/people/?page=${pageParam}`
    // );
    // console.log(data);
    return data;
  };
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(["before"], fetchPosts, {
    getNextPageParam: (lastPage, allPages) => {
      const pageSize = Math.round(lastPage.count / 10, 0);
      if (allPages.length <= pageSize) {
        const regex = /\d+/g;
        const nextPage = lastPage.next.match(regex);
        console.log("nextpage", nextPage[0]);
        return nextPage[0];
      }
      return undefined;
    },
    keepPreviousData: true,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>ups....we have error: {error.message}</div>;
  }

  return (
    <>
      <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>
        {data.pages.map((page) =>
          page.results.map((post) => <PostItem key={post.id} post={post} />)
        )}
        {isFetchingNextPage && <div>fetching more .....</div>}
      </InfiniteScroll>
    </>
  );
};
export default Posts;
