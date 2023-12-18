# spoodscrape
This github repository serves the purpose of scraping online Yelp images from various restaurants into a Supabase database for later processing into the CLIP model (SpoodCLIP) and then into the frontend program (SpoodWeb).

## Setup
1. Perform an `npm install` to install all of the node packages and dependencies.
2. Edit the array of URLs, taken from Yelp's URLs, to include the restaurants of interest.
3. Run `npm run db:kill` to kill the existing database (Supabase database).
4. Run `npm start` to initiate the scraping process. A Chromium browser should open on your computer.
5. Wait until the results have finished. Then, you can log into the Supabase account to see all the images with the respective fields included as well.
