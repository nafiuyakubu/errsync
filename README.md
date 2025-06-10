# errsync

> Lightweight remote error logger for Node.js, built by [Nafiu Yakubu](#)

`errsync` is a lightweight Node.js module that lets you send error logs to a remote endpoint (such as an FaaS/Lambda/Event Driven URL) for centralized error reporting and monitoring.

---

## 🚀 Features

- 📤 Send errors to a remote server via HTTP
- 🔧 Configure your own endpoint
- 🏷️ Include metadata like tags, service name, payload, and error type
- 🪶 Lightweight and zero-dependency except `axios`

---

## 📦 Installation

```bash
npm install errsync
```

## ⚙️ Configuration

Set the logging endpoint either via environment variable or programmatically.

### Option 1: Use environment variable

```env
ERRSYNC_LOGGER_URL=https://your-lambda-url.on.aws/
```

### Option 2: Configure in code

```js
const { configureLogger } = require("errsync");

configureLogger({
  endpoint: "https://your-endpoint-url.com/",
});
```

## 🧪 Usage

```js
const { configureLogger, logError } = require("errsync");

// Optional: configure programmatically (or use env var)
configureLogger({
  endpoint: "https://your-endpoint-url.com/",
});

async function simulateApp() {
  try {
    throw new Error("Payment processing failed");
  } catch (error) {
    await logError({
      service: "payment-service",
      type: "TRANSACTION_ERROR",
      error,
      tags: ["critical", "payment"],
      payload: {
        userId: "user_123",
        transactionId: "txn_789",
        amount: 2000,
      },
    });
  }
}

simulateApp();
```

## 📤 Example Payload Sent

```json
{
  "service": "payment-service",
  "type": "TRANSACTION_ERROR",
  "errorMessage": "Payment processing failed",
  "error": {
    "name": "Error",
    "message": "Payment processing failed",
    "stack": "Error: Payment processing failed\n    at simulateApp..."
  },
  "payload": {
    "userId": "user_123",
    "transactionId": "txn_789",
    "amount": 2000
  },
  "tags": ["critical", "payment"],
  "timestamp": "2025-06-09T14:25:00.000Z"
}
```

## 📘 API Reference

### `configureLogger({ endpoint })`

| Param      | Type   | Required | Description            |
| ---------- | ------ | -------- | ---------------------- |
| `endpoint` | String | ✅       | Your remote logger URL |

### `logError({ service, type, error, tags?, payload? })`

| Param     | Type     | Required | Description                       |
| --------- | -------- | -------- | --------------------------------- |
| `service` | String   | ✅       | Name of your service/module       |
| `type`    | String   | ✅       | Type/category of the error        |
| `error`   | Error    | ✅       | JavaScript `Error` object         |
| `tags`    | String[] | ❌       | Extra tags for grouping/filtering |
| `payload` | Object   | ❌       | Additional context/metadata       |

## ❗ Throws if No Endpoint Configured

If `ERRSYNC_LOGGER_URL` is not set and `configureLogger()` was not called, the logger will throw a runtime error when invoked.

## 🛡 License

MIT © [Nafiu Yakubu](#)
