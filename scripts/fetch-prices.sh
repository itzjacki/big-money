#! /usr/bin/bash

response_code=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST \
  -H "fetch-prices-key: $FETCH_PRICES_KEY" \
  https://big-money-rho.vercel.app/api/fetch-prices)

echo "Response Code: $response_code"

if [ "$response_code" -ne 200 ]; then
  echo "API request failed with response code $response_code"
  exit 1
fi