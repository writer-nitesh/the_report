import Sentiment from "sentiment";

export function getSentiment(text: string) {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(text);

    const sentimentPercentage = ((result.score + 5) / 10) * 100;

    let sentimentCategory;
    if (result.score > 0) {
        sentimentCategory = "Positive 👍";
    } else if (result.score < 0) {
        sentimentCategory = "Negative 😞";
    } else {
        sentimentCategory = "Neutral 😶";
    }

    return {
        score: result.score,
        comparative: result.comparative,
        sentimentPercentage: sentimentPercentage.toFixed(2) + '%',
        sentimentCategory,
        calculation: result.calculation,
        tokens: result.tokens,
        words: result.words,
        positive: result.positive,
        negative: result.negative
    };
}
