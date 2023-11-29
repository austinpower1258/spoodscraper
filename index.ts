import puppeteer, { Page } from "puppeteer";
import { promises as fs } from "fs";
import fsSync from "fs";
import path from "path";
import imageSize from "image-size";
import { supabase, supabaseAdmin } from "./src/db/supabase";
import sharp from "sharp";
import crypto from "crypto";

const HEADLESS = false;
const dir = "./images";

async function convertImageToJpeg(imageBuffer: Buffer): Promise<Buffer | null> {
  try {

    const image = sharp(imageBuffer);
    image.jpeg({ quality: 100 });
    return image.toBuffer();

  } catch (error) {

    console.error("Failed to convert image to JPEG:", error);
    return null;

  }
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  return Buffer.from(await response.arrayBuffer());
}

async function processPage(url: string, page: Page, index: number, imageOffset: number): Promise<number> {
  const folderPath = path.join(dir, `folder_${index}`);

  if (!fsSync.existsSync(folderPath)) {
    await fs.mkdir(folderPath);
  }

  const imageUrls: string[] = await page.evaluate(() => Array.from(document.querySelectorAll("img"), img => img.src));

  const downloadAndProcessImage = async (imageUrl: string, i: number) => {
    const originalImage = await downloadImage(imageUrl);
    const sizeInKB = originalImage.length / 1024;

    if (sizeInKB < 10) {
      console.log(`Skipping small image: ${imageUrl}`);
      return;
    }

    const convertedImage = await convertImageToJpeg(originalImage);

    if (convertedImage) {
      const { data, error } = await supabaseAdmin.storage.from('images').upload(`images/${crypto.randomUUID()}.jpeg`, convertedImage, { contentType: 'image/jpeg' });

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('images')
        .insert([
          { image_url: data.path, source_url: url }
        ]);

      if (insertError) {
        console.error('Error inserting data:', insertError);
        throw insertError;
      }
    }
  };

  await Promise.all(imageUrls.map((imageUrl, i) => downloadAndProcessImage(imageUrl, i)));

  return imageUrls.length;
}

async function scrapeAllImages(url: string, index: number) {
  const browser = await puppeteer.launch({ headless: HEADLESS });
  const page = await browser.newPage();
  await page.goto(url);

  let nextPageExists = true;
  let retries = 2;
  let imageOffset = 0;

  while (nextPageExists) {
    const processedImages = await processPage(url, page, index, imageOffset);
    imageOffset += processedImages;

    try {
      await page.waitForSelector(".next.pagination-links_anchor", { timeout: 20000 });
      await Promise.all([
        page.click(".next.pagination-links_anchor"),
        page.waitForNavigation({ waitUntil: "networkidle0", timeout: 20000 }),
      ]);
    } catch (error) {
      console.error("Error navigating to the next page:", error);
      if (retries > 0) {
        retries--;
      } else {
        nextPageExists = false;
      }
    }
  }

  await browser.close();
}

async function main() {
  if (!fsSync.existsSync(dir)) {
    await fs.mkdir(dir);
  }

  const urls = [
    "https://www.yelp.com/biz_photos/the-luke-brasserie-new-haven?tab=food",
    "https://www.yelp.com/biz_photos/zeneli-pizzeria-and-cucina-napoletana-new-haven-2?tab=food",
    "https://www.yelp.com/biz_photos/noa-by-september-in-bangkok-new-haven?tab=food",
    "https://www.yelp.com/biz_photos/menya-gumi-new-haven?tab=food",
    "https://www.yelp.com/biz_photos/tavern-on-state-new-haven-4?tab=food",
    "https://www.yelp.com/biz_photos/hachiroku-shokudo-and-sake-bar-new-haven?tab=food",
    "https://www.yelp.com/biz_photos/icaru-peruvian-restaurant-new-haven?tab=food",
    "https://www.yelp.com/biz_photos/elm-city-social-new-haven?tab=food",
    "https://www.yelp.com/biz_photos/villa-lulu-new-haven?tab=food",
    "https://www.yelp.com/biz_photos/september-in-bangkok-new-haven?tab=food",
    "https://www.yelp.com/biz_photos/gioia-cafe-and-bar-new-haven?tab=food",
    "https://www.yelp.com/biz_photos/barcelona-new-haven-new-haven-3?tab=food",
    "https://www.yelp.com/biz_photos/olea-new-haven-2?tab=food",
    "https://www.yelp.com/biz_photos/sherkaan-indian-street-food-new-haven-2?tab=food",
    "https://www.yelp.com/biz_photos/tibetan-kitchen-new-haven?tab=food"
  ];

  for (let i = 0; i < urls.length; i++) {
    await scrapeAllImages(urls[i], i);
  }
}

main();
