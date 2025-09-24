import { neon } from "@neondatabase/serverless";

function getProducts() {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const response = sql`select * from pokemon_products`;
  return response;
}

async function Portfolio() {
  const products = await getProducts();
  console.log(products);
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.id} {product.pricecharting_slug}
        </li>
      ))}
    </ul>
  );
}

export default Portfolio;
