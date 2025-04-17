import { relations } from "drizzle-orm";
import { mysqlTable, int, varchar, text } from "drizzle-orm/mysql-core";

import { language } from "./language.db";
import { education } from "./education.db";
import { workExperience } from "./work.db";
import { organizationExperience } from "./organization.db";
import { projects } from "./project.db";
import { skills } from "./skill.db";
import { softSkills } from "./soft-skill.db";
import { courses } from "./course.db";

export const personalBasic = mysqlTable("personal_basic", {
  id: int("id").primaryKey().autoincrement(),
  fullName: varchar("full_name", { length: 100 }),
  bio: varchar("bio", { length: 255 }),
  image: varchar("image", { length: 255 }),
  summary: text("summary"),
  phone: varchar("phone", { length: 15 }),
  email: varchar("email", { length: 255 }),
  url: varchar("url", { length: 255 }),
});

export const personalLocation = mysqlTable("personal_location", {
  id: int("id").primaryKey().autoincrement(),
  personalId: int("personal_id")
    .notNull()
    .references(() => personalBasic.id),
  address: varchar("address", { length: 255 }),
  postalCode: varchar("postal_code", { length: 5 }),
  city: varchar("city", { length: 100 }),
  countryCode: varchar("country_code", { length: 3 }),
  state: varchar("state", { length: 100 }),
});

export const personalSocial = mysqlTable("personal_social", {
  id: int("id").primaryKey().autoincrement(),
  personalId: int("personal_id")
    .notNull()
    .references(() => personalBasic.id),
  social: varchar("social", { length: 50 }),
  username: varchar("username", { length: 100 }),
  url: varchar("url", { length: 255 }),
});

export const personalRelations = relations(personalBasic, ({ many, one }) => ({
  location: one(personalLocation),
  socials: many(personalSocial),
  language: many(language),
  education: many(education),
  workExperience: many(workExperience),
  organizationExperience: many(organizationExperience),
  projects: many(projects),
  skills: many(skills),
  softSkills: many(softSkills),
  courses: many(courses),
}));

export type PersonalBasicInsert = typeof personalBasic.$inferInsert;
export type PersonalLocationInsert = typeof personalLocation.$inferInsert;
export type PersonalSocialInsert = typeof personalSocial.$inferInsert;

export type PersonalInsert = {
  basic: PersonalBasicInsert;
  location: PersonalLocationInsert;
  socials: PersonalSocialInsert[];
};
export type PersonalUpdate = {
  basic?: Partial<PersonalBasicInsert>;
  location?: Partial<Omit<PersonalLocationInsert, "personalId">>;
  socials?: Partial<Omit<PersonalSocialInsert, "personalId">>[];
};
