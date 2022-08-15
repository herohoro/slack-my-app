import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import PostItem from "./post";
import InfiniteScroll from "react-infinite-scroller";

const Posts = () => {
  const fetchPosts = async ({ pageParam = 1 }) => {
    const { data } = await axios.get(
      `https://swapi.dev/api/people/?page=${pageParam}`
    );
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
  } = useInfiniteQuery(["people"], fetchPosts, {
    getNextPageParam: (lastPage, allPages) => {
      const pageSize = Math.round(lastPage.count / 10, 0);
      if (allPages.length <= 10) {
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
          page.results.map((el) => <PostItem key={el.nama} name={el.name} />)
        )}
        {isFetchingNextPage && <div>fetching more .....</div>}
      </InfiniteScroll>
    </>
  );
};
export default Posts;
