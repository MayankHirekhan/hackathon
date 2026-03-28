# 🌿 HerbTrace Supply Chain Workflow
## Complete Product Journey: Farmer → Consumer

---

## 📋 WORKFLOW OVERVIEW

```
┌─────────────┐
│   FARMER    │  Creates & Harvests Batch
│  (Stage 1)  │  Status: HARVESTED
└──────┬──────┘
       │ (QR Generated)
       ↓
┌─────────────────────────────┐
│  SUPPLIER INVENTORY         │  Receives Batch
│  (Stage 2a)                 │  Status: RECEIVED
│  - Stores batch             │  Generates Packets
└──────┬──────────────────────┘
       │
       ↓
┌─────────────────────────────┐
│ SUPPLIER PROCESSING         │  Processes & Dries
│  (Stage 2b)                 │  Status: PROCESSING
│  - Drying temperature       │  
│  - Processing duration      │
└──────┬──────────────────────┘
       │ (QR on Packets)
       ↓
┌─────────────────────────────┐
│  LAB TESTING                │  Tests Quality
│  (Stage 3)                  │  Status: TESTED
│  - Lab results              │  Certificate issued
│  - Quality certification    │
└──────┬──────────────────────┘
       │
       ↓
┌─────────────────────────────┐
│ SUPPLIER PACKAGING          │  Packages Herbs
│  (Stage 4)                  │  Status: PACKAGED
│  - Creates final packets    │  Ready to distribute
│  - Labels with cert #       │
└──────┬──────────────────────┘
       │ (Distribution)
       ↓
┌─────────────────────────────┐
│ DISTRIBUTION/SALES          │  Sells to Consumer
│  (Stage 5)                  │  Status: DISTRIBUTED
│  - Records sale             │  Consumer receives QR
│  - Creates sales record     │
└──────┬──────────────────────┘
       │
       ↓
┌─────────────────────────────┐
│  CONSUMER VERIFICATION      │  Traces Origin
│  (Stage 6)                  │  Scans QR
│  - Scans QR code            │  Sees full history
│  - Views full history       │
│  - Verifies blockchain      │
└─────────────────────────────┘
```

---

## 🚀 DETAILED STAGES

### **STAGE 1: FARMER - BATCH CREATION** 
**Actor:** Farmer | **Status:** `HARVESTED`

**Actions:**
1. Farmer logs into dashboard
2. Enters harvest details:
   - Herb name
   - Quantity (kg)
   - Harvest date
   - Location (GPS coordinates → Google Map image)
3. System generates:
   - **Batch ID** (HB-0001, HB-0002, etc.)
   - **Hash** (SHA256 of batch data) → Blockchain ledger
   - **Previous Hash** (links to previous batch)
4. Farmer's profile photo auto-attached
5. Batch stored with status: `HARVESTED`

**Outputs:**
- Batch created in MongoDB
- Blockchain entry created
- Batch ready for supplier pickup

---

### **STAGE 2a: SUPPLIER - BATCH RECEIPT**
**Actor:** Supplier | **Status:** `RECEIVED`

**Actions:**
1. Supplier views received batches in inventory
2. Scans Farmer's **Batch QR** OR enters batch ID manually
3. System searches for batch by `batchId`
4. If found:
   - Updates `batch.status` → `RECEIVED`
   - Records `supplierId` and `supplierName`
   - Timestamps receipt date
5. Supplier confirms receipt

**Outputs:**
- Batch now in Supplier's inventory
- Status change logged in blockchain

---

### **STAGE 2b: SUPPLIER - PROCESSING**
**Actor:** Supplier | **Status:** `PROCESSING`

**Actions:**
1. Supplier processes the herbs:
   - Selects drying temperature
   - Records processing duration
   - Documents processing method (e.g., "air-dried", "oven-dried")
2. Creates **Packets** from batch:
   - Splits batch into smaller packets
   - Each packet gets unique ID (PKT-0001, PKT-0002, etc.)
   - Generates **Packet QR codes** (links to `/trace/[batchId]`)
3. Updates batch status → `PROCESSING`
4. Records processing metadata in batch

**Outputs:**
- Processing details stored
- Packets created with their own IDs
- Each packet has traceable QR code
- Batch status: `PROCESSING`

---

### **STAGE 3: LAB - TESTING & CERTIFICATION**
**Actor:** Lab Tester | **Status:** `TESTED`

**Actions:**
1. Lab views available batches (status = `RECEIVED`)
2. Selects batch for testing
3. Performs quality tests:
   - Tests for contaminants
   - Records test results
   - Issues certification if pass
4. Updates batch:
   - Sets `labTested` → `true`
   - Records `labResult` (PASS/FAIL)
   - Attaches `labName` (which lab tested it)
   - Timestamps `labTestDate`
5. Changes status → `TESTED`
6. Generates **Certification document**

**Outputs:**
- Lab test results recorded
- Certification issued
- Certificate number attached to batch
- Batch status: `TESTED`
- Ready for packaging

---

### **STAGE 4: SUPPLIER - PACKAGING**
**Actor:** Supplier | **Status:** `PACKAGED`

**Actions:**
1. Supplier packages tested herbs:
   - Takes tested batch
   - Creates final consumer packets
   - Labels each with:
     - Herb name
     - Batch ID
     - Lab certification number
     - Expiry date
     - Company logo
2. Updates batch status → `PACKAGED`
3. Records packaging date

**Outputs:**
- Final packaged products ready for sale
- Each packet has all traceability info
- Batch status: `PACKAGED`

---

### **STAGE 5: DISTRIBUTION - SALES**
**Actor:** Supplier/Sales Team | **Status:** `DISTRIBUTED`

**Actions:**
1. Customer purchases packaged product
2. Sales team records sale:
   - Customer name
   - Purchase date
   - Packet IDs sold
   - Sale price
3. System updates:
   - Changes batch status → `DISTRIBUTED`
   - Records sale in `salesRoute`
   - Generates receipt/invoice
4. Consumer receives packet with **QR code**

**Outputs:**
- Sale recorded in system
- Consumer has packet with QR code
- Batch status: `DISTRIBUTED`

---

### **STAGE 6: CONSUMER - VERIFICATION & TRACING**
**Actor:** Consumer | **Status:** View-only

**Actions:**
1. Consumer scans **Packet QR** (embedded on package)
2. QR links to: `/trace/[batchId]`
3. Consumer sees complete supply chain:
   - **Farmer info**: Name, location, photo, rating
   - **Batch info**: Harvest date, GPS location, map image
   - **Supplier info**: Processing details, drying method
   - **Lab info**: Test results, certification, pass/fail
   - **Blockchain**: 
     - Batch hash (SHA256)
     - Previous hash (linked chain)
     - Verification status ✓
4. Can verify blockchain integrity
5. Confirms product authenticity

**Outputs:**
- Complete traceability view
- Consumer confidence
- Blockchain verification proof

---

## 📊 STATUS FLOW CHART

```
HARVESTED
    ↓ (Supplier receives)
RECEIVED
    ↓ (Supplier processes)
PROCESSING
    ↓ (Creates packets)
    ↓ (Lab tests)
TESTED
    ↓ (Supplier packages)
PACKAGED
    ↓ (Sold to consumer)
DISTRIBUTED
    ↓ (Consumer scans)
VERIFIED ✓
```

---

## 🔄 DATA FLOW BY ROLE

### **FARMER**
- ✅ Create batch (harvest)
- ✅ View created batches
- ✅ Monitor batch progress
- ❌ Cannot modify after submission

### **SUPPLIER**
- ✅ Receive batches (scan QR or enter ID)
- ✅ View received inventory
- ✅ Process batches (add processing details)
- ✅ Create packets from batch
- ✅ View processing history
- ✅ Ship packaged products

### **LAB TESTER**
- ✅ View received/processing batches
- ✅ Conduct quality tests
- ✅ Record test results
- ✅ Issue certifications
- ✅ Generate lab reports
- ✅ View batch history

### **SUPPLIER (SALES/PACKAGING)**
- ✅ View tested batches
- ✅ Package in final containers
- ✅ Generate sales records
- ✅ Record customer info
- ✅ Track distributed batches

### **CONSUMER**
- ✅ Scan QR code
- ✅ View full supplier chain
- ✅ Verify blockchain
- ✅ Check certifications
- ❌ Cannot modify anything

### **ADMIN**
- ✅ Monitor all batches
- ✅ View all roles' activities
- ✅ Generate analytics
- ✅ Manage users
- ✅ Verify blockchain integrity

---

## 🗄️ DATABASE RECORDS

| Stage | Collection | Key Fields |
|-------|-----------|-----------|
| 1 | **Batches** | batchId, farmerId, herbName, quantity, hash, previousHash, status=HARVESTED |
| 2a | **Batches** | supplierId, supplierName, status=RECEIVED |
| 2b | **Batches** | processingMethod, dryingTemperature, processingDuration, status=PROCESSING |
| 2b | **Packets** | packetId, batchId, packetQR |
| 3 | **Batches** | labTested=true, labResult, labName, labTestDate, status=TESTED |
| 4 | **Batches** | status=PACKAGED, packagingDate |
| 5 | **Sales** | customerId, packetIds, purchaseDate, price, status=DISTRIBUTED |
| 6 | **ViewOnly** | Consumer traces batch via QR |

---

## ✅ QUALITY CHECKPOINTS

| Checkpoint | Verified By | Requirement |
|-----------|----------|------------|
| **Harvest Quality** | Farmer | Valid GPS, quantity > 0 |
| **Receipt Confirmation** | Supplier | Batch found in system |
| **Processing Proof** | Supplier | Temperature, duration logged |
| **Lab Certification** | Lab | Test passed, certificate issued |
| **Packaging Compliance** | Supplier | All labels applied |
| **Consumer Verification** | Consumer | QR scans, blockchain valid |

---

## 🔐 Blockchain Integration

**Each batch creates a block:**
- `hash`: SHA256(previousHash + batchId + herbName + quantity)
- `previousHash`: Hash of previous batch (creates chain)
- Stored in both MongoDB and (optionally) on blockchain

**Verification endpoint:**
```
GET /api/batches/blockchain/verify
→ Returns: { valid: true/false, message: "..." }
```

**Consumer can verify:**
- Cannot tamper with batch data
- Chain of custody is unbroken
- All timestamps authentic

---

## 🚨 CURRENT ISSUES TO FIX

1. **Unclear batch status transitions** → Define allowed transitions
2. **Packet QR vs Batch QR confusion** → Separate them properly
3. **Lab doesn't see processing batches** → Filter by `status === "received"` 
4. **Sales flow incomplete** → Need proper sales recording
5. **No consumer distribution tracking** → Track who purchased what
6. **Blockchain not on real network** → Currently local simulation

---

## 📱 FRONTEND NAVIGATION

```
FARMER
├── Dashboard
│   ├── Create Batch
│   ├── My Batches
│   └── View Progress
│
SUPPLIER
├── Dashboard
├── Inventory (Received)
│   ├── Scan Batch QR
│   └── Manual Entry
├── Processing
│   ├── View Batches
│   ├── Add Processing Details
│   └── Create Packets
├── Receive
├── Packaging
│   └── Record as packaged
└── Sales
    └── Sell to Consumer
│
LAB
├── Dashboard
├── Test Batches
│   ├── Filter by status
│   ├── Run Quality Tests
│   └── Issue Certification
└── Reports
│
CONSUMER
├── Trace
│   ├── Scan QR
│   └── View Supply Chain
└── Verify
    └── Check Blockchain
│
ADMIN
├── Analytics
├── User Management
├── Verify Blockchain
└── Monitor All Batches
```

---

**End of Workflow Definition**
