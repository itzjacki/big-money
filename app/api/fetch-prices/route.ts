import { neon } from "@neondatabase/serverless";
import * as cheerio from "cheerio";

interface Product {
  id: number;
  pricecharting_slug: string;
}

export async function POST(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const key = request.headers.get("fetch-prices-key");

  if (key !== process.env.FETCH_PRICES_KEY) {
    return new Response(null, { status: 401 });
  }

  const exchangeRateResponse = await fetch(
    "https://api.fxratesapi.com/latest?currencies=NOK&places=2",
    { headers: { Authorization: `Bearer ${process.env.FXRATES_API_KEY}` } }
  );

  if (!exchangeRateResponse.ok) {
    return new Response(
      `Exchange rate fetch failed with message: "${exchangeRateResponse.status}: ${exchangeRateResponse.statusText}`,
      {
        status: 500,
      }
    );
  }

  const exchangeRateData = await exchangeRateResponse.json();
  const exchangeRate = parseCurrencyRateNOK(exchangeRateData.rates.NOK);
  console.log("Fetched exchange rate successfully: ", exchangeRate);

  const products =
    (await sql`select id, pricecharting_slug from pokemon_products`) as Product[];

  for (const product of products) {
    const scrapeUrl = new URL(
      product.pricecharting_slug,
      process.env.PRICING_SITE_BASE_URL
    );
    const scrapedResponse = await fetch(scrapeUrl);
    const unparsedDom = await scrapedResponse.text();
    const dom = cheerio.load(unparsedDom);
    const priceElement = dom("#used_price").find("span.price").first();
    const priceUSD = Number(priceElement.text().replace("$", "").trim());

    if (!isNumber(priceUSD.toString())) {
      console.error(
        `Could not find valid price for at URL ${scrapeUrl.toString()}, found ${priceUSD}`
      );
      return new Response(`Could not find valid price, found: ${priceUSD}`, {
        status: 500,
      });
    }

    const timestamp = new Date().toISOString();
    const priceNOK = (priceUSD * exchangeRate).toFixed(2);

    console.log("Inserting: ", product.id, timestamp, priceNOK);
    await sql`insert into price_points (product_id, collected_at, price_nok) values (${product.id}, ${timestamp}, ${priceNOK})`;

    await new Promise((resolve) => setTimeout(resolve, 1000)); // sleep 1000ms to not spam page
  }

  return new Response("OK", { status: 200 });
}

function isNumber(s: string) {
  if (s.trim() === "") {
    return false;
  }
  return !isNaN(Number(s));
}

function parseCurrencyRateNOK(unparsedRate: any): number {
  if (isNumber(unparsedRate.toString())) {
    return Number(unparsedRate);
  } else {
    console.error(
      `Exchange rate was not found to be a number, but was: ${unparsedRate}. Falling back to 10.`
    );
    return 10;
  }
}
