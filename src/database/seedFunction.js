import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { Card, CardType } from "../models/Card.js";
import { Role } from "../models/Role.js";
import { TimeTable } from "../models/TimeTable.js";
import { Turnstile } from "../models/Turnstile.js";
import { Employee, User } from "../models/User.js";

export const seedCardTypes = async (n = 10) => {
  for (let i = 0; i < n; i++) {
    await CardType.create({
      name: faker.word.words(),
      color: faker.color.rgb(),
      description: faker.lorem.sentence(),
    });
  }
};

export const seedCards = async (n = 10, nct = 10) => {
  for (let i = 0; i < n; i++) {
    await Card.create({
      rfid: faker.string.alphanumeric(8),
      description: faker.lorem.sentence(),
      cardTypeId: faker.number.int({ min: 1, max: nct }),
    });
  }
};

export const seedRoles = async (n = 10) => {
  for (let i = 0; i < n; i++) {
    await Role.create({
      name: faker.person.jobTitle(),
      description: faker.lorem.sentence(),
    });
  }
};

export const seedUsers = async (n = 10, nr = 10) => {
  const passwordHash = await bcrypt.hash("password", 10);
  for (let i = 0; i < n; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const ci = faker.number.int({ min: 10000000, max: 99999999 });
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      ci: ci,
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      inside: faker.datatype.boolean(),
    });
    const email = faker.internet.email({ firstName, lastName });
    await Employee.create({
      email: email,
      password: passwordHash,
      staff: faker.datatype.boolean(),
      admin: faker.datatype.boolean(),
      status: faker.number.int({ min: 0, max: 1 }),
      userId: newUser.id,
      roleId: faker.number.int({ min: 1, max: nr }),
    });
  }
};

export const seedTimeTables = async (n = 10) => {
  for (let i = 0; i < n; i++) {
    n;
    await TimeTable.create({
      title: faker.word.words(),
      description: faker.lorem.sentence(),
      toleranceDelay: faker.number.int({ min: 0, max: 60 }),
      toleranceLack: faker.number.int({ min: 0, max: 60 }),
      toleranceOutput: faker.number.int({ min: 0, max: 60 }),
      earlyExit: faker.number.int({ min: 0, max: 60 }),
      punctuality: faker.number.int({ min: 0, max: 60 }),
      priority: faker.number.int({ min: 0, max: 60 }),
      schedule: {
        Monday: {
          entry: "09:00",
          exit: "17:00",
          enable: faker.datatype.boolean(),
        },
        Tuesday: {
          entry: "09:00",
          exit: "17:00",
          enable: faker.datatype.boolean(),
        },
        Wednesday: {
          entry: "09:00",
          exit: "17:00",
          enable: faker.datatype.boolean(),
        },
        Thursday: {
          entry: "09:00",
          exit: "17:00",
          enable: faker.datatype.boolean(),
        },
        Friday: {
          entry: "09:00",
          exit: "17:00",
          enable: faker.datatype.boolean(),
        },
        Saturday: {
          entry: "09:00",
          exit: "17:00",
          enable: faker.datatype.boolean(),
        },
      },
    });
  }
};

export const seedTurnstiles = async (n = 10) => {
  for (let i = 0; i < n; i++) {
    await Turnstile.create({
      name: faker.word.words(),
      description: faker.location.streetAddress(),
    });
  }
};
