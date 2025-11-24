/**
 * Circuit Analysis for CV Practicum
 * Adapted from drag-n-drop CircuitBuilderEnhanced logic
 * Handles series, parallel, and mixed circuits with proper lamp power calculation
 */

import { ComponentType } from "@/components/praktikum-cv/types";

// Local interfaces matching WebCVPracticum
interface CircuitComponent {
  id: string;
  type: ComponentType;
  position: { x: number; y: number };
  rotation: number;
  state?: "open" | "closed";
  value: number;
}

interface WireEnd {
  elementId: string;
  terminalId: "a" | "b";
}

interface WireComponent {
  id: string;
  from: WireEnd;
  to: WireEnd;
  current?: number;
}

export interface CircuitAnalysisResult {
  // Overall circuit properties
  current: number;
  power: number;
  totalVoltage: number;
  totalResistance: number;

  // Component-specific data
  componentCurrents: Record<string, number>;
  lampPowers: Record<string, number>;

  // Circuit state
  isClosed: boolean;
  hasOpenSwitch: boolean;
  isConnected: boolean;

  // Topology information
  topology?: {
    type: "series" | "parallel" | "mixed";
    groups: Array<{
      type: "series" | "parallel";
      elements: Array<{
        id: string;
        type: string;
        resistance?: number;
        isActive?: boolean;
      }>;
      current: number;
      equivalentResistance: number;
    }>;
    hasParallelBranch: boolean;
    branchNodes: string[];
  };
}

/**
 * Analyze circuit and calculate current flow for all components
 */
export function analyzeCircuit(
  components: CircuitComponent[],
  wires: WireComponent[]
): CircuitAnalysisResult {
  console.log("\n" + "=".repeat(60));
  console.log("🔌 ANALISIS RANGKAIAN LISTRIK (CV PRACTICUM)");
  console.log("=".repeat(60));

  // Filter components
  const batteries = components.filter((c) => c.type === "battery");
  const resistiveElements = components.filter(
    (c) => c.type === "resistor" || c.type === "lamp"
  );
  const switches = components.filter((c) => c.type === "switch");

  console.log("\n📍 KOMPONEN RANGKAIAN:");
  console.log(`   → Baterai: ${batteries.length} buah`);
  console.log(`   → Lampu/Resistor: ${resistiveElements.length} buah`);
  console.log(`   → Saklar: ${switches.length} buah`);
  console.log(`   → Kabel: ${wires.length} buah`);

  // Calculate total voltage
  const totalVoltage = batteries.reduce((sum, b) => sum + b.value, 0);
  console.log(`\n📍 TEGANGAN TOTAL: ${totalVoltage}V`);

  // Early exit conditions
  if (totalVoltage === 0 || resistiveElements.length === 0) {
    console.log(
      "⚠️ Rangkaian tidak aktif (tidak ada tegangan atau komponen resistif)"
    );
    return {
      current: 0,
      power: 0,
      totalVoltage: 0,
      totalResistance: 0,
      componentCurrents: {},
      lampPowers: {},
      isClosed: false,
      hasOpenSwitch: false,
      isConnected: false,
    };
  }

  // Build connection graph
  console.log("\n📍 MEMBANGUN GRAF KONEKSI:");
  const connectionGraph = new Map<string, Set<string>>();

  // Initialize nodes for all components (both terminals)
  components.forEach((comp) => {
    connectionGraph.set(`${comp.id}-a`, new Set());
    connectionGraph.set(`${comp.id}-b`, new Set());
  });

  // Add wire connections
  wires.forEach((wire) => {
    const fromNode = `${wire.from.elementId}-${wire.from.terminalId}`;
    const toNode = `${wire.to.elementId}-${wire.to.terminalId}`;
    connectionGraph.get(fromNode)?.add(toNode);
    connectionGraph.get(toNode)?.add(fromNode);
    console.log(`   ✅ Wire: ${fromNode} ↔ ${toNode}`);
  });

  // Add switch connections (structural - regardless of state)
  switches.forEach((sw) => {
    const nodeA = `${sw.id}-a`;
    const nodeB = `${sw.id}-b`;
    connectionGraph.get(nodeA)?.add(nodeB);
    connectionGraph.get(nodeB)?.add(nodeA);
  });

  // Check for open switches
  const hasOpenSwitch = switches.some((s) => s.state === "open");
  const closedSwitches = switches.filter((s) => s.state === "closed");

  console.log("\n📍 STATUS SAKLAR:");
  switches.forEach((sw) => {
    const status = sw.state === "closed" ? "✅ TERTUTUP" : "❌ TERBUKA";
    console.log(`   ${status}: Switch ${sw.id.slice(-8)}`);
  });

  // Check if circuit is connected (BFS from battery)
  let isConnected = false;
  if (batteries.length > 0) {
    const visited = new Set<string>();
    const queue = [batteries[0].id];
    visited.add(batteries[0].id);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const nodeA = `${current}-a`;
      const nodeB = `${current}-b`;

      [nodeA, nodeB].forEach((node) => {
        connectionGraph.get(node)?.forEach((neighbor) => {
          const neighborId = neighbor.split("-")[0];
          if (!visited.has(neighborId)) {
            visited.add(neighborId);
            queue.push(neighborId);
          }
        });
      });
    }

    isConnected = components.every((c) => visited.has(c.id));
  }

  console.log(`\n📍 KONEKSI: ${isConnected ? "✅ Terhubung" : "❌ Terputus"}`);

  // ⚠️ PERBAIKAN KRUSIAL: Jangan lanjut jika rangkaian tidak terhubung sempurna
  // Lampu TIDAK BOLEH menyala sebelum semua komponen terhubung!
  if (!isConnected) {
    console.log("⚠️ Rangkaian belum lengkap - semua komponen harus terhubung!");
    return {
      current: 0,
      power: 0,
      totalVoltage,
      totalResistance: 0,
      componentCurrents: {},
      lampPowers: {},
      isClosed: false,
      hasOpenSwitch,
      isConnected: false,
      topology: {
        type: "series",
        groups: [],
        hasParallelBranch: false,
        branchNodes: [],
      },
    };
  }

  // Circuit is closed if connected and has at least one closed switch path
  const isClosed =
    isConnected && (switches.length === 0 || closedSwitches.length > 0);
  console.log(`📍 SIRKUIT: ${isClosed ? "✅ Tertutup" : "❌ Terbuka"}`);

  // Detect parallel branches (nodes with degree > 2)
  const branchNodes: string[] = [];
  connectionGraph.forEach((connections, node) => {
    if (connections.size > 2) {
      branchNodes.push(node);
    }
  });
  const hasParallelBranch = branchNodes.length > 0;

  console.log(`\n📍 TOPOLOGI: ${hasParallelBranch ? "🔀 Paralel" : "➡️ Seri"}`);
  if (hasParallelBranch) {
    console.log(`   → Ditemukan ${branchNodes.length} branch node(s)`);
  }

  // Group elements by CONNECTED PATH for parallel detection
  const parallelGroups: string[][] = [];
  if (hasParallelBranch) {
    // ⚠️ PERBAIKAN: Deteksi cabang berdasarkan path koneksi, bukan hanya posisi Y
    // Strategi: Cari semua path berbeda dari titik percabangan pertama ke titik percabangan kedua

    const analyzedElements = [...resistiveElements, ...switches];
    const visited = new Set<string>();

    // Helper: Find all elements in the same path using DFS
    const findPathGroup = (startElementId: string): string[] => {
      if (visited.has(startElementId)) return [];

      const group: string[] = [];
      const stack = [startElementId];
      const pathVisited = new Set<string>();

      while (stack.length > 0) {
        const currentId = stack.pop()!;
        if (pathVisited.has(currentId)) continue;

        pathVisited.add(currentId);
        visited.add(currentId);

        // Add element to group if it's a resistive element or switch
        const element = components.find((c) => c.id === currentId);
        if (
          element &&
          (element.type === "lamp" ||
            element.type === "resistor" ||
            element.type === "switch")
        ) {
          group.push(currentId);
        }

        // Find connected elements through wires (only within same branch)
        const nodeA = `${currentId}-a`;
        const nodeB = `${currentId}-b`;

        [nodeA, nodeB].forEach((node) => {
          connectionGraph.get(node)?.forEach((connectedNode) => {
            const connectedId = connectedNode.split("-")[0];
            const connectedComp = components.find((c) => c.id === connectedId);

            // Only follow if:
            // 1. Not visited
            // 2. Is lamp/resistor/switch (not battery)
            // 3. Similar Y position (same branch, tolerance 50px)
            if (
              !pathVisited.has(connectedId) &&
              connectedComp &&
              connectedComp.type !== "battery"
            ) {
              const currentComp = components.find((c) => c.id === currentId);
              if (currentComp && connectedComp) {
                const yDiff = Math.abs(
                  currentComp.position.y - connectedComp.position.y
                );

                // If Y difference is small (< 50px), they're in the same branch
                if (yDiff < 50) {
                  stack.push(connectedId);
                }
              }
            }
          });
        });
      }

      return group;
    };

    // Find all path groups
    analyzedElements.forEach((el) => {
      const group = findPathGroup(el.id);
      if (group.length > 0) {
        parallelGroups.push(group);
      }
    });

    console.log(`\n📍 PARALLEL GROUPS: ${parallelGroups.length} cabang`);
    parallelGroups.forEach((group, idx) => {
      const groupInfo = group
        .map((id) => {
          const comp = components.find((c) => c.id === id);
          const typeLabel =
            comp?.type === "switch"
              ? `switch(${comp.state})`
              : comp?.type || "unknown";
          return `${id.slice(-8)}:${typeLabel}`;
        })
        .join(", ");
      console.log(`   Cabang ${idx + 1}: [${groupInfo}]`);
    });
  }

  // Helper: Check if element path is blocked by open switch
  const hasOpenSwitchInPath = (elementId: string): boolean => {
    // Check if element itself is an open switch
    const element = components.find((c) => c.id === elementId);
    if (element?.type === "switch" && element.state === "open") {
      return true;
    }

    // For parallel circuits: only blocked if open switch in SAME branch
    if (parallelGroups.length > 0) {
      const branchContainingElement = parallelGroups.find((group) =>
        group.includes(elementId)
      );

      if (branchContainingElement) {
        return switches.some(
          (sw) => branchContainingElement.includes(sw.id) && sw.state === "open"
        );
      }
    }

    // For series circuits: any open switch blocks everything
    return hasOpenSwitch;
  };

  // Calculate total resistance
  let totalResistance = 0;
  const activeElements: string[] = [];

  if (parallelGroups.length > 0) {
    // Parallel circuit: R_total = 1 / (1/R1 + 1/R2 + ...)
    console.log("\n📍 PERHITUNGAN PARALEL:");

    resistiveElements.forEach((el) => {
      if (!hasOpenSwitchInPath(el.id)) {
        activeElements.push(el.id);
        console.log(
          `   ✅ ${el.type} ${el.id.slice(-8)}: AKTIF (R=${el.value}Ω)`
        );
      } else {
        console.log(`   ❌ ${el.type} ${el.id.slice(-8)}: TERBLOKIR`);
      }
    });

    if (activeElements.length > 0) {
      totalResistance =
        1 /
        activeElements.reduce((sum, id) => {
          const el = resistiveElements.find((e) => e.id === id)!;
          return sum + 1 / el.value;
        }, 0);
      console.log(
        `   → R_total = ${totalResistance.toFixed(2)}Ω (${
          activeElements.length
        } elemen aktif)`
      );
    }
  } else {
    // Series circuit: R_total = R1 + R2 + ...
    console.log("\n📍 PERHITUNGAN SERI:");

    resistiveElements.forEach((el) => {
      if (!hasOpenSwitchInPath(el.id)) {
        activeElements.push(el.id);
        totalResistance += el.value;
        console.log(
          `   ✅ ${el.type} ${el.id.slice(-8)}: AKTIF (R=${el.value}Ω)`
        );
      } else {
        console.log(`   ❌ ${el.type} ${el.id.slice(-8)}: TERBLOKIR`);
      }
    });

    console.log(`   → R_total = ${totalResistance.toFixed(2)}Ω`);
  }

  // Calculate total current and power
  const totalCurrent = totalResistance > 0 ? totalVoltage / totalResistance : 0;
  const totalPower = totalVoltage * totalCurrent;

  console.log(`\n📍 HASIL AKHIR:`);
  console.log(`   → I_total = ${totalCurrent.toFixed(3)}A`);
  console.log(`   → P_total = ${totalPower.toFixed(3)}W`);
  console.log(`   → R_total = ${totalResistance.toFixed(2)}Ω`);

  // Calculate individual component currents and lamp powers
  const componentCurrents: Record<string, number> = {};
  const lampPowers: Record<string, number> = {};

  // Initialize all lamps with 0 power
  components.forEach((comp) => {
    if (comp.type === "lamp") {
      lampPowers[comp.id] = 0;
    }
  });

  console.log(`\n📍 STATUS LAMPU:`);

  if (parallelGroups.length > 0) {
    // Parallel: Each active element gets V/R current
    // ⚠️ PERBAIKAN: Verifikasi ulang bahwa elemen BENAR-BENAR aktif (tidak terblokir saklar)
    resistiveElements.forEach((el) => {
      // Double-check: Pastikan tidak ada saklar terbuka di cabang yang sama
      if (activeElements.includes(el.id) && !hasOpenSwitchInPath(el.id)) {
        const elementCurrent = totalVoltage / el.value;
        componentCurrents[el.id] = elementCurrent;

        if (el.type === "lamp") {
          lampPowers[el.id] = elementCurrent * elementCurrent * el.value;
          console.log(
            `   💡 Lampu ${el.id.slice(-8)}: HIDUP (I=${elementCurrent.toFixed(
              3
            )}A, P=${lampPowers[el.id].toFixed(2)}W)`
          );
        }
      } else {
        // Elemen terblokir atau tidak aktif
        componentCurrents[el.id] = 0;

        if (el.type === "lamp") {
          lampPowers[el.id] = 0;
          console.log(
            `   💡 Lampu ${el.id.slice(-8)}: MATI (${
              hasOpenSwitchInPath(el.id)
                ? "saklar terbuka di cabangnya"
                : "tidak aktif"
            })`
          );
        }
      }
    });
  } else {
    // Series: All active elements get same current
    resistiveElements.forEach((el) => {
      if (activeElements.includes(el.id)) {
        componentCurrents[el.id] = totalCurrent;

        if (el.type === "lamp") {
          lampPowers[el.id] = totalCurrent * totalCurrent * el.value;
          console.log(
            `   💡 Lampu ${el.id.slice(-8)}: HIDUP (I=${totalCurrent.toFixed(
              3
            )}A, P=${lampPowers[el.id].toFixed(2)}W)`
          );
        }
      } else {
        componentCurrents[el.id] = 0;

        if (el.type === "lamp") {
          lampPowers[el.id] = 0;
          console.log(`   💡 Lampu ${el.id.slice(-8)}: MATI (terblokir)`);
        }
      }
    });
  }

  // Set current for non-resistive elements
  components.forEach((comp) => {
    if (
      comp.type === "battery" ||
      comp.type === "switch" ||
      comp.type === "wire"
    ) {
      componentCurrents[comp.id] = totalCurrent;
    }
  });

  // Determine topology type
  const serialElements = resistiveElements.filter(
    (el) => !parallelGroups.flat().includes(el.id)
  );

  let topologyType: "series" | "parallel" | "mixed";
  if (hasParallelBranch) {
    topologyType = serialElements.length > 0 ? "mixed" : "parallel";
  } else if (parallelGroups.length > 0) {
    topologyType = serialElements.length > 0 ? "mixed" : "parallel";
  } else {
    topologyType = "series";
  }

  console.log(`\n📍 TOPOLOGI AKHIR: ${topologyType.toUpperCase()}`);
  console.log("=".repeat(60) + "\n");

  return {
    current: totalCurrent,
    power: totalPower,
    totalVoltage,
    totalResistance,
    componentCurrents,
    lampPowers,
    isClosed,
    hasOpenSwitch,
    isConnected,
    topology: {
      type: topologyType,
      groups: [], // Simplified - can be expanded later
      hasParallelBranch,
      branchNodes,
    },
  };
}
