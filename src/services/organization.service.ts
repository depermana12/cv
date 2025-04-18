import { BaseCrudService } from "./base.service";
import { organizationRepository } from "./instance.repo";
import { organization } from "../db/schema/organization.db";

import type {
  OrganizationDetailInsert,
  OrganizationInsert,
  OrganizationSelect,
} from "../db/schema/organization.db";
import { NotFoundError } from "../errors/not-found.error";

export class Organization extends BaseCrudService<
  typeof organization,
  OrganizationSelect,
  OrganizationInsert
> {
  constructor(private readonly repo = organizationRepository) {
    super(repo, "id");
  }

  async getDetailById(detailId: number) {
    const record = await this.repo.getDetailById(detailId);
    if (!record) {
      throw new NotFoundError(
        `cannot get: detail ${this.primaryKey} ${detailId} not found`,
      );
    }
    return record;
  }

  async addDetail(
    organizationId: number,
    newOrganization: OrganizationDetailInsert,
  ) {
    const record = await this.repo.addDetails(organizationId, newOrganization);
    if (!record) {
      throw new Error("failed to create the record.");
    }
    return record;
  }

  async updateDetails(
    detailId: number,
    newDetailExp: Partial<OrganizationDetailInsert>,
  ) {
    const exists = await this.repo.getDetailById(detailId);
    if (!exists) {
      throw new NotFoundError(
        `cannot update: detail ${this.primaryKey} ${detailId} not found`,
      );
    }
    return this.repo.updateDetails(detailId, newDetailExp);
  }

  override async delete(id: number) {
    const exists = await this.getDetailById(id);
    if (!exists) {
      throw new NotFoundError(
        `cannot delete: detail ${this.primaryKey} ${id} not found`,
      );
    }
    return this.repo.deleteProjectWithDetails(id);
  }
}
