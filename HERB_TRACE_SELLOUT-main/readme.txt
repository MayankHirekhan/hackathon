# 🌿 HerbTrace – Blockchain Herbal Supply Chain Traceability

HerbTrace is a **blockchain-integrated herbal supply chain tracking platform** designed to ensure **transparency, authenticity, and traceability** of medicinal herbs from **farm to consumer**.

The system allows farmers, suppliers, labs, and consumers to interact with a **secure QR-based traceability platform**, ensuring that every herbal product can be verified.

---

# 🚀 Key Features

• QR Code Based Herb Traceability
• Blockchain Integrity for Batch Records
• Farmer Harvest Logging
• Supplier Processing & Packaging
• Inventory Tracking System
• Consumer Trace Page
• GPS Farm Location Tracking
• Lab Certification Integration

---

# 🧱 System Architecture

```
Farmer Harvest
      │
      ▼
Batch Creation
      │
      ▼
Lab Certification
      │
      ▼
Supplier Receive Batch
      │
      ▼
Processing Log
      │
      ▼
Packaging + QR Generation
      │
      ▼
Inventory System
      │
      ▼
Consumer QR Scan → Trace Page
```

---

# 👥 User Roles

The system includes multiple roles.

## 👨‍🌾 Farmer

Farmers register harvested herbs and generate traceable batches.

### Farmer Dashboard Modules

Harvest Logging
Creates new herb batches with:

• Herb Name
• Harvest Date
• Quantity
• Farm Location
• GPS Coordinates

QR Code Generation
Each harvest batch generates a **QR code**.

QR contains:

```
/trace/{batchId}
```

Example:

```
/trace/HB-0003
```

---

## 🏭 Supplier

Suppliers receive herbs, process them, package them, and generate product QR codes.

### Supplier Dashboard Modules

#### Receive Batch

Scan farmer QR code to receive herbs.

When scanned:

• Batch is validated
• Stored in supplier inventory

---

#### Processing Log

Manual processing record.

Inputs:

• Herb Type
• Farmer Name
• Quantity
• Processing Method
• Temperature
• Duration
• Yield Percentage
• Waste

Batch is then stored in database.

---

#### Packaging

Generate packets from processed herbs.

Example:

```
10kg batch
packet size = 250g
Total packets = 40
```

Each packet generates a **unique QR code**.

Example packet ID:

```
PKT172891234
```

QR leads to:

```
/trace/PKT172891234
```

---

#### Inventory

Displays all processed batches:

• Batch ID
• Herb Name
• Farmer
• Quantity
• Location

---

## 🧪 Lab

Labs verify herbal quality.

Lab adds:

• Test result
• Certification status
• Verified lab information

---

## 👤 Consumer

Consumers scan QR codes and view full product trace.

Trace page shows:

• Herb Name
• Farmer
• Harvest Location
• GPS Coordinates
• Batch ID
• Supplier
• Processing Details
• Lab Verification

---

# 🧾 QR Code Flow

Farmer QR:

```
/trace/HB-0003
```

Packet QR:

```
/trace/PKT172891234
```

Trace page automatically loads data from MongoDB.

---

# 🧰 Tech Stack

## Frontend

Framework

Next.js **v16.1.6**

Language

TypeScript

UI

TailwindCSS

Libraries

• qrcode.react
• @zxing/browser
• React Hooks

---

## Backend

Runtime

Node.js **v20+**

Framework

Express.js **v4**

Database

MongoDB

ODM

Mongoose **v7**

Libraries

• cors
• dotenv
• crypto

---

## Blockchain Layer

Framework

Hardhat

Language

Solidity

Purpose

Blockchain integrity verification for herb batches.

---

# 📂 Project Structure

```
HERB_TREACE
│
├── backend
│   ├── models
│   ├── routes
│   ├── utils
│   ├── uploads
│   └── server.js
│
├── frontend
│   ├── app
│   │   ├── dashboard
│   │   ├── login
│   │   └── trace
│   │
│   ├── components
│   └── public
│
├── blockchain
│
└── README.md
```

---

# ⚙️ Environment Variables

Create `.env` in backend:

```
MONGO_URI=mongodb://localhost:27017/herbtrace
PORT=5000
```

Create `.env.local` in frontend:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

# 💻 Installation Guide

## 1️⃣ Clone Repository

```
git clone https://github.com/hari10621/HERB_TRACE_SELLOUT.git
```

---

## 2️⃣ Install Backend Dependencies

```
cd backend
npm install
```

---

## 3️⃣ Start Backend Server

```
node server.js
```

Server runs at:

```
http://localhost:5000
```

---

## 4️⃣ Install Frontend Dependencies

```
cd ../frontend
npm install
```

---

## 5️⃣ Run Frontend

```
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

# 📡 Example API Endpoints

Get batches

```
GET /api/batches
```

Create batch

```
POST /api/batches
```

Generate packets

```
POST /api/packets/create
```

Trace packet

```
GET /api/trace/:id
```

Receive batch

```
POST /api/receive/batch
```

---

# 🔐 Security Features

• Blockchain integrity hash
• QR verification
• Unique packet IDs
• Immutable batch records

---

# 📈 Future Improvements

• Mobile app scanner
• IoT farm sensors
• AI herb quality detection
• IPFS document storage
• Smart contract verification

---

# 👨‍💻 Author

Hari

HerbTrace Project

---

# ⭐ Project Goal

To build a **transparent, secure, and verifiable herbal supply chain** using **blockchain, QR technology, and modern web architecture**.
