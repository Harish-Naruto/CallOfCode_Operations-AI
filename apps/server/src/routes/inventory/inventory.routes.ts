import { Router, type IRouter } from "express";
import { inventoryController } from "../../controllers/inventory.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/authorization.middleware";
import {
    validate,
    updateInventorySchema,
    supplierWebhookSchema,
} from "../../middleware/validation.middleware";
import { UserRole } from "../../types/types";

const router: IRouter = Router();

/**
 * @route   POST /api/inventory/update
 * @desc    Update inventory
 * @access  Owner
 */
router.post(
    "/update",
    authenticate,
    requireRole([UserRole.OWNER]),
    validate(updateInventorySchema),
    (req, res, next) => inventoryController.updateInventory(req, res).catch(next),
);

/**
 * @route   POST /api/inventory/bulk
 * @desc    Bulk upsert inventory (for seeding)
 * @access  Owner
 */
router.post(
    "/bulk",
    authenticate,
    requireRole([UserRole.OWNER]),
    (req, res, next) => inventoryController.bulkUpsert(req, res).catch(next),
);

/**
 * @route   POST /api/webhooks/supplier
 * @desc    Supplier webhook for order updates
 * @access  Public (webhook)
 */
router.post(
    "/webhooks/supplier",
    validate(supplierWebhookSchema),
    (req, res, next) => inventoryController.handleSupplierWebhook(req, res).catch(next),
);

export default router;
