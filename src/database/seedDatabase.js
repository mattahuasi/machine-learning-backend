import {
  seedCardTypes,
  seedCards,
  seedRoles,
  seedUsers,
  seedTimeTables,
  seedTurnstiles,
} from "./seedFunction.js";

async function seedDatabase(callback) {
  await seedCardTypes(20);
  await seedCards(30, 20);
  await seedRoles(15);
  await seedUsers(75, 15);
  await seedTimeTables(10);
  await seedTurnstiles(5);

  if (callback && typeof callback === "function") {
    callback();
  }
}

seedDatabase(() => {
  console.log("Seed completed successfully!");
});
