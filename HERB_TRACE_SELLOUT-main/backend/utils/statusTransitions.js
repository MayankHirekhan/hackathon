/**
 * Batch Status Transition Rules
 * 
 * Valid transitions based on supply chain workflow:
 * 
 * HARVESTED → RECEIVED (Supplier receives from farmer)
 * RECEIVED → PROCESSING (Supplier starts processing)
 * PROCESSING → TESTED (Lab tests the herb)
 * TESTED → PACKAGED (Supplier packages for sale)
 * PACKAGED → DISTRIBUTED (Sold to consumer)
 */

const VALID_TRANSITIONS = {
 "harvested": ["received"],
 "received": ["processing"],
 "processing": ["tested"],
 "tested": ["packaged"],
 "packaged": ["distributed"],
 "distributed": [] // Final state
}

/**
 * Check if a status transition is allowed
 * @param {string} currentStatus - Current batch status
 * @param {string} newStatus - Desired new status
 * @returns {boolean} - True if transition is allowed
 */
function isValidTransition(currentStatus, newStatus) {

 if(!VALID_TRANSITIONS[currentStatus]){
  return false
 }

 return VALID_TRANSITIONS[currentStatus].includes(newStatus)

}

/**
 * Get allowed next statuses for current status
 * @param {string} currentStatus - Current batch status
 * @returns {string[]} - Array of allowed next statuses
 */
function getAllowedNextStatuses(currentStatus) {

 return VALID_TRANSITIONS[currentStatus] || []

}

/**
 * Get status stage name for display
 * @param {string} status - Batch status
 * @returns {string} - Human-readable stage name
 */
function getStatusStageName(status) {

 const stageNames = {
  "harvested": "🌿 Fresh Harvest - Farmer",
  "received": "📦 Received - Supplier Inventory",
  "processing": "⚙️ Processing - Dry & Transform",
  "tested": "🧪 Quality Verified - Lab",
  "packaged": "📭 Packaged - Ready for Sale",
  "distributed": "🛒 Distributed - With Consumer"
 }

 return stageNames[status] || status

}

/**
 * Validate batch status change with detailed error message
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - Desired status
 * @param {object} actor - Who is making the change
 * @returns {object} - {valid: boolean, message: string}
 */
function validateStatusChange(currentStatus, newStatus, actor = null) {

 const ACTOR_PERMISSIONS = {
  "farmer": ["harvested"],
  "supplier": ["received", "processing", "packaged", "distributed"],
  "lab": ["tested"],
  "admin": ["harvested", "received", "processing", "tested", "packaged", "distributed"]
 }

 /* CHECK TRANSITION VALIDITY */

 if(!isValidTransition(currentStatus, newStatus)){

  const allowed = getAllowedNextStatuses(currentStatus)

  return {
   valid: false,
   message: `Cannot transition from "${currentStatus}" to "${newStatus}". From "${getStatusStageName(currentStatus)}", allowed transitions are: ${allowed.map(s=>getStatusStageName(s)).join(", ") || "None"}`,
   currentStage: getStatusStageName(currentStatus),
   allowedNextStages: allowed.map(s => ({status: s, name: getStatusStageName(s)}))
  }

 }

 /* CHECK ACTOR PERMISSIONS */

 if(actor && ACTOR_PERMISSIONS[actor] && !ACTOR_PERMISSIONS[actor].includes(newStatus)){

  return {
   valid: false,
   message: `${actor} is not authorized to change status to "${newStatus}"`
  }

 }

 return {
  valid: true,
  message: `Valid transition from ${getStatusStageName(currentStatus)} to ${getStatusStageName(newStatus)}`
 }

}

module.exports = {
 VALID_TRANSITIONS,
 isValidTransition,
 getAllowedNextStatuses,
 getStatusStageName,
 validateStatusChange
}
