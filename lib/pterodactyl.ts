
import { getDb } from "./db";

const PANEL_URL = process.env.PANEL_URL || "";
const PLTA_KEY = process.env.PANEL_PLTA_KEY || "";
const PLTC_KEY = process.env.PANEL_PLTC_KEY || "";

interface DeployOptions {
  userId: string;
  serviceType: "VPS" | "MC" | "BOT";
  // For redeem / payments:
  location?: string; // legacy string location
  locationId?: number | null; // Pterodactyl location id
  planId?: string;
  ramMb?: number | null;
  diskMb?: number | null;
  cpuPercent?: number | null;
  eggId?: string | null;
  flavor?: string | null; // Paper / Spigot / NodeJS / Python etc
  source?: "PAYMENT" | "REDEEM_CODE";
}

/**
 * Stub auto-deploy helper.
 *
 * In a real implementation you would:
 *  1) Pick a random node from PANEL_URL `/api/application/nodes?filter[location_id]=locationId`
 *  2) Call `/api/application/servers` with PLTA_KEY and the egg/id resources
 *  3) Store resulting server id in MongoDB `services` collection
 */
export async function autoDeployService(opts: DeployOptions) {
  const db = await getDb();

  const node = await db
    .collection("nodes")
    .aggregate([
      { $match: opts.locationId ? { locationId: opts.locationId } : {} },
      { $sample: { size: 1 } }
    ])
    .next();

  const serviceDoc = {
    userId: opts.userId,
    type: opts.serviceType,
    location: opts.location ?? null,
    locationId: opts.locationId ?? null,
    nodeId: node?.id ?? null,
    panelId: null,
    planId: opts.planId ?? null,
    ramMb: opts.ramMb ?? null,
    diskMb: opts.diskMb ?? null,
    cpuPercent: opts.cpuPercent ?? null,
    eggId: opts.eggId ?? null,
    flavor: opts.flavor ?? null,
    source: opts.source ?? "PAYMENT",
    status: "ACTIVE",
    createdAt: new Date()
  };

  const res = await db.collection("services").insertOne(serviceDoc);

  // TODO: replace with real Pterodactyl API call.
  if (!PANEL_URL || !PLTA_KEY || !PLTC_KEY) {
    console.warn("PANEL_URL / PLTA_KEY / PLTC_KEY not configured – no real server created.");
  }

  return res.insertedId;
}
