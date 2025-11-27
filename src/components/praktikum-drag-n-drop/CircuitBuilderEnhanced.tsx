"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";

// Types
export type ComponentType = "battery" | "resistor" | "lamp" | "switch" | "wire";

interface Pos {
  x: number;
  y: number;
}

interface Terminal {
  id: "a" | "b";
  offset: Pos;
}

interface CircuitElement {
  id: string;
  type: ComponentType;
  value: number;
  position: Pos;
  rotation: 0 | 90 | 180 | 270;
  state?: "open" | "closed";
  terminals: Terminal[];
  current?: number;
  voltage?: number;
  // Untuk wire element, simpan koneksi
  connectedTo?: {
    a?: { elementId: string; terminalId: "a" | "b" };
    b?: { elementId: string; terminalId: "a" | "b" };
  };
}

interface WireEnd {
  elementId: string;
  terminalId: Terminal["id"];
}

interface Wire {
  id: string;
  from: WireEnd;
  to: WireEnd;
  current?: number;
}

// Constants
const getCanvasSize = (isMobile: boolean) => ({
  width: isMobile ? 360 : 1000,
  height: isMobile ? 400 : 600,
});

const GRID = 20;

function snapToGrid(v: number) {
  return Math.round(v / GRID) * GRID;
}

function terminalAbsPos(el: CircuitElement, termId: Terminal["id"]): Pos {
  const t = el.terminals.find((t) => t.id === termId)!;
  let dx = t.offset.x;
  let dy = t.offset.y;

  switch (el.rotation) {
    case 90: {
      const nx = -dy;
      const ny = dx;
      dx = nx;
      dy = ny;
      break;
    }
    case 180: {
      dx = -dx;
      dy = -dy;
      break;
    }
    case 270: {
      const nx = dy;
      const ny = -dx;
      dx = nx;
      dy = ny;
      break;
    }
  }
  return { x: el.position.x + dx, y: el.position.y + dy };
}

function makeElement(
  type: ComponentType,
  pos: Pos,
  isMobile: boolean
): CircuitElement {
  const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const terminalOffset = isMobile ? 35 : 50;

  switch (type) {
    case "battery":
      return {
        id,
        type,
        value: 12,
        position: pos,
        rotation: 0,
        terminals: [
          { id: "a", offset: { x: -terminalOffset, y: 0 } },
          { id: "b", offset: { x: terminalOffset, y: 0 } },
        ],
      };
    case "resistor":
      return {
        id,
        type,
        value: 100,
        position: pos,
        rotation: 0,
        terminals: [
          { id: "a", offset: { x: -terminalOffset, y: 0 } },
          { id: "b", offset: { x: terminalOffset, y: 0 } },
        ],
      };
    case "lamp":
      return {
        id,
        type,
        value: 50,
        position: pos,
        rotation: 0,
        terminals: [
          { id: "a", offset: { x: -terminalOffset, y: 0 } },
          { id: "b", offset: { x: terminalOffset, y: 0 } },
        ],
      };
    case "switch":
      return {
        id,
        type,
        value: 0,
        position: pos,
        rotation: 0,
        state: "open",
        terminals: [
          { id: "a", offset: { x: -terminalOffset, y: 0 } },
          { id: "b", offset: { x: terminalOffset, y: 0 } },
        ],
      };
    case "wire":
      return {
        id,
        type,
        value: 0,
        position: pos,
        rotation: 0,
        terminals: [
          { id: "a", offset: { x: -terminalOffset, y: 0 } },
          { id: "b", offset: { x: terminalOffset, y: 0 } },
        ],
        connectedTo: {},
      };
  }
}

// Hooks
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

// Circuit Analysis
function analyzeCircuit(elements: CircuitElement[], wires: Wire[]) {
  const graph: Record<string, Set<string>> = {};
  elements.forEach((el) => (graph[el.id] = new Set()));

  wires.forEach((wire) => {
    graph[wire.from.elementId]?.add(wire.to.elementId);
    graph[wire.to.elementId]?.add(wire.from.elementId);
  });

  elements.forEach((el) => {
    if (el.type === "wire" && el.connectedTo?.a && el.connectedTo?.b) {
      const { a, b } = el.connectedTo;
      graph[a.elementId]?.add(b.elementId);
      graph[b.elementId]?.add(a.elementId);
    }
  });

  const batteries = elements.filter((e) => e.type === "battery");
  if (batteries.length === 0) return { isConnected: false, isClosed: false };

  const visited = new Set<string>();
  const queue = [batteries[0].id];
  visited.add(batteries[0].id);

  while (queue.length > 0) {
    const current = queue.shift()!;
    graph[current]?.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    });
  }

  const nonWireElements = elements.filter((e) => e.type !== "wire");
  const isConnected = nonWireElements.every((el) => visited.has(el.id));

  // Perubahan penting di sini:
  const anyClosedPath = elements.some(
    (e) => e.type === "switch" && e.state === "closed"
  );

  return {
    isConnected,
    isClosed: isConnected && anyClosedPath, // ✅ hanya butuh 1 jalur tertutup
    hasOpenSwitch: elements.some(
      (e) => e.type === "switch" && e.state === "open"
    ),
  };
}

function calculateCurrentFlow(elements: CircuitElement[], wires: Wire[]) {
  // 🎯 Helper: Logging sederhana
  const log = {
    header: (title: string) =>
      console.log(`\n${"=".repeat(60)}\n${title}\n${"=".repeat(60)}`),
    section: (title: string) => console.log(`\n📍 ${title}`),
    info: (msg: string, data?: any) => console.log(`   ℹ️  ${msg}`, data || ""),
    success: (msg: string, data?: any) =>
      console.log(`   ✅ ${msg}`, data || ""),
    warning: (msg: string, data?: any) =>
      console.log(`   ⚠️  ${msg}`, data || ""),
    error: (msg: string, data?: any) => console.log(`   ❌ ${msg}`, data || ""),
    data: (label: string, value: any) => console.log(`   → ${label}:`, value),
  };

  log.header("🔌 ANALISIS RANGKAIAN LISTRIK");

  const batteries = elements.filter((e) => e.type === "battery");
  const resistiveElements = elements.filter(
    (e) => e.type === "resistor" || e.type === "lamp"
  );
  const switches = elements.filter((e) => e.type === "switch");

  log.section("KOMPONEN RANGKAIAN");
  log.data("Baterai", `${batteries.length} buah`);
  log.data("Lampu/Resistor", `${resistiveElements.length} buah`);
  log.data("Saklar", `${switches.length} buah`);

  // 🔘 LOGGING STATUS SAKLAR (untuk debugging)
  const closedSwitches = switches.filter((sw) => sw.state === "closed");
  const openSwitches = switches.filter((sw) => sw.state === "open");

  log.section("STATUS SAKLAR");
  closedSwitches.forEach((sw) =>
    log.success(`Switch ${sw.id.slice(-8)}: TERTUTUP`)
  );
  openSwitches.forEach((sw) => log.error(`Switch ${sw.id.slice(-8)}: TERBUKA`));
  log.data(
    "Total",
    `${closedSwitches.length} tertutup, ${openSwitches.length} terbuka`
  );

  const totalVoltage = batteries.reduce((sum, b) => sum + b.value, 0);
  log.section("TEGANGAN");
  log.data("Total Voltage", `${totalVoltage}V`);

  // PERBAIKAN: Jangan langsung return jika ada saklar terbuka
  // Kita akan handle per-cabang untuk rangkaian paralel
  if (totalVoltage === 0) {
    log.warning("Tidak ada tegangan - rangkaian mati");
    return {
      current: 0,
      power: 0,
      componentCurrents: {},
      lampPowers: {},
      topology: undefined,
    };
  }

  if (resistiveElements.length === 0) {
    log.warning("Tidak ada komponen resistif");
    return {
      current: 0,
      power: 0,
      componentCurrents: {},
      lampPowers: {},
      topology: undefined,
    };
  }

  log.section("MEMBANGUN GRAF KONEKSI");
  // Build connection graph untuk deteksi paralel
  const connectionGraph: Map<string, Set<string>> = new Map();

  // Initialize graph untuk semua elemen
  elements.forEach((el) => {
    connectionGraph.set(`${el.id}-a`, new Set());
    connectionGraph.set(`${el.id}-b`, new Set());
  });

  // Add old-style wire connections
  wires.forEach((wire) => {
    const fromNode = `${wire.from.elementId}-${wire.from.terminalId}`;
    const toNode = `${wire.to.elementId}-${wire.to.terminalId}`;
    connectionGraph.get(fromNode)?.add(toNode);
    connectionGraph.get(toNode)?.add(fromNode);
  });

  // Add wire element connections
  elements
    .filter((el) => el.type === "wire" && el.connectedTo)
    .forEach((wireEl) => {
      const connA = wireEl.connectedTo?.a;
      const connB = wireEl.connectedTo?.b;

      if (connA && connB) {
        const nodeA = `${connA.elementId}-${connA.terminalId}`;
        const nodeB = `${connB.elementId}-${connB.terminalId}`;

        connectionGraph.get(nodeA)?.add(nodeB);
        connectionGraph.get(nodeB)?.add(nodeA);
      }
    });

  // 🔧 PERBAIKAN 1: Tambahkan koneksi antar terminal SEMUA saklar untuk deteksi topologi
  // ✅ Saklar ditambahkan ke graf APAPUN statusnya (untuk deteksi struktur paralel/seri)
  // Status saklar hanya mempengaruhi perhitungan arus, bukan topologi
  switches.forEach((sw) => {
    const nodeA = `${sw.id}-a`;
    const nodeB = `${sw.id}-b`;
    connectionGraph.get(nodeA)?.add(nodeB);
    connectionGraph.get(nodeB)?.add(nodeA);
  });

  console.log(
    "🌐 [CONNECTION GRAPH] Graf koneksi struktural (semua saklar included):",
    {
      totalNodes: connectionGraph.size,
      switchesInGraph: switches.length,
      switchStates: switches.map((sw) => ({ id: sw.id, state: sw.state })),
      note: "⚠️ Graf ini untuk TOPOLOGI, bukan listrik - saklar terbuka tetap dihitung!",
    }
  );

  // 🧩 CIRVIA: Union-Find untuk mengelompokkan node yang terhubung
  // Semua node yang terhubung melalui wire dianggap sebagai satu "electrical node"
  const parent = new Map<string, string>();

  const find = (node: string): string => {
    if (!parent.has(node)) {
      parent.set(node, node);
      return node;
    }
    if (parent.get(node) !== node) {
      parent.set(node, find(parent.get(node)!));
    }
    return parent.get(node)!;
  };

  const union = (nodeA: string, nodeB: string) => {
    const rootA = find(nodeA);
    const rootB = find(nodeB);
    if (rootA !== rootB) {
      parent.set(rootB, rootA);
    }
  };

  // Union semua node yang terhubung melalui wire
  connectionGraph.forEach((connections, node) => {
    connections.forEach((connectedNode) => {
      union(node, connectedNode);
    });
  });

  console.log(
    "🔗 [UNION-FIND] Node elektrik yang terkelompok (untuk topologi):",
    {
      totalGroups: new Set(Array.from(parent.keys()).map(find)).size,
      note: "✅ Termasuk jalur melalui saklar terbuka - ini untuk struktur, bukan listrik!",
    }
  );

  // 🔍 Deteksi percabangan (node dengan degree > 2)
  const branchNodes: string[] = [];
  connectionGraph.forEach((connections, node) => {
    if (connections.size > 2) {
      branchNodes.push(node);
    }
  });
  const hasParallelBranch = branchNodes.length > 0;

  log.section("DETEKSI PERCABANGAN");
  if (hasParallelBranch) {
    log.success(
      `Ditemukan ${branchNodes.length} branch node(s) - RANGKAIAN PARALEL`
    );
    branchNodes.forEach((node) => log.info(`Branch: ${node}`));
  } else {
    log.info("Tidak ada branch node - RANGKAIAN SERI");
  }

  // Helper: Cek apakah node adalah branch node (degree > 2)
  const isBranchNode = (nodeId: string): boolean => {
    const connections = connectionGraph.get(nodeId);
    return connections ? connections.size > 2 : false;
  };

  // 🔀 DETEKSI CABANG PARALEL - Menggunakan Posisi Y
  // Komponen di posisi Y yang sama = satu cabang (seri dalam cabang)
  // Komponen di posisi Y berbeda = cabang paralel berbeda
  const parallelGroups: string[][] = [];

  if (branchNodes.length > 0 && hasParallelBranch) {
    log.section("DETEKSI CABANG BERDASARKAN POSISI");

    const analyzedElements = [...resistiveElements, ...switches];
    const branchMap = new Map<number, string[]>();

    // Kelompokkan berdasarkan posisi Y (dengan toleransi ±10px)
    analyzedElements.forEach((el) => {
      const yPos = Math.round(el.position.y / 20) * 20; // Grid 20px

      if (!branchMap.has(yPos)) {
        branchMap.set(yPos, []);
      }
      branchMap.get(yPos)!.push(el.id);
    });

    // Convert map ke array dan sort berdasarkan posisi X
    branchMap.forEach((elementIds, yPos) => {
      if (elementIds.length > 0) {
        // Sort komponen dalam cabang berdasarkan posisi X (kiri ke kanan)
        const sortedElements = elementIds.sort((a, b) => {
          const elA = elements.find((e) => e.id === a);
          const elB = elements.find((e) => e.id === b);
          return (elA?.position.x || 0) - (elB?.position.x || 0);
        });

        parallelGroups.push(sortedElements);
        log.info(
          `Cabang Y=${yPos}: [${sortedElements
            .map((id) => id.slice(-8))
            .join(" → ")}]`
        );
      }
    });

    log.success(`Ditemukan ${parallelGroups.length} cabang berdasarkan posisi`);
  } else {
    // Tidak ada branch node - gunakan logika lama untuk paralel sederhana
    const analyzedElements = [...resistiveElements, ...switches];
    const processedElements = new Set<string>();

    analyzedElements.forEach((el) => {
      if (processedElements.has(el.id)) return;

      const group: string[] = [el.id];
      processedElements.add(el.id);

      const elNodeA = `${el.id}-a`;
      const elNodeB = `${el.id}-b`;
      const elElectricalA = find(elNodeA);
      const elElectricalB = find(elNodeB);

      analyzedElements.forEach((other) => {
        if (other.id === el.id || processedElements.has(other.id)) return;

        const otherNodeA = `${other.id}-a`;
        const otherNodeB = `${other.id}-b`;
        const otherElectricalA = find(otherNodeA);
        const otherElectricalB = find(otherNodeB);

        // Paralel sederhana: kedua terminal terhubung ke node yang sama
        if (
          elElectricalA === otherElectricalA &&
          elElectricalB === otherElectricalB
        ) {
          group.push(other.id);
          processedElements.add(other.id);
        }
      });

      if (group.length > 1) {
        parallelGroups.push(group);
      }
    });
  }

  log.section("PARALLEL GROUPS");
  if (parallelGroups.length > 0) {
    log.success(`Ditemukan ${parallelGroups.length} cabang paralel`);
    parallelGroups.forEach((group, idx) => {
      log.info(
        `Cabang ${idx + 1}: [${group.map((id) => id.slice(-8)).join(", ")}]`
      );
    });
  } else {
    log.info("Tidak ada parallel groups");
  }

  // 🎯 HITUNG TOPOLOGI LEBIH AWAL (sebelum early return)
  // Topologi ditentukan oleh STRUKTUR, bukan status saklar
  const serialElements = resistiveElements.filter(
    (el) => !parallelGroups.flat().includes(el.id)
  );

  let topologyType: "series" | "parallel" | "mixed";
  if (hasParallelBranch) {
    if (serialElements.length > 0) {
      topologyType = "mixed";
    } else {
      topologyType = "parallel";
    }
  } else if (parallelGroups.length > 0) {
    if (serialElements.length > 0) {
      topologyType = "mixed";
    } else {
      topologyType = "parallel";
    }
  } else {
    topologyType = "series";
  }

  const detectedTopology = {
    type: topologyType,
    hasParallelBranch,
    branchNodes,
  };

  log.section("TOPOLOGI RANGKAIAN");
  log.data("Tipe", topologyType.toUpperCase());
  if (topologyType === "parallel") {
    log.success("Rangkaian Paralel - setiap cabang independen");
  } else if (topologyType === "series") {
    log.info("Rangkaian Seri - semua komponen berurutan");
  } else {
    log.warning("Rangkaian Campuran - kombinasi seri dan paralel");
  }

  // 🔄 Helper: Cek apakah ada saklar terbuka pada jalur elemen tertentu
  // Improved version: check if element is in same PARALLEL BRANCH as open switch
  const hasOpenSwitchInPath = (elementIds: string[]): boolean => {
    // First check if any element in the list is itself a switch
    const switchesInGroup = switches.filter((sw) => elementIds.includes(sw.id));
    if (switchesInGroup.some((sw) => sw.state === "open")) {
      const openSwitchInGroup = switchesInGroup.find(
        (sw) => sw.state === "open"
      );
      log.error(`Elemen ${elementIds[0].slice(-8)} adalah saklar terbuka`);
      return true;
    }

    // ✅ PERBAIKAN KRUSIAL: Untuk rangkaian paralel, cek berdasarkan CABANG
    // Elemen diblokir HANYA jika saklar terbuka ada di CABANG YANG SAMA
    if (parallelGroups.length > 0) {
      for (const elemId of elementIds) {
        // Cari cabang paralel yang mengandung elemen ini
        const branchContainingElement = parallelGroups.find((group) =>
          group.includes(elemId)
        );

        if (branchContainingElement) {
          // Cek apakah ada saklar terbuka DI CABANG INI
          const openSwitchInSameBranch = switches.find(
            (sw) =>
              branchContainingElement.includes(sw.id) && sw.state === "open"
          );

          if (openSwitchInSameBranch) {
            log.error(
              `${elemId.slice(
                -8
              )}: TERBLOKIR (saklar ${openSwitchInSameBranch.id.slice(
                -8
              )} terbuka di cabang sama)`
            );
            return true;
          }

          // ✅ Saklar terbuka ada, tapi di cabang lain - jalur AMAN
          log.success(
            `${elemId.slice(-8)}: AMAN (saklar terbuka di cabang lain)`
          );
          return false;
        }
      }
    }

    // Untuk rangkaian SERI atau elemen di luar parallel groups
    // Di mode seri, saklar terbuka manapun memblokir semua
    const anyOpenSwitch = switches.find((s) => s.state === "open");
    if (anyOpenSwitch) {
      log.error(
        `SERI: TERBLOKIR (saklar ${anyOpenSwitch.id.slice(-8)} terbuka)`
      );
      return true;
    }

    log.success(`Jalur BEBAS - tidak ada saklar terbuka`);
    return false;
  };

  log.section("EVALUASI CABANG AKTIF");
  // 🔄 Filter parallel groups untuk menghapus cabang dengan saklar terbuka
  // Each parallel branch is evaluated independently
  const activeParallelGroups = parallelGroups.filter((group) => {
    // 🔧 PERBAIKAN: Cek setiap elemen dalam grup secara individual
    // Lampu/resistor dianggap aktif jika tidak ada saklar terbuka di jalurnya
    const resistiveInGroup = group.filter((id) => {
      const el = elements.find((e) => e.id === id);
      return el && (el.type === "resistor" || el.type === "lamp");
    });

    // Jika tidak ada komponen resistif, grup ini diabaikan
    if (resistiveInGroup.length === 0) {
      console.log("⚠️ Cabang paralel tidak memiliki komponen resistif:", group);
      return false;
    }

    // Cek apakah minimal 1 komponen resistif memiliki jalur tertutup
    const hasActivePath = resistiveInGroup.some(
      (id) => !hasOpenSwitchInPath([id])
    );

    if (!hasActivePath) {
      console.log(
        "⚠️ Cabang paralel dinonaktifkan (semua saklar open):",
        group
      );
      return false;
    }

    return true;
  });

  // 🔘 LOG: Active parallel groups after filtering
  console.log("🟢 === ACTIVE PARALLEL GROUPS (After Switch Filter) ===");
  console.log(`📊 Total Active Groups: ${activeParallelGroups.length}`);
  activeParallelGroups.forEach((group, index) => {
    console.log(`\n  🔹 Active Group ${index + 1}:`);
    console.log(`     Elements: [${group.join(", ")}]`);
    group.forEach((elementId) => {
      const el = elements.find((e) => e.id === elementId);
      if (el) {
        console.log(
          `     - ${elementId}: ${el.type} (${
            el.type === "resistor" || el.type === "lamp"
              ? `${el.value}Ω`
              : "non-resistive"
          })`
        );
      }
    });
  });

  if (activeParallelGroups.length === 0) {
    console.log(
      "⚠️ No active parallel groups - all branches blocked by open switches"
    );
  }
  console.log("🟢 =========================================\n");

  // 🔧 PERBAIKAN: Evaluasi setiap lampu/resistor secara individual dalam paralel
  // Alih-alih mengevaluasi per grup, evaluasi per elemen apakah jalurnya aktif
  let totalResistance = 0;
  const activeLampsInParallel: string[] = [];

  if (activeParallelGroups.length > 0) {
    console.log(
      "⚡ Parallel Mode: Mengevaluasi setiap elemen individual dalam cabang paralel..."
    );

    // Kumpulkan SEMUA lampu/resistor dari semua parallel groups
    const allParallelElements = new Set<string>();
    activeParallelGroups.forEach((group) => {
      group.forEach((id) => {
        const el = elements.find((e) => e.id === id);
        if (el && (el.type === "resistor" || el.type === "lamp")) {
          allParallelElements.add(id);
        }
      });
    });

    log.info(`Total elemen: ${allParallelElements.size}`);

    // Evaluasi setiap elemen - jika jalurnya tertutup, masuk ke perhitungan paralel
    const activeElements: string[] = [];
    allParallelElements.forEach((id) => {
      const hasBlockedPath = hasOpenSwitchInPath([id]);
      const el = resistiveElements.find((e) => e.id === id)!;

      if (!hasBlockedPath) {
        activeElements.push(id);
        if (el.type === "lamp") {
          activeLampsInParallel.push(id);
        }
        log.success(`${id.slice(-8)} (${el.type}): AKTIF - R=${el.value}Ω`);
      } else {
        log.error(`${id.slice(-8)} (${el.type}): TERBLOKIR`);
      }
    });

    // Hitung resistansi total paralel hanya dari elemen aktif
    if (activeElements.length > 0) {
      totalResistance =
        1 /
        activeElements.reduce((sum, id) => {
          const el = resistiveElements.find((e) => e.id === id)!;
          return sum + 1 / el.value;
        }, 0);
      log.section("PERHITUNGAN");
      log.success(
        `R_total = ${totalResistance.toFixed(2)}Ω (dari ${
          activeElements.length
        } elemen aktif)`
      );
    } else {
      log.warning("Tidak ada elemen aktif - semua terblokir");
      totalResistance = 0;
    }
  } else {
    log.info("Mode SERI - evaluasi elemen...");
    const activeSerialElements = resistiveElements.filter(
      (el) => !hasOpenSwitchInPath([el.id])
    );

    if (activeSerialElements.length === 0) {
      log.error("Tidak ada elemen seri aktif - arus = 0");
      return {
        current: 0,
        power: 0,
        componentCurrents: {},
        lampPowers: {},
        topology: {
          type: detectedTopology.type,
          groups: [],
          hasParallelBranch: detectedTopology.hasParallelBranch,
          branchNodes: detectedTopology.branchNodes,
        },
      };
    }

    totalResistance = activeSerialElements.reduce((sum, r) => sum + r.value, 0);
    console.log(
      `✅ Elemen seri aktif:`,
      activeSerialElements.map((e) => e.id),
      `R_total = ${totalResistance}Ω`
    );
  }

  if (totalResistance === 0) {
    return { current: 0, power: 0, componentCurrents: {}, lampPowers: {} };
  }

  const totalCurrent = totalVoltage / totalResistance;
  const totalPower = totalVoltage * totalCurrent;

  log.data("I_total", `${totalCurrent.toFixed(3)}A`);
  log.data("P_total", `${totalPower.toFixed(3)}W`);

  // Hitung arus untuk setiap komponen (hanya cabang aktif)
  const componentCurrents: Record<string, number> = {};
  const lampPowers: Record<string, number> = {};

  // Initialize all lamps with 0 power first (will be overridden for active branches)
  elements.forEach((el) => {
    if (el.type === "lamp") {
      lampPowers[el.id] = 0;
    }
  });

  if (activeParallelGroups.length > 0) {
    // Ada komponen paralel - distribusi arus berbeda (hanya elemen aktif)
    log.section("STATUS LAMPU");

    // Hitung arus dan daya untuk setiap lampu yang aktif
    activeLampsInParallel.forEach((lampId) => {
      const lamp = resistiveElements.find((e) => e.id === lampId);
      if (!lamp || lamp.type !== "lamp") return;

      // Dalam paralel: V sama untuk semua branch, I = V/R untuk masing-masing
      const lampCurrent = totalVoltage / lamp.value;
      const lampPower = lampCurrent * lampCurrent * lamp.value;

      componentCurrents[lampId] = lampCurrent;
      lampPowers[lampId] = lampPower;

      log.success(
        `💡 Lampu ${lampId.slice(-8)}: HIDUP - I=${lampCurrent.toFixed(
          3
        )}A, P=${lampPower.toFixed(2)}W`
      );
    });

    // Komponen seri mendapat total current (hanya yang aktif)
    console.log("📏 [SERIES CALC] Menghitung arus untuk elemen seri...");
    const serialElements = resistiveElements.filter(
      (el) => !parallelGroups.flat().includes(el.id)
    );
    console.log(
      "  Serial Elements:",
      serialElements.map((e) => e.id)
    );

    serialElements.forEach((el) => {
      if (hasOpenSwitchInPath([el.id])) {
        componentCurrents[el.id] = 0;
        if (el.type === "lamp") {
          lampPowers[el.id] = 0;
          console.log(
            `    💡 Lampu ${el.id}: MATI (saklar terbuka di jalurnya)`
          );
        }
        return;
      }

      componentCurrents[el.id] = totalCurrent;
      if (el.type === "lamp") {
        lampPowers[el.id] = totalCurrent * totalCurrent * el.value;
        console.log(
          `    💡 Lampu ${el.id}: NYALA - Current=${totalCurrent.toFixed(
            3
          )}A, Power=${lampPowers[el.id].toFixed(3)}W`
        );
      }
    });
  } else {
    // Semua seri - arus sama untuk semua (hanya yang aktif)
    console.log("📏 [SERIES ONLY] Semua elemen dalam rangkaian seri...");

    resistiveElements.forEach((el) => {
      if (hasOpenSwitchInPath([el.id])) {
        componentCurrents[el.id] = 0;
        if (el.type === "lamp") {
          lampPowers[el.id] = 0;
          console.log(
            `    💡 Lampu ${el.id}: MATI (saklar terbuka di jalurnya)`
          );
        }
        return;
      }

      componentCurrents[el.id] = totalCurrent;
      if (el.type === "lamp") {
        lampPowers[el.id] = totalCurrent * totalCurrent * el.value;
        console.log(
          `    💡 Lampu ${el.id}: NYALA - Current=${totalCurrent.toFixed(
            3
          )}A, Power=${lampPowers[el.id].toFixed(3)}W`
        );
      }
    });
  }

  // Set current untuk non-resistive elements
  elements.forEach((el) => {
    if (el.type === "battery" || el.type === "switch" || el.type === "wire") {
      componentCurrents[el.id] = totalCurrent;
    }
  });

  console.log("✅ [SUMMARY] Hasil Perhitungan Akhir:", {
    lampPowers,
    componentCurrents,
    totalCurrent,
    totalPower,
    activeLamps: Object.entries(lampPowers)
      .filter(([_, power]) => power > 0)
      .map(([id]) => id),
    inactiveLamps: Object.entries(lampPowers)
      .filter(([_, power]) => power === 0)
      .map(([id]) => id),
  });

  // Build topology info (gunakan activeParallelGroups)
  const topologyGroups: {
    type: "series" | "parallel";
    elements: Array<{
      id: string;
      type: string;
      voltage?: number;
      resistance?: number;
      closed?: boolean;
      isActive?: boolean; // Flag untuk menandai cabang aktif
    }>;
    current: number;
    equivalentResistance: number;
  }[] = [];

  // Add parallel groups (hanya yang aktif)
  activeParallelGroups.forEach((group) => {
    if (group.length === 0) return;

    // 🔧 Filter hanya elemen resistif untuk perhitungan resistansi
    const resistiveInGroup = group.filter((id) => {
      const el = elements.find((e) => e.id === id);
      return el && (el.type === "resistor" || el.type === "lamp");
    });

    if (resistiveInGroup.length === 0) return;

    const parallelResistance =
      1 /
      resistiveInGroup.reduce((sum, id) => {
        const el = resistiveElements.find((e) => e.id === id)!;
        return sum + 1 / el.value;
      }, 0);

    topologyGroups.push({
      type: "parallel",
      elements: group.map((id) => {
        const el = elements.find((e) => e.id === id)!;
        const isActive = !hasOpenSwitchInPath([id]);
        return {
          id: el.id,
          type: el.type,
          resistance:
            el.type === "resistor" || el.type === "lamp" ? el.value : undefined,
          voltage: el.type === "battery" ? el.value : undefined,
          closed: el.type === "switch" ? el.state === "closed" : undefined,
          isActive, // Tambahkan flag isActive
        };
      }),
      current: totalVoltage / parallelResistance,
      equivalentResistance: parallelResistance,
    });
  });

  // Add series elements (hanya yang aktif)
  // serialElements sudah dihitung di atas (line ~476)
  const activeSerialElements = serialElements.filter(
    (el) => !hasOpenSwitchInPath([el.id])
  );

  if (activeSerialElements.length > 0) {
    const seriesResistance = activeSerialElements.reduce(
      (sum, el) => sum + el.value,
      0
    );
    topologyGroups.push({
      type: "series",
      elements: activeSerialElements.map((el) => ({
        id: el.id,
        type: el.type,
        resistance: el.value,
        isActive: true,
      })),
      current: totalCurrent,
      equivalentResistance: seriesResistance,
    });
  }

  // Topology type sudah dihitung di awal (detectedTopology)
  // Gunakan nilai yang sudah ada
  console.log(
    "✅ [FINAL TOPOLOGY] Menggunakan topologi yang sudah terdeteksi:",
    {
      topologyType: detectedTopology.type,
      hasParallelBranch: detectedTopology.hasParallelBranch,
      branchNodes: detectedTopology.branchNodes,
    }
  );

  return {
    current: totalCurrent,
    power: totalPower,
    componentCurrents,
    lampPowers,
    topology: {
      type: detectedTopology.type,
      groups: topologyGroups,
      hasParallelBranch: detectedTopology.hasParallelBranch,
      branchNodes: detectedTopology.branchNodes,
    },
  };
}

// Sound Effect
function playSound(frequency: number = 800, duration: number = 50) {
  if (typeof window === "undefined") return;

  try {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration / 1000
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (e) {
    // Silently fail
  }
}

// Main Component
export default function CircuitBuilderEnhanced() {
  const isMobile = useIsMobile();
  const canvasSize = getCanvasSize(isMobile);

  // State
  const [elements, setElements] = useState<CircuitElement[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [connectMode, setConnectMode] = useState(false);
  const [pending, setPending] = useState<WireEnd | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Pos>({ x: 0, y: 0 });
  const [showStats, setShowStats] = useState(!isMobile);
  const [flowAnimation, setFlowAnimation] = useState(0);

  // 🔄 State untuk rotation drag
  const [rotationDrag, setRotationDrag] = useState<{
    elementId: string;
    startAngle: number;
    centerPos: Pos;
  } | null>(null);

  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Animation for current flow
  useEffect(() => {
    const interval = setInterval(() => {
      setFlowAnimation((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Initialize with some components
  useEffect(() => {
    if (elements.length === 0) {
      const centerX = canvasSize.width / 2;
      const centerY = canvasSize.height / 2;

      setElements([
        makeElement("battery", { x: centerX - 150, y: centerY }, isMobile),
        makeElement("lamp", { x: centerX + 150, y: centerY }, isMobile),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addComponent = (type: ComponentType) => {
    const center = {
      x: canvasSize.width / 2 + (Math.random() - 0.5) * 100,
      y: canvasSize.height / 2 + (Math.random() - 0.5) * 100,
    };
    setElements((prev) => [...prev, makeElement(type, center, isMobile)]);
    playSound(600, 50);
  };

  const resetCircuit = () => {
    setElements([]);
    setWires([]);
    setSelectedId(null);
    setPending(null);
    setConnectMode(false);
    playSound(400, 100);
  };

  const onMouseDownElement = (e: React.MouseEvent, id: string) => {
    if (connectMode) return;
    e.stopPropagation();
    const rect = canvasRef.current!.getBoundingClientRect();
    const el = elements.find((el) => el.id === id)!;
    setDragId(id);
    setDragOffset({
      x: e.clientX - rect.left - el.position.x,
      y: e.clientY - rect.top - el.position.y,
    });
    setSelectedId(id);
  };

  // 🔄 Handler untuk klik di terminal (untuk rotasi)
  const onMouseDownTerminal = (e: React.MouseEvent, elementId: string) => {
    if (connectMode) return; // Jika mode koneksi, biarkan onClick terminal yang handle
    e.stopPropagation();

    const rect = canvasRef.current!.getBoundingClientRect();
    const el = elements.find((el) => el.id === elementId)!;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setRotationDrag({
      elementId: elementId,
      startAngle: calculateAngle(el.position, { x: mouseX, y: mouseY }),
      centerPos: el.position,
    });
    setSelectedId(elementId);
    playSound(600, 30);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragId && !rotationDrag) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (rotationDrag) {
      // 🔄 ROTATION MODE
      const currentAngle = calculateAngle(rotationDrag.centerPos, {
        x: mouseX,
        y: mouseY,
      });
      const newRotation = snapToRotation(currentAngle);

      setElements((prev) =>
        prev.map((el) =>
          el.id === rotationDrag.elementId
            ? { ...el, rotation: newRotation }
            : el
        )
      );
    } else if (dragId) {
      // 📍 POSITION DRAG MODE
      const x = snapToGrid(mouseX - dragOffset.x);
      const y = snapToGrid(mouseY - dragOffset.y);

      setElements((prev) =>
        prev.map((el) =>
          el.id === dragId
            ? {
                ...el,
                position: {
                  x: Math.max(60, Math.min(canvasSize.width - 60, x)),
                  y: Math.max(60, Math.min(canvasSize.height - 60, y)),
                },
              }
            : el
        )
      );
    }
  };

  const onMouseUp = () => {
    if (dragId) {
      playSound(700, 30);
    }
    if (rotationDrag) {
      playSound(650, 40);
    }
    setDragId(null);
    setRotationDrag(null);
  };

  // 🔄 Helper functions untuk rotation
  const calculateAngle = (center: Pos, mouse: Pos): number => {
    const dx = mouse.x - center.x;
    const dy = mouse.y - center.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    // Normalize to 0-360
    if (angle < 0) angle += 360;
    return angle;
  };

  const snapToRotation = (angle: number): 0 | 90 | 180 | 270 => {
    // Snap ke 0, 90, 180, 270
    if (angle >= 315 || angle < 45) return 0;
    if (angle >= 45 && angle < 135) return 90;
    if (angle >= 135 && angle < 225) return 180;
    return 270;
  };

  const rotateSelected = () => {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedId
          ? {
              ...el,
              rotation: ((el.rotation + 90) % 360) as 0 | 90 | 180 | 270,
            }
          : el
      )
    );
    playSound(650, 40);
  };

  const toggleSwitch = (id: string) => {
    const element = elements.find((e) => e.id === id);
    if (!element) return;

    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? { ...el, state: el.state === "open" ? "closed" : "open" }
          : el
      )
    );
    playSound(element.state === "open" ? 900 : 600, 80);
  };

  const deleteSelected = () => {
    if (!selectedId) return;

    // Hapus old-style wires yang terhubung
    setWires((prev) =>
      prev.filter(
        (w) => w.from.elementId !== selectedId && w.to.elementId !== selectedId
      )
    );

    // Hapus koneksi dari wire elements yang terhubung ke komponen ini
    setElements((prev) =>
      prev
        .map((el) => {
          if (el.type === "wire" && el.connectedTo) {
            const newConnectedTo = { ...el.connectedTo };
            if (newConnectedTo.a?.elementId === selectedId) {
              delete newConnectedTo.a;
            }
            if (newConnectedTo.b?.elementId === selectedId) {
              delete newConnectedTo.b;
            }
            return { ...el, connectedTo: newConnectedTo };
          }
          return el;
        })
        .filter((el) => el.id !== selectedId)
    );

    setSelectedId(null);
    playSound(300, 100);
  };

  const onClickTerminal = (elId: string, termId: Terminal["id"]) => {
    if (!connectMode) return;

    const element = elements.find((e) => e.id === elId);
    if (!element) return;

    // Jika yang diklik adalah wire element
    if (element.type === "wire") {
      if (!pending) {
        // Set wire terminal sebagai pending
        setPending({ elementId: elId, terminalId: termId });
        playSound(800, 30);
      } else {
        // Hubungkan wire ke komponen lain
        setElements((prev) =>
          prev.map((el) => {
            if (el.id === elId) {
              // Update wire connection
              return {
                ...el,
                connectedTo: {
                  ...el.connectedTo,
                  [termId]: {
                    elementId: pending.elementId,
                    terminalId: pending.terminalId,
                  },
                },
              };
            } else if (el.id === pending.elementId && el.type === "wire") {
              // Jika pending juga wire, update kedua ujungnya
              return {
                ...el,
                connectedTo: {
                  ...el.connectedTo,
                  [pending.terminalId]: {
                    elementId: elId,
                    terminalId: termId,
                  },
                },
              };
            }
            return el;
          })
        );
        setPending(null);
        playSound(1000, 60);
      }
      return;
    }

    // Untuk komponen biasa (battery, resistor, lamp, switch)
    if (!pending) {
      setPending({ elementId: elId, terminalId: termId });
      playSound(800, 30);
      return;
    }

    const pendingElement = elements.find((e) => e.id === pending.elementId);

    // Jika pending adalah wire, hubungkan wire ke komponen ini
    if (pendingElement?.type === "wire") {
      setElements((prev) =>
        prev.map((el) => {
          if (el.id === pending.elementId) {
            return {
              ...el,
              connectedTo: {
                ...el.connectedTo,
                [pending.terminalId]: {
                  elementId: elId,
                  terminalId: termId,
                },
              },
            };
          }
          return el;
        })
      );
      setPending(null);
      playSound(1000, 60);
      return;
    }

    // Koneksi direct antar komponen (old way - deprecated)
    if (pending.elementId === elId && pending.terminalId === termId) {
      setPending(null);
      return;
    }

    const id = `wire_${Date.now()}`;
    setWires((prev) => [
      ...prev,
      { id, from: pending, to: { elementId: elId, terminalId: termId } },
    ]);
    setPending(null);
    playSound(1000, 60);
  };

  // Circuit analysis
  const analysis = useMemo(
    () => analyzeCircuit(elements, wires),
    [elements, wires]
  );

  const calc = useMemo(() => {
    const flow = calculateCurrentFlow(elements, wires);
    const circuitAnalysis = analyzeCircuit(elements, wires);

    // Hitung totalR yang benar dari flow calculation
    const resistiveElements = elements.filter(
      (e) => e.type === "resistor" || e.type === "lamp"
    );

    let calculatedTotalR = 0;
    if (flow && flow.current > 0 && circuitAnalysis.isClosed) {
      const totalV = elements
        .filter((e) => e.type === "battery")
        .reduce((s, b) => s + b.value, 0);
      calculatedTotalR = totalV / flow.current;
    } else {
      // Fallback ke simple sum jika tidak ada current
      calculatedTotalR = resistiveElements.reduce((s, r) => s + r.value, 0);
    }

    return {
      ...flow,
      ...circuitAnalysis,
      totalV: elements
        .filter((e) => e.type === "battery")
        .reduce((s, b) => s + b.value, 0),
      totalR: calculatedTotalR, // Gunakan hasil perhitungan yang benar
      topology: flow?.topology, // Tambahkan topology info
    };
  }, [elements, wires]);

  // 🔋 Fungsi untuk menentukan arah aliran elektron
  // Arus mengalir dari kutub POSITIF (+) ke NEGATIF (-)
  const determineFlowDirection = (w: Wire): boolean => {
    const fromEl = elements.find((e) => e.id === w.from.elementId);
    const toEl = elements.find((e) => e.id === w.to.elementId);

    if (!fromEl || !toEl) return false;

    // Untuk baterai, tentukan kutub positif dan negatif berdasarkan rotasi
    const getPositiveTerminal = (battery: CircuitElement): "a" | "b" => {
      // Rotasi 0°: positif di kanan (terminal b)
      // Rotasi 90°: positif di bawah (terminal b)
      // Rotasi 180°: positif di kiri (terminal a)
      // Rotasi 270°: positif di atas (terminal a)
      if (battery.rotation === 0 || battery.rotation === 90) {
        return "b";
      } else {
        return "a";
      }
    };

    // Jika from adalah baterai
    if (fromEl.type === "battery") {
      const posTerminal = getPositiveTerminal(fromEl);
      // Jika wire dimulai dari terminal positif, aliran normal (forward)
      return w.from.terminalId === posTerminal;
    }

    // Jika to adalah baterai
    if (toEl.type === "battery") {
      const posTerminal = getPositiveTerminal(toEl);
      // Jika wire menuju terminal negatif, aliran normal (forward)
      return w.to.terminalId !== posTerminal;
    }

    // Default: aliran forward
    return false;
  };

  // Render Bezier Wire
  const renderWire = (w: Wire) => {
    const fromEl = elements.find((e) => e.id === w.from.elementId);
    const toEl = elements.find((e) => e.id === w.to.elementId);
    if (!fromEl || !toEl) return null;

    const a = terminalAbsPos(fromEl, w.from.terminalId);
    const b = terminalAbsPos(toEl, w.to.terminalId);

    // 🔋 Tentukan arah aliran
    const flowForward = determineFlowDirection(w);

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Bezier control points for smooth curves
    const controlOffset = Math.min(distance * 0.3, 80);
    const cx1 = a.x + (dx > 0 ? controlOffset : -controlOffset);
    const cy1 = a.y;
    const cx2 = b.x - (dx > 0 ? controlOffset : -controlOffset);
    const cy2 = b.y;

    const path = `M ${a.x} ${a.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${b.x} ${b.y}`;

    const isActive =
      selectedId &&
      (w.from.elementId === selectedId || w.to.elementId === selectedId);

    const hasCurrent = calc.current > 0 && !calc.hasOpenSwitch && calc.isClosed;

    return (
      <g key={w.id}>
        {/* Wire shadow */}
        <path
          d={path}
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth={isMobile ? 5 : 7}
          fill="none"
          transform="translate(2, 2)"
        />
        {/* Main wire */}
        <path
          d={path}
          stroke={isActive ? "#3b82f6" : hasCurrent ? "#06b6d4" : "#475569"}
          strokeWidth={isMobile ? 4 : 6}
          fill="none"
          className="transition-all duration-200"
          style={{
            filter: hasCurrent
              ? "drop-shadow(0 0 4px rgba(6, 182, 212, 0.6))"
              : "none",
          }}
        />
        {/* Current flow animation */}
        {hasCurrent && (
          <>
            <path
              d={path}
              stroke="#fbbf24"
              strokeWidth={isMobile ? 2 : 3}
              fill="none"
              strokeDasharray="10 10"
              strokeDashoffset={flowAnimation}
              className="opacity-80"
              style={{
                filter: "drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))",
              }}
            />
            {/* Electron particles */}
            {[0, 33, 66].map((offset) => {
              // 🔋 Balik arah jika flowForward = false (dari negatif ke positif)
              const rawProgress = ((flowAnimation + offset) % 100) / 100;
              const progress = flowForward ? rawProgress : 1 - rawProgress;

              const point = getPointOnBezier(
                a,
                { x: cx1, y: cy1 },
                { x: cx2, y: cy2 },
                b,
                progress
              );

              return (
                <circle
                  key={offset}
                  cx={point.x}
                  cy={point.y}
                  r={isMobile ? 2.5 : 3}
                  fill="#fbbf24"
                  className="opacity-90"
                  style={{
                    filter: "drop-shadow(0 0 3px rgba(251, 191, 36, 1))",
                  }}
                />
              );
            })}
          </>
        )}
      </g>
    );
  };

  // Get point on Bezier curve
  const getPointOnBezier = (
    p0: Pos,
    p1: Pos,
    p2: Pos,
    p3: Pos,
    t: number
  ): Pos => {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
    const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

    return { x, y };
  };

  // Render wire element connections (new system)
  const renderWireElementConnections = () => {
    return elements
      .filter((el) => el.type === "wire" && el.connectedTo)
      .map((wireEl) => {
        const connA = wireEl.connectedTo?.a;
        const connB = wireEl.connectedTo?.b;

        if (!connA || !connB) return null;

        const fromEl = elements.find((e) => e.id === connA.elementId);
        const toEl = elements.find((e) => e.id === connB.elementId);

        if (!fromEl || !toEl) return null;

        // Get wire terminal positions
        const wireTermA = terminalAbsPos(wireEl, "a");
        const wireTermB = terminalAbsPos(wireEl, "b");

        // Get component terminal positions
        const compTermA = terminalAbsPos(fromEl, connA.terminalId);
        const compTermB = terminalAbsPos(toEl, connB.terminalId);

        const hasCurrent =
          calc.current > 0 && !calc.hasOpenSwitch && calc.isClosed;

        // 🔋 Tentukan arah aliran untuk setiap koneksi
        const flowDirectionA = determineWireElementFlowDirection(
          fromEl,
          connA.terminalId,
          wireEl,
          "a"
        );
        const flowDirectionB = determineWireElementFlowDirection(
          toEl,
          connB.terminalId,
          wireEl,
          "b"
        );

        // Render two connections: wireA -> compA and wireB -> compB
        return (
          <g key={`wire-conn-${wireEl.id}`}>
            {/* Connection from wire terminal A to component A */}
            {renderSingleConnection(
              wireTermA,
              compTermA,
              hasCurrent,
              `${wireEl.id}-a`,
              flowDirectionA
            )}
            {/* Connection from wire terminal B to component B */}
            {renderSingleConnection(
              wireTermB,
              compTermB,
              hasCurrent,
              `${wireEl.id}-b`,
              flowDirectionB
            )}
          </g>
        );
      });
  };

  // 🔋 Fungsi untuk menentukan arah aliran pada wire element connections
  const determineWireElementFlowDirection = (
    component: CircuitElement,
    compTerminal: "a" | "b",
    wireEl: CircuitElement,
    wireTerminal: "a" | "b"
  ): boolean => {
    if (component.type === "battery") {
      const getPositiveTerminal = (battery: CircuitElement): "a" | "b" => {
        if (battery.rotation === 0 || battery.rotation === 90) {
          return "b";
        } else {
          return "a";
        }
      };

      const posTerminal = getPositiveTerminal(component);
      // Jika komponen terminal adalah positif, aliran keluar dari baterai (forward dari wire ke component)
      return compTerminal === posTerminal;
    }

    // Default: aliran forward
    return false;
  };

  // Helper to render single connection line
  const renderSingleConnection = (
    from: Pos,
    to: Pos,
    hasCurrent: boolean,
    key: string,
    flowForward: boolean = false
  ) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const controlOffset = Math.min(distance * 0.3, 80);
    const cx1 = from.x + (dx > 0 ? controlOffset : -controlOffset);
    const cy1 = from.y;
    const cx2 = to.x - (dx > 0 ? controlOffset : -controlOffset);
    const cy2 = to.y;

    const path = `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;

    return (
      <g key={key}>
        {/* Shadow */}
        <path
          d={path}
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth={isMobile ? 5 : 7}
          fill="none"
          transform="translate(2, 2)"
        />
        {/* Main wire */}
        <path
          d={path}
          stroke={hasCurrent ? "#06b6d4" : "#475569"}
          strokeWidth={isMobile ? 4 : 6}
          fill="none"
          className="transition-all duration-200"
          style={{
            filter: hasCurrent
              ? "drop-shadow(0 0 4px rgba(6, 182, 212, 0.6))"
              : "none",
          }}
        />
        {/* Current animation */}
        {hasCurrent && (
          <>
            <path
              d={path}
              stroke="#fbbf24"
              strokeWidth={isMobile ? 2 : 3}
              fill="none"
              strokeDasharray="10 10"
              strokeDashoffset={flowAnimation}
              className="opacity-80"
              style={{
                filter: "drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))",
              }}
            />
            {/* Electron particles */}
            {[0, 50].map((offset) => {
              // 🔋 Balik arah jika flowForward = false
              const rawProgress = ((flowAnimation + offset) % 100) / 100;
              const progress = flowForward ? rawProgress : 1 - rawProgress;

              const point = getPointOnBezier(
                from,
                { x: cx1, y: cy1 },
                { x: cx2, y: cy2 },
                to,
                progress
              );

              return (
                <circle
                  key={offset}
                  cx={point.x}
                  cy={point.y}
                  r={isMobile ? 2.5 : 3}
                  fill="#fbbf24"
                  className="opacity-90"
                  style={{
                    filter: "drop-shadow(0 0 3px rgba(251, 191, 36, 1))",
                  }}
                />
              );
            })}
          </>
        )}
      </g>
    );
  };

  // Render realistic components
  const renderElement = (el: CircuitElement) => {
    const isSel = selectedId === el.id;
    const fontSize = isMobile ? 10 : 12;
    const terminalOffset = isMobile ? 37 : 52;
    const terminalRadius = isSel ? (isMobile ? 6 : 8) : isMobile ? 5 : 6;

    const renderBody = () => {
      switch (el.type) {
        case "battery": {
          // Realistic battery with terminals
          return (
            <g>
              {/* Battery body */}
              <rect
                x={-25}
                y={-18}
                width={50}
                height={36}
                rx={4}
                fill="url(#batteryGradient)"
                stroke={isSel ? "#eab308" : "#d97706"}
                strokeWidth={2}
              />
              {/* + terminal */}
              <line
                x1={15}
                y1={-8}
                x2={15}
                y2={8}
                stroke="#d3d3d3"
                strokeWidth={3}
              />
              <line
                x1={7}
                y1={0}
                x2={23}
                y2={0}
                stroke="#d3d3d3"
                strokeWidth={3}
              />
              {/* - terminal */}
              <line
                x1={-15}
                y1={0}
                x2={-7}
                y2={0}
                stroke="#374151"
                strokeWidth={3}
              />
              {/* Wires from terminals */}
              <line
                x1={-terminalOffset}
                y1={0}
                x2={-25}
                y2={0}
                stroke="#d3d3d3"
                strokeWidth={3}
              />
              <line
                x1={25}
                y1={0}
                x2={terminalOffset}
                y2={0}
                stroke="#d3d3d3"
                strokeWidth={3}
              />
              {/* Label */}
              <text
                x={0}
                y={-25}
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight="bold"
                fill={isSel ? "#eab308" : "#374151"}
              >
                🔋 {el.value}V
              </text>
            </g>
          );
        }

        case "resistor": {
          // Realistic resistor with color bands
          return (
            <g>
              {/* Wires */}
              <line
                x1={-terminalOffset}
                y1={0}
                x2={-20}
                y2={0}
                stroke="#d3d3d3"
                strokeWidth={3}
              />
              <line
                x1={20}
                y1={0}
                x2={terminalOffset}
                y2={0}
                stroke="#d3d3d3"
                strokeWidth={3}
              />
              {/* Resistor body */}
              <rect
                x={-20}
                y={-10}
                width={40}
                height={20}
                rx={2}
                fill="#fef3c7"
                stroke={isSel ? "#dc2626" : "#92400e"}
                strokeWidth={2}
              />
              {/* Color bands */}
              <rect x={-12} y={-10} width={3} height={20} fill="#92400e" />
              <rect x={-4} y={-10} width={3} height={20} fill="#000000" />
              <rect x={4} y={-10} width={3} height={20} fill="#dc2626" />
              <rect x={12} y={-10} width={3} height={20} fill="#f59e0b" />
              {/* Label */}
              <text
                x={0}
                y={-18}
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight="bold"
                fill={isSel ? "#dc2626" : "#374151"}
              >
                🔌 {el.value}Ω
              </text>

              {/* Resistor tooltip removed per user request */}
            </g>
          );
        }

        case "lamp": {
          const lampPower =
            (calc.lampPowers as Record<string, number>)?.[el.id] || 0;
          // Lampu hanya menyala jika rangkaian tertutup DAN ada arus yang mengalir
          const isOn = calc.isClosed && calc.current > 0 && lampPower > 0.1;

          // 🔆 BRIGHTNESS CALCULATION (considers resistors effect)
          let brightness = 1; // Default 100%

          if (
            calc.topology?.type === "series" ||
            !calc.topology?.hasParallelBranch
          ) {
            // SERIES: Brightness affected by total resistance including resistors
            const totalBatteries = elements.filter(
              (e) => e.type === "battery"
            ).length;
            const totalLamps = elements.filter((e) => e.type === "lamp").length;
            const totalResistors = elements.filter(
              (e) => e.type === "resistor"
            ).length;

            if (totalLamps > 0) {
              // Calculate ideal current (without resistors)
              const V_battery = 12; // Volts per battery
              const R_lamp = el.value || 50; // Ohms
              const totalVoltage = totalBatteries * V_battery;

              // Total resistance in series
              const R_battery_internal = 1; // Internal resistance per battery
              const R_resistors = totalResistors * 100; // Each resistor = 100Ω
              const R_lamps = totalLamps * R_lamp;
              const R_total =
                totalBatteries * R_battery_internal + R_lamps + R_resistors;

              // Actual current with resistors
              const I_actual = R_total > 0 ? totalVoltage / R_total : 0;

              // Ideal current (without resistors, only lamps and batteries)
              const R_ideal = totalBatteries * R_battery_internal + R_lamps;
              const I_ideal = R_ideal > 0 ? totalVoltage / R_ideal : 0;

              // Brightness = (Actual Power) / (Ideal Power)
              // P = I² × R, so brightness = (I_actual² × R) / (I_ideal² × R) = (I_actual / I_ideal)²
              if (I_ideal > 0) {
                const currentRatio = I_actual / I_ideal;
                brightness = Math.min(1, currentRatio * currentRatio); // Power ratio
              } else {
                brightness = 0;
              }
            }
          } else {
            // PARALLEL: Brightness based on actual power vs ideal power
            const idealPower =
              ((calc.totalV || 0) * (calc.totalV || 0)) / el.value;
            if (idealPower > 0) {
              brightness = Math.min(1, lampPower / idealPower);
            }
          }

          return (
            <g>
              {/* Wires */}
              <line
                x1={-terminalOffset}
                y1={0}
                x2={-20}
                y2={0}
                stroke="#d3d3d3"
                strokeWidth={3}
              />
              <line
                x1={20}
                y1={0}
                x2={terminalOffset}
                y2={0}
                stroke="#d3d3d3"
                strokeWidth={3}
              />

              {/* Glow effect when ON */}
              {isOn && (
                <>
                  <circle
                    r={35}
                    fill={`rgba(254, 240, 138, ${0.3 * brightness})`}
                    className="animate-pulse"
                  />
                  <circle
                    r={25}
                    fill={`rgba(253, 224, 71, ${0.5 * brightness})`}
                    className="animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                </>
              )}

              {/* Bulb - opacity based on brightness */}
              <circle
                r={18}
                fill={
                  isOn
                    ? `rgba(254, 243, 199, ${0.5 + 0.5 * brightness})`
                    : "#e5e7eb"
                }
                stroke={isSel ? "#eab308" : isOn ? "#fbbf24" : "#9ca3af"}
                strokeWidth={2}
                style={{
                  filter: isOn
                    ? `drop-shadow(0 0 ${
                        8 + 12 * brightness
                      }px rgba(251, 191, 36, ${brightness}))`
                    : "none",
                }}
              />

              {/* Filament - brightness affects color intensity */}
              {isOn ? (
                <path
                  d="M -6 -6 Q 0 -8 6 -6 Q 0 -4 -6 -6 M -6 0 Q 0 2 6 0 Q 0 4 -6 0 M -6 6 Q 0 8 6 6 Q 0 10 -6 6"
                  stroke={`rgba(251, 191, 36, ${brightness})`}
                  strokeWidth={2}
                  fill="none"
                  className="animate-pulse"
                  style={{
                    opacity: brightness,
                  }}
                />
              ) : (
                <path
                  d="M -6 -6 Q 0 -8 6 -6 M -6 0 Q 0 2 6 0 M -6 6 Q 0 8 6 6"
                  stroke="#6b7280"
                  strokeWidth={1.5}
                  fill="none"
                />
              )}

              {/* Base */}
              <rect
                x={-8}
                y={18}
                width={16}
                height={8}
                rx={1}
                fill={isSel ? "#d97706" : "#78716c"}
                stroke="#57534e"
                strokeWidth={1}
              />

              {/* Label */}
              <text
                x={0}
                y={-30}
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight="bold"
                fill={isOn ? "#eab308" : isSel ? "#3b82f6" : "#374151"}
              >
                💡 {isOn ? "ON" : "OFF"}
              </text>
              <text
                x={0}
                y={40}
                textAnchor="middle"
                fontSize={fontSize - 2}
                fill="#6b7280"
              >
                {lampPower > 0 ? `${lampPower.toFixed(2)}W` : ""}
              </text>
            </g>
          );
        }

        case "switch": {
          const isOpen = el.state === "open";

          return (
            <g
              onDoubleClick={(e) => {
                e.stopPropagation();
                toggleSwitch(el.id);
              }}
              className="cursor-pointer"
            >
              {/* Wires */}
              <line
                x1={-terminalOffset}
                y1={0}
                x2={-15}
                y2={0}
                stroke="#d3d3d3"
                strokeWidth={3}
              />
              <line
                x1={15}
                y1={0}
                x2={terminalOffset}
                y2={0}
                stroke="#d3d3d3"
                strokeWidth={3}
              />

              {/* Contact points */}
              <circle
                cx={-15}
                cy={0}
                r={4}
                fill="#374151"
                stroke="#000"
                strokeWidth={1}
              />
              <circle
                cx={15}
                cy={0}
                r={4}
                fill="#374151"
                stroke="#000"
                strokeWidth={1}
              />

              {/* Switch lever */}
              {isOpen ? (
                <line
                  x1={-15}
                  y1={0}
                  x2={10}
                  y2={-15}
                  stroke="#ef4444"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              ) : (
                <line
                  x1={-15}
                  y1={0}
                  x2={15}
                  y2={0}
                  stroke="#10b981"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              )}

              {/* Switch base */}
              <rect
                x={-20}
                y={-4}
                width={40}
                height={8}
                rx={2}
                fill={isSel ? "#e5e7eb" : "#f3f4f6"}
                stroke="#9ca3af"
                strokeWidth={1}
                opacity={0.5}
              />

              {/* Label */}
              <text
                x={0}
                y={-25}
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight="bold"
                fill={isOpen ? "#ef4444" : "#10b981"}
              >
                ⚡ {isOpen ? "OPEN" : "CLOSED"}
              </text>
              <text
                x={0}
                y={25}
                textAnchor="middle"
                fontSize={fontSize - 2}
                fill="#ffffff"
              >
                (double-click)
              </text>
            </g>
          );
        }

        case "wire": {
          // Wire sebagai komponen
          const connA = el.connectedTo?.a;
          const connB = el.connectedTo?.b;

          const wireLength = terminalOffset * 2;

          return (
            <g>
              {/* Wire body - thick cable */}
              <line
                x1={-terminalOffset}
                y1={0}
                x2={terminalOffset}
                y2={0}
                stroke="#d3d3d3"
                strokeWidth={isMobile ? 4 : 6}
                strokeLinecap="round"
              />

              {/* Connection indicators */}
              {connA && (
                <circle
                  cx={-terminalOffset}
                  cy={0}
                  r={8}
                  fill="#10b981"
                  opacity={0.6}
                  className="animate-pulse"
                />
              )}
              {connB && (
                <circle
                  cx={terminalOffset}
                  cy={0}
                  r={8}
                  fill="#10b981"
                  opacity={0.6}
                  className="animate-pulse"
                />
              )}

              {/* Label */}
              <text
                x={0}
                y={-18}
                textAnchor="middle"
                fontSize={fontSize}
                fontWeight="bold"
                fill={isSel ? "#3b82f6" : "#6b7280"}
              >
                🧵 Kabel
              </text>

              {/* Connection status */}
              <text
                x={0}
                y={25}
                textAnchor="middle"
                fontSize={fontSize - 2}
                fill={connA && connB ? "#10b981" : "#f59e0b"}
              >
                {connA && connB
                  ? "Terhubung"
                  : connA || connB
                  ? "Sebagian"
                  : "Belum"}
              </text>
            </g>
          );
        }
      }
    };

    return (
      <g
        key={el.id}
        transform={`translate(${el.position.x}, ${el.position.y}) rotate(${el.rotation})`}
        onMouseDown={(e) => onMouseDownElement(e, el.id)}
        onClick={() => setSelectedId(el.id)}
        className="cursor-move transition-all duration-200"
        style={{
          filter:
            dragId === el.id
              ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
              : "none",
        }}
      >
        {/* Selection indicator */}
        {isSel && (
          <rect
            x={-45}
            y={-35}
            width={90}
            height={70}
            rx={8}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={3}
            strokeDasharray="8 4"
            className="animate-pulse"
          />
        )}

        {renderBody()}

        {/* Terminals */}
        <circle
          cx={-terminalOffset}
          cy={0}
          r={terminalRadius}
          fill={
            rotationDrag?.elementId === el.id
              ? "#a855f7"
              : connectMode || isSel
              ? "#3b82f6"
              : "#6b7280"
          }
          stroke={
            rotationDrag?.elementId === el.id
              ? "#7c3aed"
              : connectMode || isSel
              ? "#1e40af"
              : "#374151"
          }
          strokeWidth={2}
          onMouseDown={(e) => {
            if (!connectMode) {
              onMouseDownTerminal(e, el.id);
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (connectMode) {
              onClickTerminal(el.id, "a");
            }
          }}
          className={`cursor-pointer transition-all duration-150 hover:scale-125 ${
            rotationDrag?.elementId === el.id ? "animate-pulse" : ""
          }`}
        />
        <circle
          cx={terminalOffset}
          cy={0}
          r={terminalRadius}
          fill={
            rotationDrag?.elementId === el.id
              ? "#a855f7"
              : connectMode || isSel
              ? "#3b82f6"
              : "#6b7280"
          }
          stroke={
            rotationDrag?.elementId === el.id
              ? "#7c3aed"
              : connectMode || isSel
              ? "#1e40af"
              : "#374151"
          }
          strokeWidth={2}
          onMouseDown={(e) => {
            if (!connectMode) {
              onMouseDownTerminal(e, el.id);
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (connectMode) {
              onClickTerminal(el.id, "b");
            }
          }}
          className={`cursor-pointer transition-all duration-150 hover:scale-125 ${
            rotationDrag?.elementId === el.id ? "animate-pulse" : ""
          }`}
        />

        {/* Terminal indicators when in connect mode */}
        {connectMode && pending && pending.elementId === el.id && (
          <text
            x={pending.terminalId === "a" ? -terminalOffset : terminalOffset}
            y={-25}
            textAnchor="middle"
            fontSize={10}
            fill="#3b82f6"
            fontWeight="bold"
          >
            ●
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="relative">
      {/* SVG Gradients Definition */}
      <svg width={0} height={0} className="absolute">
        <defs>
          <linearGradient
            id="batteryGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-4 sm:p-6 border-2 border-slate-700">
        {/* Toolbar */}
        <div className="mb-6 space-y-3">
          {/* Component Buttons */}
          <div className="flex flex-wrap gap-2">
            <div className="text-sm font-bold text-blue-200 mr-2 flex items-center">
              Komponen:
            </div>
            <button
              onClick={() => addComponent("battery")}
              className="px-3 py-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm"
            >
              🔋 Baterai
            </button>
            <button
              onClick={() => addComponent("lamp")}
              className="px-3 py-2 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm"
            >
              💡 Lampu
            </button>
            <button
              onClick={() => addComponent("resistor")}
              className="px-3 py-2 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm"
            >
              🔌 Resistor
            </button>
            <button
              onClick={() => addComponent("switch")}
              className="px-3 py-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm"
            >
              ⚡ Saklar
            </button>
            <button
              onClick={() => addComponent("wire")}
              className="px-3 py-2 rounded-xl bg-gradient-to-br from-slate-600 to-gray-700 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm"
            >
              🧵 Kabel
            </button>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setConnectMode(!connectMode);
                if (connectMode) setPending(null);
                playSound(connectMode ? 600 : 900, 50);
              }}
              className={`px-3 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-sm ${
                connectMode
                  ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white scale-105"
                  : "bg-slate-700 text-blue-300 border-2 border-blue-500/30 hover:bg-slate-600"
              }`}
            >
              {connectMode ? "✓ Mode Koneksi ON" : "🔗 Mode Koneksi"}
            </button>
            <button
              onClick={rotateSelected}
              disabled={!selectedId}
              className="px-3 py-2 rounded-xl bg-slate-700 text-slate-200 border-2 border-slate-500/30 font-medium shadow-lg hover:shadow-xl hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 text-sm"
            >
              ↻ Rotasi
            </button>
            <button
              onClick={deleteSelected}
              disabled={!selectedId}
              className="px-3 py-2 rounded-xl bg-slate-700 text-red-400 border-2 border-red-500/30 font-medium shadow-lg hover:shadow-xl hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 text-sm"
            >
              🗑️ Hapus
            </button>
            <button
              onClick={resetCircuit}
              className="px-3 py-2 rounded-xl bg-slate-700 text-orange-400 border-2 border-orange-500/30 font-medium shadow-lg hover:shadow-xl hover:bg-slate-600 transition-all duration-200 text-sm"
            >
              ↺ Reset
            </button>
            {isMobile && (
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-3 py-2 rounded-xl bg-slate-700 text-slate-200 border-2 border-slate-500/30 font-medium shadow-lg hover:shadow-xl hover:bg-slate-600 transition-all duration-200 text-sm"
              >
                📊 Stats
              </button>
            )}
          </div>
        </div>

        {/* Notifikasi Status Rangkaian - Hanya tampil jika belum terhubung */}
        {showStats && !calc.isConnected && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-300 shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="text-sm font-bold text-yellow-900">
                  Rangkaian Belum Terhubung
                </div>
                <div className="text-xs text-yellow-700 mt-1">
                  • Komponen belum terhubung dengan benar
                </div>
                <div className="text-xs text-yellow-600 mt-2">
                  💡 Hubungkan semua komponen menggunakan kabel untuk mendeteksi
                  topologi rangkaian
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Circuit Stats - Hanya tampil jika rangkaian tertutup */}
        {showStats && calc.isClosed && calc.isConnected && (
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border-2 border-amber-200 shadow-md">
              <div className="text-xs text-amber-700 font-medium mb-1">
                Tegangan
              </div>
              <div className="text-lg font-bold text-amber-900">
                {calc.totalV.toFixed(1)} V
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-3 border-2 border-red-200 shadow-md">
              <div className="text-xs text-red-700 font-medium mb-1">
                Hambatan
              </div>
              <div className="text-lg font-bold text-red-900">
                {calc.totalR.toFixed(1)} Ω
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border-2 border-blue-200 shadow-md">
              <div className="text-xs text-blue-700 font-medium mb-1">Arus</div>
              <div className="text-lg font-bold text-blue-900">
                {calc.current.toFixed(3)} A
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-3 border-2 border-purple-200 shadow-md">
              <div className="text-xs text-purple-700 font-medium mb-1">
                Daya
              </div>
              <div className="text-lg font-bold text-purple-900">
                {calc.power.toFixed(2)} W
              </div>
            </div>
          </div>
        )}

        {/* Topology Detection Display - Tampil jika rangkaian terhubung (terlepas dari saklar) */}
        {showStats && calc.isConnected && calc.topology && (
          <div className="mb-6 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-4 border-2 border-emerald-500/30 shadow-lg">
            {/* Status Badge - Rangkaian Aktif (tertutup & arus mengalir) */}
            {calc.isClosed && calc.current > 0 && (
              <div className="mb-3 p-2 bg-green-900/30 border-2 border-green-500/40 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-green-300">
                      Rangkaian Aktif - Arus Mengalir
                    </div>
                    <div className="text-xs text-green-400 mt-0.5">
                      Topologi terdeteksi dan semua saklar tertutup
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status Badge - Terhubung tapi saklar terbuka */}
            {!calc.isClosed && (
              <div className="mb-3 p-2 bg-orange-900/30 border-2 border-orange-500/40 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-orange-300">
                      Topologi Terdeteksi - Rangkaian Terbuka
                    </div>
                    <div className="text-xs text-orange-400 mt-0.5">
                      Struktur rangkaian sudah teridentifikasi, tapi arus tidak
                      mengalir karena saklar terbuka
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resistor Effect Warning */}
            {(() => {
              const resistorCount = elements.filter(
                (e) => e.type === "resistor"
              ).length;
              const lampCount = elements.filter(
                (e) => e.type === "lamp"
              ).length;
              const isSeries =
                calc.topology.type === "series" ||
                !calc.topology.hasParallelBranch;

              if (
                resistorCount > 0 &&
                lampCount > 0 &&
                isSeries &&
                calc.isConnected
              ) {
                // Calculate brightness reduction
                const totalBatteries = elements.filter(
                  (e) => e.type === "battery"
                ).length;
                const V_battery = 12;
                const R_lamp = 50;
                const totalVoltage = totalBatteries * V_battery;
                const R_battery_internal = 1;
                const R_resistors = resistorCount * 100;
                const R_lamps = lampCount * R_lamp;
                const R_total =
                  totalBatteries * R_battery_internal + R_lamps + R_resistors;
                const R_ideal = totalBatteries * R_battery_internal + R_lamps;

                const I_actual = R_total > 0 ? totalVoltage / R_total : 0;
                const I_ideal = R_ideal > 0 ? totalVoltage / R_ideal : 0;
                const brightnessPercent =
                  I_ideal > 0
                    ? Math.round(
                        (I_actual / I_ideal) * (I_actual / I_ideal) * 100
                      )
                    : 0;

                return (
                  <div className="mb-3 p-3 bg-orange-900/30 border-2 border-orange-400/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">⚠️</span>
                      <div className="text-sm font-bold text-orange-300">
                        Resistor Mengurangi Kecerahan Lampu!
                      </div>
                    </div>
                    <div className="text-xs space-y-1 pl-7 text-orange-200">
                      <div>
                        • Resistor: {resistorCount} × 100Ω ={" "}
                        {resistorCount * 100}Ω
                      </div>
                      <div>
                        • Hambatan Total: {R_total.toFixed(1)}Ω (tanpa resistor:{" "}
                        {R_ideal.toFixed(1)}Ω)
                      </div>
                      <div>
                        • Arus: {I_actual.toFixed(3)}A → {I_ideal.toFixed(3)}A
                        (↓{((1 - I_actual / I_ideal) * 100).toFixed(1)}%)
                      </div>
                      <div className="text-yellow-300 font-bold pt-1">
                        💡 Brightness: {brightnessPercent}% dari maksimal
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex items-center gap-2 mb-3">
              <div className="text-2xl">
                {calc.topology.type === "series" && "📏"}
                {calc.topology.type === "parallel" && "🔀"}
                {calc.topology.type === "mixed" && "🔄"}
              </div>
              <div className="flex-1">
                <div className="text-xs text-emerald-400 font-medium">
                  Topologi Rangkaian
                </div>
                <div className="text-lg font-bold text-emerald-300">
                  {calc.topology.type === "series" && "Seri"}
                  {calc.topology.type === "parallel" && "Paralel"}
                  {calc.topology.type === "mixed" &&
                    "Campuran (Seri + Paralel)"}
                </div>
              </div>
              {/* Indicator Percabangan */}
              {calc.topology.hasParallelBranch && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-900/40 rounded-lg border border-blue-500/40">
                  <span className="text-lg">🌿</span>
                  <span className="text-xs text-blue-300 font-semibold">
                    Percabangan Terdeteksi
                  </span>
                </div>
              )}
            </div>

            {/* Branch Nodes Info */}
            {calc.topology.branchNodes &&
              calc.topology.branchNodes.length > 0 && (
                <div className="mb-3 p-2 bg-blue-900/20 rounded-lg border border-blue-500/30">
                  <div className="text-xs text-blue-300 font-semibold mb-1">
                    🔍 Node Percabangan (Degree &gt; 2):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {calc.topology.branchNodes.map((node, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-0.5 bg-blue-900/40 text-blue-300 rounded text-xs font-mono"
                      >
                        {node}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-blue-400 mt-1">
                    💡 Node ini terhubung ke lebih dari 2 terminal (terjadi
                    percabangan paralel)
                  </div>
                </div>
              )}

            {/* Groups Details */}
            {calc.topology.groups && calc.topology.groups.length > 0 && (
              <div className="space-y-2 mt-3">
                <div className="text-xs text-emerald-300 font-semibold mb-2">
                  Detail Grup Komponen:
                </div>
                {calc.topology.groups.map((group, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 rounded-lg p-3 border border-emerald-500/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-sm text-emerald-300">
                        {group.type === "parallel"
                          ? "🔀 Grup Paralel"
                          : "📏 Grup Seri"}{" "}
                        #{idx + 1}
                      </div>
                      <div className="text-xs text-blue-400 font-bold">
                        Arus: {group.current.toFixed(3)} A
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.elements.map((elem) => (
                        <div
                          key={elem.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-md text-xs"
                        >
                          <span>
                            {elem.type === "battery" && "🔋"}
                            {elem.type === "resistor" && "⚡"}
                            {elem.type === "lamp" && "💡"}
                            {elem.type === "switch" && "🔘"}
                          </span>
                          <span className="font-medium text-slate-200">
                            {elem.type === "battery" && `${elem.voltage}V`}
                            {elem.type === "resistor" && `${elem.resistance}Ω`}
                            {elem.type === "lamp" && `${elem.resistance}Ω`}
                            {elem.type === "switch" &&
                              (elem.closed ? "ON" : "OFF")}
                          </span>
                          {group.type === "parallel" &&
                            (elem.type === "resistor" ||
                              elem.type === "lamp") &&
                            elem.resistance && (
                              <span className="text-cyan-400 font-bold ml-1">
                                {((calc.totalV || 0) / elem.resistance).toFixed(
                                  3
                                )}
                                A
                              </span>
                            )}
                        </div>
                      ))}
                    </div>
                    {group.type === "parallel" && (
                      <div className="mt-2 text-xs text-slate-400">
                        Resistansi ekuivalen:{" "}
                        {group.equivalentResistance.toFixed(2)} Ω
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="relative border-4 border-dashed border-slate-600 rounded-2xl overflow-hidden bg-slate-800 shadow-inner mx-auto"
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
            backgroundImage: `
              radial-gradient(circle, rgba(100, 116, 139, 0.2) 1px, transparent 1px),
              linear-gradient(to right, rgba(71, 85, 105, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(71, 85, 105, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${GRID}px ${GRID}px, ${GRID}px ${GRID}px, ${GRID}px ${GRID}px`,
            backgroundPosition: "0 0, 0 0, 0 0",
          }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClick={() => {
            setSelectedId(null);
            if (connectMode) setPending(null);
          }}
        >
          <svg
            width={canvasSize.width}
            height={canvasSize.height}
            className="absolute inset-0"
          >
            {/* Render old-style wires first (behind components) */}
            {wires.map(renderWire)}

            {/* Render wire element connections */}
            {renderWireElementConnections()}

            {/* Render components */}
            {elements.map(renderElement)}

            {/* 🔄 Rotation Guide Circle (when rotating) */}
            {rotationDrag &&
              elements.find((el) => el.id === rotationDrag.elementId) && (
                <g>
                  {(() => {
                    const el = elements.find(
                      (e) => e.id === rotationDrag.elementId
                    )!;
                    return (
                      <>
                        <circle
                          cx={el.position.x}
                          cy={el.position.y}
                          r={70}
                          className="fill-none stroke-purple-400 stroke-dashed"
                          strokeWidth={2}
                          opacity={0.6}
                        />
                        <circle
                          cx={el.position.x}
                          cy={el.position.y}
                          r={4}
                          className="fill-purple-400"
                          opacity={0.8}
                        />
                        <text
                          x={el.position.x}
                          y={el.position.y - 80}
                          textAnchor="middle"
                          className="fill-purple-600 text-sm font-bold"
                          style={{ textShadow: "0 0 3px white" }}
                        >
                          🔄 {el.rotation}°
                        </text>
                      </>
                    );
                  })()}
                </g>
              )}

            {/* Pending connection line */}
            {connectMode && pending && dragId === null && (
              <g>
                <text
                  x={canvasSize.width / 2}
                  y={30}
                  textAnchor="middle"
                  fontSize={14}
                  fill="#3b82f6"
                  fontWeight="bold"
                >
                  {pending
                    ? "Klik terminal komponen atau kabel lain..."
                    : "Klik terminal untuk memulai koneksi..."}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Instructions & Status */}
        <div className="mt-6 space-y-3">
          {/* Tips */}
          <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl p-4 border-2 border-cyan-500/30">
            <h4 className="text-sm font-bold text-cyan-300 mb-2 flex items-center">
              <span className="text-lg mr-2">💡</span>
              Panduan Cepat
            </h4>
            <div className="space-y-2 text-xs text-blue-200">
              <div className="font-semibold text-cyan-300">📦 Komponen:</div>
              <div>• Tambahkan Baterai, Lampu, Resistor, Saklar, dan Kabel</div>
              <div>
                • <strong>Drag body komponen</strong> untuk memindahkan posisi
              </div>
              <div>
                • <strong>Drag terminal (bulatan)</strong> untuk merotasi
                komponen 🔄
              </div>

              <div className="font-semibold text-cyan-300 mt-2">
                🔗 Koneksi dengan Kabel:
              </div>
              <div>• Tambahkan item &quot;Kabel&quot; ke canvas</div>
              <div>• Aktifkan &quot;Mode Koneksi&quot;</div>
              <div>• Klik terminal Kabel (ujung A atau B)</div>
              <div>• Lalu klik terminal Komponen (Baterai, Lampu, dll)</div>
              <div>• Ulangi untuk ujung kabel lainnya</div>

              <div className="font-semibold text-cyan-300 mt-2">
                ⚡ Rangkaian Paralel:
              </div>
              <div>• Gunakan lebih dari 1 kabel</div>
              <div>• Hubungkan beberapa kabel ke terminal yang sama</div>
              <div>
                • Contoh: Baterai(+) → Kabel1 → Lampu1, Baterai(+) → Kabel2 →
                Lampu2
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {elements.length === 0 && (
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl p-4 border-2 border-orange-500/30 text-center">
              <p className="text-sm font-medium text-orange-300">
                👆 Mulai dengan menambahkan komponen di atas!
              </p>
            </div>
          )}

          {!calc.isConnected &&
            elements.length > 0 &&
            elements.filter((e) => e.type === "wire").length === 0 && (
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl p-4 border-2 border-yellow-500/30">
                <p className="text-sm font-medium text-yellow-300">
                  ⚠️ Tambahkan item &quot;Kabel&quot; untuk menghubungkan
                  komponen!
                </p>
              </div>
            )}

          {calc.isConnected &&
            !calc.isClosed &&
            !calc.hasOpenSwitch &&
            wires.length > 0 && (
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl p-4 border-2 border-yellow-500/30">
                <p className="text-sm font-medium text-yellow-300">
                  ⚠️ Rangkaian belum tertutup. Pastikan semua komponen terhubung
                  dalam satu loop!
                </p>
              </div>
            )}

          {calc.hasOpenSwitch && (
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl p-4 border-2 border-red-500/30">
              <p className="text-sm font-medium text-red-300">
                🔴 Saklar terbuka! Arus listrik tidak mengalir. Double-click
                saklar untuk menutup.
              </p>
            </div>
          )}

          {calc.isClosed && !calc.hasOpenSwitch && calc.current > 0 && (
            <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl p-4 border-2 border-green-500/30">
              <p className="text-sm font-medium text-green-300">
                ✅ Rangkaian tertutup! Arus mengalir:{" "}
                <strong>{calc.current.toFixed(3)} A</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
