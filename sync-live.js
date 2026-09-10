/* Refresh local SQLite DB from the production content API (one-way, live -> local).
   Never touches adminPassword. Usage: node sync-live.js  (cwd = my-project)
   Optional: set LIVE_URL to sync from a different deployment. */
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();
const LIVE_URL = process.env.LIVE_URL || "https://pirmam-hospital-78qk.vercel.app/api/content";

async function main() {
  const res = await fetch(LIVE_URL);
  if (!res.ok) throw new Error("Live API returned " + res.status);
  const live = await res.json();

  // Settings: overwrite with live values, except adminPassword
  const liveSettings = { ...live.settings };
  delete liveSettings.adminPassword;
  for (const [key, value] of Object.entries(liveSettings)) {
    await db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
  // Remove local-only keys (keep local adminPassword untouched)
  const localSettings = await db.siteSetting.findMany();
  for (const s of localSettings) {
    if (!(s.key in liveSettings) && s.key !== "adminPassword") {
      await db.siteSetting.delete({ where: { id: s.id } });
    }
  }

  // Full replace of collections with live data, preserving IDs
  await db.archiveImage.deleteMany();
  await db.archiveItem.deleteMany();
  await db.galleryItem.deleteMany();
  await db.department.deleteMany();

  await db.department.createMany({ data: live.departments });
  await db.galleryItem.createMany({ data: live.galleryItems });
  await db.archiveItem.createMany({
    data: live.archiveItems.map(({ images: _i, ...rest }) => rest),
  });
  const allImages = live.archiveItems.flatMap((a) =>
    (a.images || []).map((img) => ({ ...img, archiveItemId: a.id }))
  );
  if (allImages.length) await db.archiveImage.createMany({ data: allImages });

  console.log(
    `Synced from ${LIVE_URL}: settings ${Object.keys(liveSettings).length}, ` +
      `departments ${live.departments.length}, gallery ${live.galleryItems.length}, ` +
      `archive ${live.archiveItems.length} (${allImages.length} images)`
  );
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
