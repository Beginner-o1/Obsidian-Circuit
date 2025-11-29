const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const pcapParser = require('pcap-parser');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

function toIPv4(buf, start) {
  return `${buf[start]}.${buf[start + 1]}.${buf[start + 2]}.${buf[start + 3]}`;
}

function analyzePcap(filePath) {
  return new Promise((resolve, reject) => {
    const parser = pcapParser.parse(fs.createReadStream(filePath));

    const logs = [];
    const suspicious = [];
    const fragments = {};

    parser.on('packet', (packet) => {
      const data = packet.data;
      if (!data || data.length < 34) return;

      try {
        const etherType = data.readUInt16BE(12);
        if (etherType !== 0x0800) return;

        const ipStart = 14;
        const verIhl = data[ipStart];
        const ihl = (verIhl & 0x0f) * 4;

        const identification = data.readUInt16BE(ipStart + 4);
        const flagsOffset = data.readUInt16BE(ipStart + 6);
        const moreFragments = (flagsOffset & 0x2000) !== 0;
        const fragmentOffset = (flagsOffset & 0x1fff) * 8;

        const srcIP = toIPv4(data, ipStart + 12);
        const dstIP = toIPv4(data, ipStart + 16);
        const protocol = data[ipStart + 9];

        const logEntry = {
          srcIP,
          dstIP,
          protocol,
          moreFragments,
          fragmentOffset
        };

        logs.push(logEntry);

        if (!fragments[identification]) fragments[identification] = [];
        if (moreFragments || fragmentOffset > 0) {
          fragments[identification].push(fragmentOffset);
        }

        if (![1, 6, 17].includes(protocol)) {
          suspicious.push({
            type: "Unknown Protocol",
            details: `Non-standard protocol ${protocol} from ${srcIP}`
          });
        }

        if (fragmentOffset > 3000) {
          suspicious.push({
            type: "Large Fragment Offset",
            details: `${srcIP} offset=${fragmentOffset}`
          });
        }

      } catch {}
    });

    parser.on('end', () => {
      resolve({
        networkLogs: logs,
        suspiciousActivity: suspicious
      });
    });

    parser.on('error', reject);
  });
}

app.post('/api/analyze-network', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const result = await analyzePcap(filePath);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to analyze file" });
  }
});

app.listen(1000, () => {
  console.log("Server running on :1000");
});
