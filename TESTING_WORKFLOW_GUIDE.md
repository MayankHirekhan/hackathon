# 🧪 Complete Workflow Testing Guide
## End-to-End Verification: Farmer → Consumer

---

## ✅ PRE-REQUISITES

### Required Test Accounts (Already Created)

```
FARMER:
  Email: farmer@test.com
  Password: farmer123
  Role: Farmer

SUPPLIER:
  Email: supplier@test.com
  Password: supplier123
  Role: Supplier

LAB TESTER:
  Email: lab@test.com
  Password: lab123
  Role: Lab Tester

CONSUMER:
  Email: consumer@test.com
  Password: consumer123
  Role: Consumer

ADMIN:
  Email: admin@test.com
  Password: admin123
  Role: Admin
```

### Backend Services Running
- ✅ MongoDB: `herbtrace` database active
- ✅ Backend API: Running on `http://localhost:5000`
- ✅ Frontend: Running on `http://localhost:3000`

---

## 📋 COMPLETE WORKFLOW TEST (All 6 Stages)

### STAGE 1️⃣: FARMER - CREATE BATCH

**Actor:** Farmer  
**URL:** `http://localhost:3000/dashboard/farmer/harvests`  
**Expected Status:** HARVESTED

**Steps:**

1. Login as Farmer (farmer@test.com / farmer123)
2. Click "Create New Batch"
3. Fill in:
   - Herb Name: `Turmeric` (or any herb)
   - Quantity: `50` kg
   - Harvest Date: `2024-03-20`
   - Location: Enter any location (e.g., "Rural Farm, Gujarat")
   - Get GPS coordinates or use map selector
4. Click "Create Batch"

**Expected Result:**
- ✅ Batch created with unique ID (HB-0001, HB-0002, etc.)
- ✅ Batch appears in "My Batches" list
- ✅ Status shows: `HARVESTED`
- ✅ QR code generated for batch
- ✅ Blockchain entry created

**Verification:**
```bash
# Backend Console should show:
# ✅ Batch created: HB-0001
# Hash: [SHA256 hash]
```

---

### STAGE 2️⃣a: SUPPLIER - RECEIVE BATCH

**Actor:** Supplier  
**URL:** `http://localhost:3000/dashboard/supplier/receive`  
**Expected Status:** RECEIVED

**Steps (Option A - Scan QR):**

1. Login as Supplier (supplier@test.com / supplier123)
2. Go to "Receive Batch" page
3. Allow camera access
4. Point camera at Farmer's Batch QR code
5. System will scan and autofill batch ID

**Steps (Option B - Manual Entry):**

1. Manually enter the Batch ID (e.g., HB-0001)
2. Click "Submit"

**Expected Response:**
```json
{
  "success": true,
  "message": "Batch received successfully",
  "batch": {
    "batchId": "HB-0001",
    "herbName": "Turmeric",
    "farmer": "Farmer Name",
    "quantity": 50,
    "status": "received"
  }
}
```

**Verification:**
- ✅ Green success message: "✅ Batch HB-0001 received successfully!"
- ✅ Supplier logged-in status shows in green
- ✅ Database: `batch.status` = `"received"`
- ✅ Database: `batch.supplierId` = populated

---

### STAGE 2️⃣b: SUPPLIER - PROCESS BATCH & CREATE PACKETS

**Actor:** Supplier  
**URL:** `http://localhost:3000/dashboard/supplier/processing`  
**Expected Status:** PROCESSING

**Steps:**

1. Go to "Processing" page
2. Select the received batch (HB-0001)
3. Fill in processing details:
   - Processing Method: `Air-dried` or `Oven-dried`
   - Drying Temperature: `45` °C
   - Duration: `7` days
4. Click "Start Processing"
5. Create packets:
   - Quantity: `100` packets (depends on batch size)
   - Click "Generate Packets"

**Expected Result:**
- ✅ Batch status changes to `PROCESSING`
- ✅ Processing metadata stored
- ✅ Packets created (PKT-0001, PKT-0002, etc.)
- ✅ Individual packet QR codes generated

**Verification:**
```bash
# Backend console:
# ✅ Processing started for HB-0001
# ✅ 100 packets created
```

---

### STAGE 3️⃣: LAB - TEST & CERTIFY

**Actor:** Lab Tester  
**URL:** `http://localhost:3000/dashboard/lab/tests`  
**Expected Status:** TESTED

**Steps:**

1. Login as Lab (lab@test.com / lab123)
2. Go to "Test Batches" page
3. You should see the batch with status `RECEIVED`
4. Enter test results:
   - pH Level: `6.5`
   - Moisture Content: `12%`
   - Microbial Load: `< 100` CFU/mL
   - Overall Result: `PASS` or `FAIL`
   - Notes: `All tests passed successfully`
5. Click "Submit Test Results"

**Expected Response:**
```json
{
  "success": true,
  "message": "Test results recorded. Status: PASS",
  "batch": {
    "batchId": "HB-0001",
    "status": "tested",
    "labTested": true,
    "labName": "Lab Name",
    "labResult": "PASS",
    "labTestDate": "2024-03-21"
  }
}
```

**Verification:**
- ✅ Test form accepted
- ✅ Status changes to `TESTED`
- ✅ Batch disappears from "Test Batches" (now tested)
- ✅ Certification generated
- ✅ Lab stats updated: `totalBatchesTested` incremented

---

### STAGE 4️⃣: SUPPLIER - PACKAGE FOR SALE

**Actor:** Supplier  
**URL:** `http://localhost:3000/dashboard/supplier/packaging`  
**Expected Status:** PACKAGED

**Steps:**

1. Go to "Packaging" page
2. Select tested batch (HB-0001)
3. Package details:
   - Package Size: `100g per packet`
   - Packaging Date: (auto-filled)
4. Add labels:
   - Product name, batch ID
   - Lab certification #
   - Expiry date
   - Company logo
5. Click "Mark as Packaged"

**Expected Result:**
- ✅ Batch status: `PACKAGED`
- ✅ Ready for distribution

---

### STAGE 5️⃣: DISTRIBUTION - SELL TO CONSUMER

**Actor:** Supplier/Sales  
**Endpoint:** `POST /api/sales/create`  
**Expected Status:** DISTRIBUTED

**Steps (via API or Admin Panel):**

```bash
curl -X POST http://localhost:5000/api/sales/create \
  -H "Content-Type: application/json" \
  -d '{
    "batchId": "HB-0001",
    "packetIds": ["PKT-0001", "PKT-0002"],
    "customerName": "John Doe",
    "customerEmail": "john@email.com",
    "customerPhone": "+91-9876543210",
    "supplierId": "supplier_mongo_id",
    "supplierName": "Quality Herbs Ltd",
    "quantity": 2,
    "pricePerUnit": 500,
    "discount": 0,
    "paymentMethod": "cash",
    "deliveryAddress": "123 Main St, City, State"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Sale recorded successfully",
  "sale": {
    "saleId": "SALE-00001",
    "batchId": "HB-0001",
    "customerName": "John Doe",
    "finalPrice": 1000,
    "deliveryStatus": "pending",
    "saleDate": "2024-03-21"
  }
}
```

**Verification:**
- ✅ Batch status changes to `DISTRIBUTED`
- ✅ Sale record created with unique ID
- ✅ Customer receives packet with QR code

---

### STAGE 6️⃣: CONSUMER - TRACE & VERIFY

**Actor:** Consumer  
**URL:** `http://localhost:3000/trace`  
**Expected:** Complete supply chain visibility

**Steps:**

1. Consumer scans packet QR code (using phone camera)
2. QR directs to: `http://localhost:3000/trace/[batchId]`
3. Page displays:

   **Farmer Section:**
   - 👨‍🌾 Name, Photo, Rating
   - 📍 Location with map image
   - 📅 Harvest date
   - ⚖️ Quantity

   **Supplier Section:**
   - 🏭 Company name
   - ⚙️ Processing method
   - 🌡️ Drying temperature
   - ⏱️ Duration

   **Lab Section:**
   - 🧪 Test results (pH, Moisture, Microbial)
   - ✅ Certification number
   - 📅 Test date
   - Pass/Fail status

   **Blockchain Section:**
   - 🔐 Batch hash (SHA256)
   - ⛓️ Previous hash (chain link)
   - ✓ Verification status

4. Consumer can verify blockchain integrity

**Verification:**
- ✅ All supply chain data visible
- ✅ Farmer identity verified
- ✅ Lab certification genuine
- ✅ Blockchain chain unbroken
- ✅ Consumer trusts product authenticity

---

## 🔍 ERROR SCENARIOS & DEBUGGING

### Error: "Batch not found"

**Cause:** Wrong batch ID or batch doesn't exist

**Debug:**
```bash
# Backend logs should show:
# 📦 Receive request - BatchID: HB-0001
# 🔍 Database search result: ❌ Not found
# Sample batches: [...]
```

**Solution:**
- Verify batch was created by farmer
- Check batch ID spelling
- Restart backend if database connection lost

---

### Error: "Cannot be received - current status is processing"

**Cause:** Batch already received, trying to receive again

**Solution:**
- Use a different batch
- Proceed to processing stage

---

### Error: "Batch cannot be tested"

**Cause:** Batch status not `RECEIVED` or `PROCESSING`

**Debug:**
```bash
# Check batch status in MongoDB:
db.batches.findOne({ batchId: "HB-0001" })
# Should show: status: "received"
```

---

### Error: "Lab couldn't see any batches"

**Cause:** No batches with status `RECEIVED`

**Solution:**

1. Farmer: Create batch
2. Supplier: Receive batch via `/api/receive/batch`
3. Lab refresh page to see `received` batches

**Debug Endpoints:**
```bash
# Get all testable batches:
GET http://localhost:5000/api/lab/testable-batches

# Expected response:
{
  "success": true,
  "count": 1,
  "batches": [{"batchId": "HB-0001", "status": "received", ...}]
}
```

---

## 📊 STATUS VERIFICATION CHECKLIST

| Stage | Status | Verified By | API Check |
|-------|--------|------------|-----------|
| ✅ Farmer Harvest | HARVESTED | Farmer UI | `GET /api/batches` → status="harvested" |
| ✅ Supplier Receive | RECEIVED | Supplier UI | `GET /api/receive/batch` → success |
| ✅ Supplier Process | PROCESSING | Supplier UI | `GET /api/batches` → status="processing" |
| ✅ Lab Test | TESTED | Lab UI | `GET /api/lab/testable-batches` → empty |
| ✅ Supplier Package | PACKAGED | Supplier UI | `GET /api/batches` → status="packaged" |
| ✅ Distribution | DISTRIBUTED | Sales API | `POST /api/sales/create` → success |
| ✅ Consumer Verify | VERIFIED | Trace Page | `/trace/[batchId]` → all data shown |

---

## 🧬 BLOCKCHAIN VERIFICATION

**Verify Blockchain Chain Integrity:**

```bash
GET http://localhost:5000/api/batches/blockchain/verify

# Expected response:
{
  "valid": true,
  "message": "Blockchain integrity verified"
}
```

**If Invalid:**
```json
{
  "valid": false,
  "message": "Blockchain chain broken",
  "block": "HB-0002"
}
```

---

## 🎯 SUCCESS CRITERIA

- ✅ All 6 workflow stages completed
- ✅ Each stage shows correct status
- ✅ Status transitions validated
- ✅ Consumer sees complete supply chain
- ✅ Blockchain chain unbroken
- ✅ Certifications attached to batches
- ✅ Sales recorded accurately
- ✅ QR codes scannable and functional

---

## 📝 NOTES

- **Timeline:** Complete workflow takes ~2 minutes to test
- **Test Accounts:** All pre-created and ready to use
- **Database:** MongoDB `herbtrace` must be running
- **Servers:** Both backend + frontend must be running
- **Browser:** Use modern browser with camera support for QR scanning

---

**End of Testing Guide**
