import { Router, type IRouter } from "express";
import { inventoryController } from "../../controllers/inventory.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/authorization.middleware";
import {
    validate,
    updateInventorySchema,
    supplierWebhookSchema,
    createInventoryItemSchema,
    updateInventoryItemSchema,
} from "../../middleware/validation.middleware";
import { UserRole } from "../../types/types";
import { upload } from "../../config/upload.config";

const router: IRouter = Router();

/**
 * @route   POST /api/inventory/create
 * @desc    Create new inventory item with optional image
 * @access  Owner
 */
router.post(
    "/create",
    authenticate,
    requireRole([UserRole.OWNER]),
    upload.single("photo"),
    validate(createInventoryItemSchema),
    (req, res, next) => inventoryController.createInventoryItem(req, res).catch(next),
);

/**
 * @route   GET /api/inventory
 * @desc    Get all inventory items (public for customers to browse)
 * @access  Public (optional auth)
 */
router.get(
    "/",
    (req, res, next) => inventoryController.getInventoryItems(req, res).catch(next),
);

/**
 * @route   GET /api/inventory/:sku
 * @desc    Get single inventory item
 * @access  Owner
 */
router.get(
    "/:sku",
    authenticate,
    requireRole([UserRole.OWNER]),
    (req, res, next) => inventoryController.getInventoryItem(req, res).catch(next),
);

/**
 * @route   PATCH /api/inventory/:sku
 * @desc    Update inventory item with optional image
 * @access  Owner
 */
router.patch(
    "/:sku",
    authenticate,
    requireRole([UserRole.OWNER]),
    upload.single("photo"),
    validate(updateInventoryItemSchema),
    (req, res, next) => inventoryController.updateInventoryItem(req, res).catch(next),
);

/**
 * @route   POST /api/inventory/update
 * @desc    Update inventory quantity (legacy endpoint)
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

