import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import ReactInstaStories from "react-insta-stories";
import { Story } from "react-insta-stories/dist/interfaces";
import Parser from 'rss-parser';
import { Feed, mapFeed } from "types";
import { getSentiment } from "utils/sentiments";


export const loader: LoaderFunction = async (): Promise<Feed> => {
  const parser = new Parser();
  // const feed = await parser.parseURL('https://feeds.feedburner.com/ndtvnews-latest');
  const feed = await parser.parseURL('https://feeds.feedburner.com/ndtvnews-trending-news');
  const mappedFeed = mapFeed(feed);
  return mappedFeed
};

export default function Trending() {
  const feed = useLoaderData<Feed>();

  const [myStories, setMyStories] = useState<Story[]>([]);

  async function processFeedItems(feed: Feed): Promise<Story[]> {
    try {
      const processedItems = await Promise.all(feed.items.map(async (item) => {
        const content = () => {
          const analysis = getSentiment(item.title + "/n" + item.content)
          return (

            <div className="flex flex-col gap-4 h-full items-start w-full">
              <div className="mt-6 lg:px-5 px-2 w-full flex flex-col py-2 gap-2 h-full overflow-hidden">
                <h1 className="text-2xl font-bold ">{item.title}</h1>
                <div className="px-2 py-1  rounded-md text-[15px] bg-neutral-700 flex-col flex gap-2 items-center justify-center ">
                  <p>
                    Sounds like this is <span className="font-bold">{analysis.sentimentCategory}</span>
                  </p>
                  <p>Strength : <span className="font-bold">{analysis.sentimentPercentage}</span></p>
                </div>
                <div className="flex items-center justify-center ">
                  <div className="flex prose prose-neutral dark:prose-invert prose-img:rounded-md prose-img:m-1 flex-col prose-p:space-y-1 space-y-2 text-sm h-full overflow-hidden  " dangerouslySetInnerHTML={{ __html: item["content:encoded"] }} />
                </div>
              </div>
            </div>
          )
        };
        const header = {
          heading: 'Mohit Karekar',
          subheading: 'Posted 30m ago',
          profileImage: 'https://picsum.photos/100/100',
        };
        return {
          content,
          header,
          seeMore: ({ close }) => <div onClick={close}>Hello, click to close this.</div>,
        };
      }));
      return processedItems;
    } catch (error) {
      console.error("Error processing feed items:", error);
      return [];
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const newData = await processFeedItems(feed);
      if (newData) {
        setMyStories(newData);
      }
    };
    fetchData();
  }, [feed]);

  return (
    <div className="flex flex-col gap-4 h-screen w-screen items-center">
      {myStories.length > 0 && (
        <ReactInstaStories
          stories={myStories}
          height={"100%"}
          width={"100%"}
          keyboardNavigation
          defaultInterval={10000}
          preloadCount={3}
          header={() => <p>Header</p>}
        />
      )}
    </div>
  );
}
