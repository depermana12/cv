import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";

import { Work } from "../services/work.service";
import {
  workCreateSchema,
  workUpdateSchema,
  workDetailsCreateSchema,
  workDetailsUpdateSchema,
} from "../schemas/work.schema";

const workService = new Work();
export const workRoutes = new Hono()
  .get("/", async (c) => {
    const works = await workService.getAll();
    return c.json({
      success: true,
      message: `retrieved ${works.length} records successfully`,
      data: works,
    });
  })
  .get("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const work = await workService.getById(id);
    return c.json({
      success: true,
      message: `record ID: ${id} retrieved successfully`,
      data: work,
    });
  })
  .post(
    "/",
    zValidator("json", workCreateSchema, (result, c) => {
      if (!result.success) {
        throw new HTTPException(400, {
          message: result.error.issues[0].message,
        });
      }
    }),
    async (c) => {
      const validatedBody = c.req.valid("json");
      const newWork = await workService.create(validatedBody);
      return c.json(
        {
          success: true,
          message: `new record created with ID: ${newWork.id}`,
          data: newWork,
        },
        201,
      );
    },
  )
  .patch(
    "/:id",
    zValidator("json", workUpdateSchema, (result, c) => {
      if (!result.success) {
        throw new HTTPException(400, {
          message: result.error.issues[0].message,
        });
      }
    }),
    async (c) => {
      const id = Number(c.req.param("id"));
      const validatedBody = c.req.valid("json");
      const updatedWorkExp = await workService.update(id, validatedBody);
      return c.json({
        success: true,
        message: `record ID: ${id} updated successfully`,
        data: updatedWorkExp,
      });
    },
  )
  .delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    await workService.delete(id);
    return c.json({
      success: true,
      message: `record id: ${id} deleted successfully`,
    });
  })
  .post(
    "/:id/details",
    zValidator("json", workDetailsCreateSchema, (result, c) => {
      if (!result.success) {
        throw new HTTPException(400, {
          message: result.error.issues[0].message,
        });
      }
    }),
    async (c) => {
      const id = Number(c.req.param("id"));
      const validatedBody = c.req.valid("json");

      const data = await workService.addDetail(id, validatedBody);
      return c.json({
        success: true,
        message: `new detail created with ID: ${data.id}`,
        data,
      });
    },
  )
  .patch(
    "/:id/details/:detailId",
    zValidator("json", workDetailsUpdateSchema, (result, c) => {
      if (!result.success) {
        throw new HTTPException(400, {
          message: result.error.issues[0].message,
        });
      }
    }),
    async (c) => {
      const id = Number(c.req.param("id"));
      const detailId = Number(c.req.param("detailId"));
      const validatedBody = c.req.valid("json");

      const existingDetail = await workService.getDetailById(detailId);

      if (existingDetail.workExperienceId !== id) {
        return c.json(
          {
            success: false,
            message: "detail does not belong to the given work",
          },
          404,
        );
      }

      const updatedDetail = await workService.updateDetails(
        detailId,
        validatedBody,
      );
      return c.json({
        success: true,
        message: `detail ID: ${detailId} updated successfully`,
        data: updatedDetail,
      });
    },
  );
