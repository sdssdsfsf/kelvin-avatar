import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main(){
 const username=(process.env.INITIAL_ADMIN_USERNAME||"").trim().toLowerCase();
 const password=process.env.INITIAL_ADMIN_PASSWORD||"";
 if(!/^[a-z0-9_]{3,24}$/.test(username))throw new Error("Set INITIAL_ADMIN_USERNAME (3-24 letters/numbers/underscores).");
 if(password.length<16)throw new Error("INITIAL_ADMIN_PASSWORD must be at least 16 characters.");
 const existing=await prisma.user.findUnique({where:{username}});
 if(existing){if(existing.role==="ADMIN"){console.log("This account is already an administrator.");return;}throw new Error("That username already belongs to a non-admin account. Choose another admin username.");}
 await prisma.user.create({data:{username,passwordHash:await bcrypt.hash(password,12),role:"ADMIN"}});
 console.log(`Administrator ${username} created. Remove the initial admin credentials from the deployment environment after use.`);
}
main().finally(()=>prisma.$disconnect());
