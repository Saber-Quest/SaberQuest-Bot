import db from "../db";
import { User } from "../models/user";

async function getUser(discord_id: string): Promise<User | null> {
    const user = await db<User>('users').where('discord_id', discord_id).first();
    if (!user) return null;
    return user;
}

export default getUser;