export interface FeedItem {
    title: string;
    link: string;
    pubDate: string;
    "content:encodedSnippet"?: string;
    "content:encoded"?: string;
    content: string;
    contentSnippet: string;
    guid: string;
    isoDate: string;
}


export interface Feed {
    items: FeedItem[];
    image: string;
    title: string;
    description: string;
    link: string;
    language: string;
    lastBuildDate: string; // Correct property name
}

export function mapFeedItem(item: any): FeedItem {
    return {
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || '',
        "content:encodedSnippet": item["content:encodedSnippet"], 
        "content:encoded": item["content:encoded"],
        content: item.content || '',
        contentSnippet: item.contentSnippet || '',
        guid: item.guid || '',
        isoDate: item.isoDate || '',
    };
}

export function mapFeed(feed: any): Feed {
    return {
        items: feed.items ? feed.items.map(mapFeedItem) : [], 
        image: typeof feed.image === 'string' ? feed.image : '',
        title: feed.title || '',
        description: feed.description || '',
        link: feed.link || '',
        language: feed.language || '',
        lastBuildDate: feed.lastBuildDate || '',
    };
}
