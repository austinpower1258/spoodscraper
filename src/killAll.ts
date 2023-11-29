import { supabaseAdmin } from "./db/supabase";

const { data: bucketList, error: bucketListError } = await supabaseAdmin
  .storage
  .from('images')
  .list();

if (bucketListError) {
  console.error('Error listing bucket: ', bucketListError);
  throw bucketListError;
}

await supabaseAdmin
  .storage
  .from('images')
  .remove(bucketList.map(image => image.name).filter(image => image.endsWith('.jpeg')))

const { error: truncateError } = await supabaseAdmin
  .from('images')
  .delete()
  .neq("id", crypto.randomUUID())

if (truncateError) {
  console.error('Error truncating images table: ', truncateError);
  throw truncateError;
}


console.log("killed everything lol");