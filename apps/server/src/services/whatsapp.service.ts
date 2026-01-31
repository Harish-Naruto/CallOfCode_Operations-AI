import type { NormalizedRequestPayload } from "../types/types";

/**
 * WhatsApp Service - Parses natural language messages into normalized payloads
 * TODO: Integrate with LLM for better parsing
 */

export class WhatsAppService {
    /**
     * Parse WhatsApp message into normalized request payload
     */
    parseMessage(text: string): NormalizedRequestPayload {
        const normalized = text.toLowerCase();

        // Simple keyword-based parsing (replace with LLM in production)
        const type = this.extractType(normalized);
        const items = this.extractItems(normalized, text);
        const skills = this.extractSkills(type);
        const estimatedMinutes = this.estimateTime(type);
        const notes = text;

        return {
            type,
            items,
            required_skills: skills,
            estimated_minutes: estimatedMinutes,
            notes,
        };
    }

    private extractType(text: string): "alteration" | "order" | "stitching" {
        if (text.includes("alter") || text.includes("fix") || text.includes("adjust")) {
            return "alteration";
        }

        if (text.includes("stitch") || text.includes("tailor")) {
            return "stitching";
        }

        return "order";
    }

    private extractItems(normalized: string, originalText: string): any[] {
        // Extract SKU if present
        const skuMatch = originalText.match(/([A-Z]{2}-\d{3})/);
        const sku = skuMatch ? skuMatch[1] : "UNKNOWN";

        // Extract size
        const sizeMatch = normalized.match(/size\s+([a-z]+)/);
        const size = sizeMatch?.[1]?.toUpperCase();

        // Extract alteration type
        let alterationType = undefined;
        if (normalized.includes("sleeve")) {
            if (normalized.includes("short")) {
                alterationType = "sleeve_shortening";
            } else if (normalized.includes("long")) {
                alterationType = "sleeve_lengthening";
            }
        } else if (normalized.includes("waist")) {
            alterationType = "waist_adjustment";
        } else if (normalized.includes("hem")) {
            alterationType = "hem_adjustment";
        }

        return [
            {
                sku,
                qty: 1,
                size,
                alteration_type: alterationType,
            },
        ];
    }

    private extractSkills(type: string): string[] {
        const skillMap: Record<string, string[]> = {
            alteration: ["tailoring"],
            stitching: ["tailoring"],
            order: ["packing", "delivery"],
        };

        return skillMap[type] || ["general"];
    }

    private estimateTime(type: string): number {
        const timeMap: Record<string, number> = {
            alteration: 90,
            stitching: 180,
            order: 30,
        };

        return timeMap[type] || 60;
    }
}

export const whatsappService = new WhatsAppService();
