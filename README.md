# 🌬️ Smart HVAC System

**Smart HVAC** is an IoT-enabled web application that simulates and monitors HVAC telemetry data in real time using **Azure Event Hub**, **PostgreSQL**, **React**, and **Express.js**. The data is published in **SAREF JSON-LD format**, aligned with **EU Digital Product Passport (DPP)** standards. The system conceptually integrates **Digital Twin** principles, enabling virtual representation of physical HVAC behavior through live telemetry and semantic modeling. This repository was developed for the **Smart Industry Systems** class final project.

[Smart HVAC Demo](https://smart-hvac.vercel.app/)

---

## 📦 Features

- ✅ Real-time HVAC telemetry simulation (temperature, humidity, energy)
- 🌐 Frontend dashboard with DPP-compliant product information
- 📡 Azure Event Hub integration (publisher & subscriber)
- 🗃️ PostgreSQL data persistence
- 📊 Metrics for energy consumption and lifecycle events
- 🧠 Semantic sensor data based on [SAREF ontology](https://saref.etsi.org/core/)
- ⚡ Deployed frontend via [Vercel](https://vercel.com/)

---

## 🧱 Project Structure

<pre>
smart-hvac/
├── api/                # Express API routes
│   ├── dpp-metrics.js
│   ├── events.js
│   └── publisher-control.js
├── scripts/            # Publisher & Subscriber scripts
│   ├── publisher.js
│   └── subscriber.js
├── src/                # React frontend
│   ├── SmartHVACApp.jsx
│   ├── index.js
├── public/
├── .env
└── README.md
</pre>


---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://gitlab.utwente.nl/s3490289/smart-hvac.git
cd smart-hvac
```

### 2. Install dependencies

```bash
npm install
```
### 3. Configure Environment Variables

Create a `.env` file in the root and define:

```bash
EVENT_HUB_CONNECTION_STRING={event_hub_connection_string}
EVENT_HUB_NAME={event_hub_name}

DB_USER={db_username}
DB_PASSWORD={db_password}
DB_HOST={db_host}
DB_PORT={db_port}
DB_NAME={db_name}
```

### 4. Run Local Development

#### React Frontend

```bash
npm start
```

#### Simulate Publisher (send telemetry)

```bash
npm run publish-event
```

#### Start Event Listener (subscriber)

```bash
npm run listen-events
```

---

## 🔎 Example SAREF JSON-LD Telemetry

```json
{
  "@context": "https://saref.etsi.org/core",
  "@type": "saref:Sensor",
  "timestamp": "2025-06-29T15:10:42.080Z",
  "temperature": "25.82",
  "humidity": "43.0",
  "energy": "6.02",
  "status": "OK",
  "location": { "latitude": 52.2394, "longitude": 6.8529 },
  "saref:measuresProperty": {
    "temperature": {
      "@type": "saref:Temperature",
      "saref:hasValue": "25.82",
      "saref:hasUnit": "Celsius"
    },
    "humidity": {
      "@type": "saref:Humidity",
      "saref:hasValue": "43.0",
      "saref:hasUnit": "Percent"
    },
    "energy": {
      "@type": "saref:Energy",
      "saref:hasValue": "6.02",
      "saref:hasUnit": "kWh"
    }
  }
}
```

---

## 📊 Metrics Overview

- **Energy Consumption**: Total kWh based on telemetry
- **Lifecycle Duration**: Displayed in human-readable `hh:mm:ss` format (derived from total events)
- **Location**: GPS-simulated sensor position (Enschede, NL)

---

## 🛠️ Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Frontend       | React, Tailwind CSS               |
| Backend API    | Node.js, Express.js               |
| Data Storage   | PostgreSQL                        |
| Messaging Bus  | Azure Event Hub                   |
| Semantic Model | JSON-LD + SAREF Ontology          |
| Deployment     | Vercel (frontend)                 |

---

## 📚 References

- [SAREF Ontology](https://saref.etsi.org/core/)
- [Azure Event Hub Docs](https://learn.microsoft.com/en-us/azure/event-hubs/)
- [EU Digital Product Passport](https://single-market-economy.ec.europa.eu/sustainability/product-policy-and-ecodesign/digital-product-passport_en)

---

## 👨‍💻 Author

**Aidil Ikbar (s349289)** – [@aidilikbar.com](https://aidilikbar.com) | [github.com/aidilikbar](https://github.com/aidilikbar)

---

## 📝 License

This project is licensed under the MIT License.
