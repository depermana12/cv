import { eq } from "drizzle-orm";
import { db } from "../db/index";

import {
  personalInfo,
  education,
  workExperience,
  workExperienceDetails,
  organizationExperience,
  orgExpDetails,
  projects,
  projectDetails,
  projectTechnologies,
  skills,
  softSkills,
  courses,
  courseDetails,
  educationRelations,
} from "../db/schema";
import { HTTPException } from "hono/http-exception";

type PersonalType = typeof personalInfo.$inferInsert;
type EducationType = typeof education.$inferInsert;
type WorkExpType = typeof workExperience.$inferInsert;
type WorkExpDetailType = typeof workExperienceDetails.$inferInsert;
export class Personal {
  async get() {
    try {
      const rows = await db.select().from(personalInfo);
      return rows[0];
    } catch (e: unknown) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }

  async getById(id: number) {
    try {
      const rows = await db
        .select()
        .from(personalInfo)
        .where(eq(personalInfo.id, id));
      return rows[0];
    } catch (e: unknown) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }

  async create(biodata: PersonalType) {
    try {
      const personalData = await db
        .insert(personalInfo)
        .values(biodata)
        .$returningId();
      return personalData[0];
    } catch (e: unknown) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }

  async update(id: number, newPersonalData: PersonalType) {
    try {
      const rows = await db
        .update(personalInfo)
        .set(newPersonalData)
        .where(eq(personalInfo.id, id));
      return rows[0];
    } catch (e: unknown) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }

  async delete(id: number) {
    try {
      const rows = await db.delete(personalInfo).where(eq(personalInfo.id, id));
      return rows[0];
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }
}

export class Education {
  async getAll() {
    try {
      const rows = await db.select().from(education);
      return rows[0];
    } catch (e: unknown) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }
  async getById(id: number) {
    try {
      const educationRows = await db
        .select()
        .from(education)
        .where(eq(education.id, Number(id)));
      if (!education) {
        throw new HTTPException(404, {
          message: "invalid education id not found",
        });
      }
      return educationRows[0];
    } catch (e: unknown) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }
  async create(eduData: EducationType) {
    try {
      const newEducation = await db
        .insert(education)
        .values(eduData)
        .$returningId();
      return newEducation[0];
    } catch (e: unknown) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }
  async update(id: number, newEduData: EducationType) {
    try {
      const rows = await db
        .update(education)
        .set(newEduData)
        .where(eq(education.id, Number(id)));
      return rows[0];
    } catch (e: unknown) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }
  async delete(id: number) {
    try {
      await db.delete(education).where(eq(education.id, Number(id)));
    } catch (e: unknown) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }
}

export class WorkExp {
  async getAll() {
    try {
      return await db.select().from(workExperience);
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }

  async getById(id: number) {
    try {
      const rows = await db
        .select()
        .from(workExperience)
        .where(eq(workExperience.id, id));
      return rows[0];
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }

  async create(experience: WorkExpType) {
    try {
      const inserted = await db
        .insert(workExperience)
        .values(experience)
        .$returningId();
      return inserted[0];
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }

  async update(id: number, newExperience: WorkExpType) {
    try {
      return await db
        .update(workExperience)
        .set(newExperience)
        .where(eq(workExperience.id, id));
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }

  async addDetails(workExpId: number, newWorkExp: WorkExpDetailType) {
    try {
      return await db
        .insert(workExperienceDetails)
        .values({ ...newWorkExp, workExperienceId: workExpId });
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }

  async updateDetails(detailId: number, newDetailExp: WorkExpDetailType) {
    try {
      return await db
        .update(workExperienceDetails)
        .set(newDetailExp)
        .where(eq(workExperienceDetails.id, detailId));
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }

  async delete(id: number) {
    try {
      return await db.delete(workExperience).where(eq(workExperience.id, id));
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }
}

export class OrgExp {
  async getAll() {}
  async getById(id: number) {}
  async create(orgExp) {}
  async update(id: number, newOrgExp) {}
  async addDetails(orgExpId, newOrgExp) {}
  async updateDetails(detailId, newDetailExp) {}
  async delete(id: number) {}
}

export class Project {
  async getAll() {}
  async getById(id: number) {}
  async create(project) {}
  async update(id: number, newProjectData) {}
  async addDetails(projectId, newProjectDetail) {}
  async updateDetails(detailId, newDetail) {}
  async delete(id: number) {}
}

export class Course {
  async getAll() {}
  async getById(id: number) {}
  async create(course) {}
  async update(id: number, newCourseData) {}
  async addDetails(courseId, newCourseDetail) {}
  async updateDetails(detailId, newDetail) {}
  async delete(id: number) {}
}
