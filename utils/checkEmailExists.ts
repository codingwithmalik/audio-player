import clientPromise from "@/lib/db/mongoClient";
import { connectDB } from "@/lib/db/connect";
import UserProfile from "@/schemas/UserProfile";

export async function checkEmailExists(email: string): Promise<{
  exists: boolean;
  user: any | null; // your UserProfile type
}> {
  const client = await clientPromise;
  const db = client.db();

  const adapterUser = await db.collection("users").findOne({ email });
  if (adapterUser) {
    // Also check if we have a UserProfile for this user
    await connectDB();
    const profile = await UserProfile.findOne({ email });
    return {
      exists: true,
      user: profile || {
        email: adapterUser.email,
        _id: adapterUser._id.toString(),
      },
    };
  }
  await connectDB();
  const credentialsUser = await UserProfile.findOne({ email });
  if (credentialsUser) {
    return {
      exists: true,
      user: credentialsUser,
    };
  }
  return { exists: false, user: null };
}
