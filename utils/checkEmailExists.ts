import clientPromise from "@/lib/db/mongoClient";
import { connectDB } from "@/lib/db/connect";
import UserProfile from "@/schemas/UserProfile";

export async function checkEmailExists(email: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();

  const adapterUser = await db.collection("users").findOne({ email });
  if (adapterUser) return true;

  await connectDB();
  const credentialsUser = await UserProfile.findOne({ email });
  return !!credentialsUser;
}