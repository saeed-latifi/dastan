import { PrismaClient } from "@prisma/client";
declare let global: { prisma: PrismaClient };

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.

let prismaProvider: PrismaClient;

if (process.env.NODE_ENV === "production") {
	prismaProvider = new PrismaClient();
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prismaProvider = global.prisma;
}
export default prismaProvider;
