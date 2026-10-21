const bcrypt = require("bcryptjs");

async function AdminSeeder(prisma) {
  const role = await prisma.role.upsert({
    where: {
      slug: "super-admin",
    },
    update: {},
    create: {
      name: "Super Admin",
      slug: "super-admin",
    },
  });

  const hashedPassword = await bcrypt.hash("CmsAdmin@2026", 10);

  await prisma.user.upsert({
    where: {
      email: "cmsadmin@gmail.com",
    },
    update: {},
    create: {
      name: "Super Admin",
      email: "cmsadmin@gmail.com",
      password: hashedPassword,
      roleId: role.id,
    },
  });

  console.log("Admin Seeder Completed");
}

module.exports = AdminSeeder;
