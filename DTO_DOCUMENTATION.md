# API DTO Documentation

## Node Detail DTO Format

**Version:** 2.0.0  
**Last Updated:** December 6, 2024

---

## Overview

The Xandeum Analytics API provides rich, frontend-ready data through a comprehensive Data Transfer Object (DTO) format. Instead of raw database fields, the API returns computed metrics and human-readable values.

---

## DTO Structure

### Complete Example Response

```json
{
  "id": "cmiurj929001lgoxiswdyo649",
  "address": "89.123.115.81:9001",
  "ip": "89.123.115.81",
  "port": "9001",
  "pubkey": "BdpHetTcidNao9FEUdtu9uNu8WvGXauevLFXZQuUdvSD",
  "version": "0.6.0",

  "lastSeenTimestamp": 1765057400,
  "lastSeenAt": "2025-12-06T21:43:20.000Z",
  "lastSeenAgoSeconds": 2930,
  "online": false,

  "cpuPercent": 0.4926108419895172,
  "uptimeSeconds": 99039,
  "uptimeHuman": "1d 3h 30m",

  "ramUsedBytes": 776278016,
  "ramTotalBytes": 8209649664,
  "ramUsedGB": 0.776278016,
  "ramTotalGB": 8.209649664,
  "ramUsagePercent": 9.455677742304205,

  "totalBytes": 96947,
  "totalBytesMB": 0.096947,
  "fileSizeBytes": 120000000000,
  "fileSizeGB": 120,
  "totalPages": 0,
  "storageUtilizationPercent": 0.00008078916666666667,

  "packetsReceived": 3959,
  "packetsSent": 4130,
  "activeStreams": 2,

  "lastUpdatedTs": 1764961470,
  "createdAt": "2025-12-06T20:45:23.961Z",
  "updatedAt": "2025-12-06T21:48:00.530Z"
}
```

---

## Field Reference

### Identity Fields

| Field     | Type    | Description                     | Example                |
| --------- | ------- | ------------------------------- | ---------------------- |
| `id`      | string  | Unique node identifier (CUID)   | `"cmiurj929..."`       |
| `address` | string  | Full node address (IP:Port)     | `"89.123.115.81:9001"` |
| `ip`      | string  | Node IP address                 | `"89.123.115.81"`      |
| `port`    | string  | Node port                       | `"9001"`               |
| `pubkey`  | string? | Node public key (Solana format) | `"BdpHet..."`          |
| `version` | string? | Node software version           | `"0.6.0"`              |

### Liveness Fields

| Field                | Type     | Description                       | Example                      |
| -------------------- | -------- | --------------------------------- | ---------------------------- |
| `lastSeenTimestamp`  | number?  | Unix timestamp (seconds)          | `1765057400`                 |
| `lastSeenAt`         | string?  | ISO 8601 timestamp                | `"2025-12-06T21:43:20.000Z"` |
| `lastSeenAgoSeconds` | number?  | Seconds since last seen           | `2930`                       |
| `online`             | boolean? | Online status (< 5 min threshold) | `false`                      |

**Online Status Logic:**

- `true` if last seen within 300 seconds (5 minutes)
- `false` if last seen more than 5 minutes ago
- `null` if no timestamp available

### System Metrics

| Field           | Type    | Description           | Example        |
| --------------- | ------- | --------------------- | -------------- |
| `cpuPercent`    | number? | CPU usage percentage  | `0.49` (0.49%) |
| `uptimeSeconds` | number? | Uptime in seconds     | `99039`        |
| `uptimeHuman`   | string? | Human-readable uptime | `"1d 3h 30m"`  |

**Uptime Format:**

- Days: `Xd` (if > 0)
- Hours: `Xh` (if > 0)
- Minutes: `Xm` (if > 0)
- Falls back to seconds: `Xs`
- Example: `"2d 15h 42m"`, `"8h 30m"`, `"45m"`

### Memory Metrics

| Field             | Type    | Description            | Example        |
| ----------------- | ------- | ---------------------- | -------------- |
| `ramUsedBytes`    | number? | RAM used in bytes      | `776278016`    |
| `ramTotalBytes`   | number? | Total RAM in bytes     | `8209649664`   |
| `ramUsedGB`       | number? | RAM used in gigabytes  | `0.776`        |
| `ramTotalGB`      | number? | Total RAM in gigabytes | `8.21`         |
| `ramUsagePercent` | number? | RAM usage percentage   | `9.46` (9.46%) |

**Calculation:**

```
ramUsedGB = ramUsedBytes / 1,000,000,000
ramTotalGB = ramTotalBytes / 1,000,000,000
ramUsagePercent = (ramUsedBytes / ramTotalBytes) * 100
```

### Storage Metrics

| Field                       | Type    | Description            | Example        |
| --------------------------- | ------- | ---------------------- | -------------- |
| `totalBytes`                | number? | Total bytes stored     | `96947`        |
| `totalBytesMB`              | number? | Total megabytes stored | `0.097`        |
| `fileSizeBytes`             | number? | File size in bytes     | `120000000000` |
| `fileSizeGB`                | number? | File size in gigabytes | `120`          |
| `totalPages`                | number? | Number of pages        | `0`            |
| `storageUtilizationPercent` | number? | Storage utilization %  | `0.0000808`    |

**Calculation:**

```
totalBytesMB = totalBytes / 1,000,000
fileSizeGB = fileSizeBytes / 1,000,000,000
storageUtilizationPercent = (totalBytes / fileSizeBytes) * 100
```

### Network Metrics

| Field             | Type    | Description            | Example |
| ----------------- | ------- | ---------------------- | ------- |
| `packetsReceived` | number? | Total packets received | `3959`  |
| `packetsSent`     | number? | Total packets sent     | `4130`  |
| `activeStreams`   | number? | Active network streams | `2`     |

### Bookkeeping Fields

| Field           | Type    | Description                 | Example                      |
| --------------- | ------- | --------------------------- | ---------------------------- |
| `lastUpdatedTs` | number? | Last stats update timestamp | `1764961470`                 |
| `createdAt`     | string  | First seen (ISO 8601)       | `"2025-12-06T20:45:23.961Z"` |
| `updatedAt`     | string  | Last synced (ISO 8601)      | `"2025-12-06T21:48:00.530Z"` |

---

## Null Values

Fields marked with `?` can be `null` when:

- Node hasn't been synced with detailed stats yet
- Node was unreachable during last sync
- Field not provided by the node's API
- Data not applicable for this node

**Example with nulls:**

```json
{
  "address": "192.168.1.1:9001",
  "cpuPercent": null,
  "ramUsedGB": null,
  "uptimeHuman": null,
  "online": null
}
```

---

## Frontend Usage Examples

### React/TypeScript

```typescript
interface NodeDTO {
  // Identity
  id: string;
  address: string;
  ip: string;
  port: string | null;
  pubkey: string | null;
  version: string | null;

  // Liveness
  lastSeenTimestamp: number | null;
  lastSeenAt: string | null;
  lastSeenAgoSeconds: number | null;
  online: boolean | null;

  // System
  cpuPercent: number | null;
  uptimeSeconds: number | null;
  uptimeHuman: string | null;

  // Memory
  ramUsedBytes: number | null;
  ramTotalBytes: number | null;
  ramUsedGB: number | null;
  ramTotalGB: number | null;
  ramUsagePercent: number | null;

  // Storage
  totalBytes: number | null;
  totalBytesMB: number | null;
  fileSizeBytes: number | null;
  fileSizeGB: number | null;
  totalPages: number | null;
  storageUtilizationPercent: number | null;

  // Network
  packetsReceived: number | null;
  packetsSent: number | null;
  activeStreams: number | null;

  // Bookkeeping
  lastUpdatedTs: number | null;
  createdAt: string;
  updatedAt: string;
}

// Fetch and use
const node: NodeDTO = await fetch(
  `http://localhost:3000/pnodes/${encodeURIComponent(address)}`,
).then((r) => r.json());

console.log(`Node: ${node.address}`);
console.log(`Status: ${node.online ? "Online" : "Offline"}`);
console.log(`CPU: ${node.cpuPercent?.toFixed(2) ?? "N/A"}%`);
console.log(
  `RAM: ${node.ramUsedGB?.toFixed(2) ?? "N/A"} GB / ${node.ramTotalGB?.toFixed(2) ?? "N/A"} GB`,
);
console.log(`Uptime: ${node.uptimeHuman ?? "N/A"}`);
```

### Display Components

**System Metrics Card:**

```tsx
function SystemMetrics({ node }: { node: NodeDTO }) {
  return (
    <div className="metrics-card">
      <h3>System Metrics</h3>
      <div className="metric">
        <span>CPU Usage:</span>
        <span>{node.cpuPercent?.toFixed(2) ?? "N/A"}%</span>
      </div>
      <div className="metric">
        <span>RAM Usage:</span>
        <span>
          {node.ramUsagePercent?.toFixed(1) ?? "N/A"}% (
          {node.ramUsedGB?.toFixed(2) ?? "N/A"} /{" "}
          {node.ramTotalGB?.toFixed(2) ?? "N/A"} GB)
        </span>
      </div>
      <div className="metric">
        <span>Uptime:</span>
        <span>{node.uptimeHuman ?? "N/A"}</span>
      </div>
    </div>
  );
}
```

**Online Status Badge:**

```tsx
function OnlineStatus({ node }: { node: NodeDTO }) {
  if (node.online === null) {
    return <span className="badge badge-unknown">Unknown</span>;
  }

  return (
    <span className={`badge ${node.online ? "badge-online" : "badge-offline"}`}>
      {node.online ? "Online" : "Offline"}
      {node.lastSeenAgoSeconds && (
        <small> ({Math.floor(node.lastSeenAgoSeconds / 60)}m ago)</small>
      )}
    </span>
  );
}
```

**Network Stats:**

```tsx
function NetworkStats({ node }: { node: NodeDTO }) {
  const packetRatio =
    node.packetsReceived && node.packetsSent
      ? (node.packetsSent / node.packetsReceived).toFixed(2)
      : "N/A";

  return (
    <div>
      <p>Packets In: {node.packetsReceived?.toLocaleString() ?? "N/A"}</p>
      <p>Packets Out: {node.packetsSent?.toLocaleString() ?? "N/A"}</p>
      <p>Active Streams: {node.activeStreams ?? "N/A"}</p>
      <p>Out/In Ratio: {packetRatio}</p>
    </div>
  );
}
```

---

## Filtering & Sorting Examples

### Get Online Nodes Only

```bash
curl http://localhost:3000/pnodes | jq '[.[] | select(.online == true)]'
```

### Get Nodes by RAM Usage (High to Low)

```bash
curl http://localhost:3000/pnodes | jq '[.[] | select(.ramUsagePercent != null)] | sort_by(-.ramUsagePercent) | .[0:10]'
```

### Get Nodes with High Uptime

```bash
curl http://localhost:3000/pnodes | jq '[.[] | select(.uptimeSeconds > 86400)] | length'
```

### Calculate Average CPU Usage

```bash
curl http://localhost:3000/pnodes | jq '[.[] | select(.cpuPercent != null) | .cpuPercent] | add / length'
```

---

## Dashboard Metrics Examples

### System Overview

```typescript
interface SystemOverview {
  totalNodes: number;
  onlineNodes: number;
  offlineNodes: number;
  avgCpuUsage: number;
  avgRamUsage: number;
  avgUptime: string;
  totalPackets: number;
}

async function getSystemOverview(): Promise<SystemOverview> {
  const nodes: NodeDTO[] = await fetch("http://localhost:3000/pnodes").then(
    (r) => r.json(),
  );

  const onlineNodes = nodes.filter((n) => n.online === true).length;
  const nodesWithCpu = nodes.filter((n) => n.cpuPercent !== null);
  const nodesWithRam = nodes.filter((n) => n.ramUsagePercent !== null);
  const nodesWithUptime = nodes.filter((n) => n.uptimeSeconds !== null);

  const avgCpu =
    nodesWithCpu.length > 0
      ? nodesWithCpu.reduce((sum, n) => sum + (n.cpuPercent ?? 0), 0) /
        nodesWithCpu.length
      : 0;

  const avgRam =
    nodesWithRam.length > 0
      ? nodesWithRam.reduce((sum, n) => sum + (n.ramUsagePercent ?? 0), 0) /
        nodesWithRam.length
      : 0;

  const avgUptimeSeconds =
    nodesWithUptime.length > 0
      ? nodesWithUptime.reduce((sum, n) => sum + (n.uptimeSeconds ?? 0), 0) /
        nodesWithUptime.length
      : 0;

  const totalPackets = nodes.reduce(
    (sum, n) => sum + (n.packetsReceived ?? 0) + (n.packetsSent ?? 0),
    0,
  );

  return {
    totalNodes: nodes.length,
    onlineNodes,
    offlineNodes: nodes.length - onlineNodes,
    avgCpuUsage: avgCpu,
    avgRamUsage: avgRam,
    avgUptime: formatUptime(avgUptimeSeconds),
    totalPackets,
  };
}
```

---

## Version History

### v2.0.0 (Current)

- Added derived metrics (GB conversions, percentages)
- Added `ip` and `port` split from `address`
- Added `online` boolean flag
- Added `uptimeHuman` human-readable format
- Added `lastSeenAt` ISO timestamp
- Added `lastSeenAgoSeconds` for time calculations
- Added `ramUsagePercent` calculation
- Added `storageUtilizationPercent` calculation
- Fixed `createdAt` and `updatedAt` to return ISO strings

### v1.0.0

- Initial release with raw database fields
- BigInt values as strings
- Basic field mapping

---

## API Endpoints

### GET /pnodes

Returns array of all nodes with full DTO format.

**Cache:** 30 seconds  
**Response:** `NodeDTO[]`

### GET /pnodes/:address

Returns single node with full DTO format.

**Cache:** 30 seconds  
**Response:** `NodeDTO`  
**404:** `{ "error": "Node not found" }`

---

## Notes for Frontend Developers

1. **Always check for null values** - Not all nodes have complete metrics
2. **Use optional chaining** - `node.cpuPercent?.toFixed(2) ?? 'N/A'`
3. **Format numbers** - Use `.toFixed()` for decimals, `.toLocaleString()` for large numbers
4. **Handle offline nodes** - Show graceful UI when `online === false`
5. **Relative timestamps** - Use `lastSeenAgoSeconds` for "5 minutes ago" displays
6. **Percentage bars** - Use `ramUsagePercent` and `cpuPercent` directly for progress bars
7. **Color coding** - Green for online, red for offline, gray for unknown
8. **Loading states** - Show skeletons while fetching from API

---

## Support

For questions or issues:

- Check `PHASES_7-10_SUMMARY.md` for implementation details
- Check `PHASE_10_COMPLETE.md` for API documentation
- Check `PRODUCTION_CHECKLIST.md` for deployment guide

**Last Updated:** December 6, 2024  
**API Version:** 2.0.0
