const prisma = require("../src/config/prisma");

const AdminSeeder = require("./seeders/AdminSeeder");

async function main() {
  await AdminSeeder(prisma);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
