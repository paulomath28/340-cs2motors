const pool = require('../database/')

/* ***************************
 * Get all classification data
 * ************************** */

async function getClassification(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 * Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i
        JOIN public.classification AS c
        ON i.classification_id = c.classification_id
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      if (data.rows.length === 0) {
        const error = new Error(`No inventory items found for that classification ID`)
        error.status = 404
        throw error
      }
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error.message)
      throw error
    }
  }

/* ***************************
 * Get all inventory data
 * ************************** */

async function getInventory() {
  return await pool.query("SELECT * FROM public.inventory ORDER BY inv_id ASC")
}

/* ***************************
 * Get inventory item by inv_id
 * ************************** */
async function getInventoryById(inv_id){
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory where inv_id = $1`,
      [inv_id]
    )
    if (data.rows.length === 0) {
      // throw an error if no inventory items are found
      const error = new Error( `No inventory item exists with that ID`)
      error.status = 404
      throw error
    }
    return data.rows[0] // return a single object
  } catch (error) {
    console.error("getInventoryById error " + error.message)
    throw error
  }
}

/* ***************************
 * Add classification
 * ************************** */

async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.error("Error in addClassification: " + error.message);
    throw error;
  }
}

/* ***************************
 * Add inventory
 * ************************** */
async function addInventory({ inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id }) {
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
  } catch (error) {
    console.error("Error in addInventory");
    throw error;
  }
}

/* ***************************
 * Check for existing classification
 * ************************** */
async function checkExistingClassification(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const name = await pool.query(sql, [classification_name])
    return name.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = { getClassification, getInventoryByClassificationId, getInventory, getInventoryById, addClassification, addInventory, checkExistingClassification }