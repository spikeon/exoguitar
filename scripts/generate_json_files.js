/**
 * The Plan: 
 * 
 * This file will use Node.js code to generate the following in the docs folder
 * - A List of parts at parts.json
 * - A List of all unique bom items and total counts at unified_bom.json
 * - A Map of parts to bom items with counts at bom.json
 * - A folder structure containing the images and exploded views from each part, eg: {section_name}/{part_name}/{gallery|exploded}/{filename}
 * 
 * 
 * A GitHub action will be created to run this file before deploying the GitHub page
 * 
 * The GitHub page will be written to read from these files and generate a BOM based on the user's inputs
 */

/**
 *  Part {
 *      name: string
 *      section: string // Folder containing part folder
 *  }
 */

/**
 *  BillOfMaterialsItem {
 *      name: string
 *      amazon_url: string
 *      qty: int
 *      optional: boolean
 *  }
 */