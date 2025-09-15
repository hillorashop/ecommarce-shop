import { getCategories } from "@/actions/category";
import { getProducts } from "@/actions/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  let products: any[] = [];
  let categories: any[] = [];

  try {
    const productsRes = await getProducts();
    products = productsRes?.data || [];
  } catch (err) {
    console.error("Failed to load products:", err);
  }

  try {
    const categoriesRes = await getCategories();
    categories = categoriesRes?.data || [];
  } catch (err) {
    console.error("Failed to load categories:", err);
  }

  const staticPages = ["", "/about", "/faq", "/categories"];

  const urls = staticPages
    .map(
      (page) => `
      <url>
        <loc>${baseUrl}${page}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`
    )
    .join("");

  const productUrls = products
    .map(
      (p) => `
      <url>
        <loc>${baseUrl}/products/${p.id}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>`
    )
    .join("");

  const categoryUrls = categories
    .map(
      (c) => `
      <url>
        <loc>${baseUrl}/products?categoryId=${encodeURIComponent(c.id)}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>`
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
    ${productUrls}
    ${categoryUrls}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml", // ✅ Fixed
        "X-Robots-Tag": "noindex",
    },
  });
}
