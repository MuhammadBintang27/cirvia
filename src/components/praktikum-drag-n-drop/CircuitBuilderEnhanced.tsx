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

  elements.forEach((el) => {
    graph[el.id] = new Set();
  });

  // Add old-style wires
  wires.forEach((wire) => {
    graph[wire.from.elementId]?.add(wire.to.elementId);
    graph[wire.to.elementId]?.add(wire.from.elementId);
  });

  // Add connections from wire elements
  elements.forEach((el) => {
    if (el.type === "wire" && el.connectedTo) {
      // Wire connects two components
      const connA = el.connectedTo.a;
      const connB = el.connectedTo.b;

      if (connA && connB) {
        // Wire is fully connected
        graph[connA.elementId]?.add(connB.elementId);
        graph[connB.elementId]?.add(connA.elementId);

        // Wire itself is part of the graph
        graph[el.id] = new Set([connA.elementId, connB.elementId]);
        graph[connA.elementId]?.add(el.id);
        graph[connB.elementId]?.add(el.id);
      }
    }
  });

  const batteries = elements.filter((e) => e.type === "battery");
  if (batteries.length === 0) return { isConnected: false, isClosed: false };

  const visited = new Set<string>();
  const queue = [batteries[0].id];
  visited.add(batteries[0].id);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = graph[current];

    neighbors?.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    });
  }

  // Filter wire elements untuk pengecekan
  const nonWireElements = elements.filter((e) => e.type !== "wire");
  const isConnected = nonWireElements.every((el) => visited.has(el.id));

  const hasOpenSwitch = elements.some(
    (e) => e.type === "switch" && e.state === "open"
  );

  return {
    isConnected,
    isClosed: isConnected && !hasOpenSwitch,
    hasOpenSwitch,
  };
}

function calculateCurrentFlow(elements: CircuitElement[], wires: Wire[]) {
  const batteries = elements.filter((e) => e.type === "battery");
  const resistiveElements = elements.filter(
    (e) => e.type === "resistor" || e.type === "lamp"
  );
  const switches = elements.filter((e) => e.type === "switch");

  const totalVoltage = batteries.reduce((sum, b) => sum + b.value, 0);
  const hasOpenSwitch = switches.some((s) => s.state === "open");

  if (hasOpenSwitch || totalVoltage === 0) {
    return { current: 0, power: 0, componentCurrents: {}, lampPowers: {} };
  }

  if (resistiveElements.length === 0) {
    return { current: 0, power: 0, componentCurrents: {}, lampPowers: {} };
  }

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

  // 🔍 Deteksi percabangan (node dengan degree > 2)
  const branchNodes: string[] = [];
  connectionGraph.forEach((connections, node) => {
    if (connections.size > 2) {
      branchNodes.push(node);
    }
  });
  const hasParallelBranch = branchNodes.length > 0;

  // 🔀 Deteksi komponen paralel menggunakan electrical nodes
  const parallelGroups: string[][] = [];
  const processedElements = new Set<string>();

  resistiveElements.forEach((el) => {
    if (processedElements.has(el.id)) return;

    const group: string[] = [el.id];
    processedElements.add(el.id);

    const elNodeA = `${el.id}-a`;
    const elNodeB = `${el.id}-b`;
    
    // Dapatkan electrical node (root dari union-find)
    const elElectricalA = find(elNodeA);
    const elElectricalB = find(elNodeB);

    // Cari komponen lain yang terhubung ke electrical node yang sama
    resistiveElements.forEach((other) => {
      if (other.id === el.id || processedElements.has(other.id)) return;

      const otherNodeA = `${other.id}-a`;
      const otherNodeB = `${other.id}-b`;
      
      const otherElectricalA = find(otherNodeA);
      const otherElectricalB = find(otherNodeB);

      // Jika kedua ujung terhubung ke electrical node yang sama = PARALEL
      if (elElectricalA === otherElectricalA && elElectricalB === otherElectricalB) {
        group.push(other.id);
        processedElements.add(other.id);
      }
    });

    if (group.length > 1) {
      parallelGroups.push(group);
    }
  });

  // Hitung total resistansi dengan mempertimbangkan paralel
  let totalResistance = 0;

  if (parallelGroups.length > 0) {
    // Ada komponen paralel
    parallelGroups.forEach((group) => {
      // Untuk paralel: 1/R_total = 1/R1 + 1/R2 + ...
      const parallelResistance =
        1 /
        group.reduce((sum, id) => {
          const el = resistiveElements.find((e) => e.id === id)!;
          return sum + 1 / el.value;
        }, 0);
      totalResistance += parallelResistance;
    });

    // Tambahkan resistor yang tidak paralel (seri)
    const serialElements = resistiveElements.filter(
      (el) => !parallelGroups.flat().includes(el.id)
    );
    totalResistance += serialElements.reduce((sum, el) => sum + el.value, 0);
  } else {
    // Semua seri
    totalResistance = resistiveElements.reduce((sum, r) => sum + r.value, 0);
  }

  if (totalResistance === 0) {
    return { current: 0, power: 0, componentCurrents: {}, lampPowers: {} };
  }

  const totalCurrent = totalVoltage / totalResistance;
  const totalPower = totalVoltage * totalCurrent;

  // Hitung arus untuk setiap komponen
  const componentCurrents: Record<string, number> = {};
  const lampPowers: Record<string, number> = {};

  if (parallelGroups.length > 0) {
    // Ada komponen paralel - distribusi arus berbeda
    parallelGroups.forEach((group) => {
      // Dalam paralel: V sama untuk semua branch
      // I = V/R untuk masing-masing komponen
      group.forEach((id) => {
        const el = resistiveElements.find((e) => e.id === id)!;
        const componentCurrent = totalVoltage / el.value;
        componentCurrents[id] = componentCurrent;

        if (el.type === "lamp") {
          lampPowers[id] = componentCurrent * componentCurrent * el.value;
        }
      });
    });

    // Komponen seri mendapat total current
    const serialElements = resistiveElements.filter(
      (el) => !parallelGroups.flat().includes(el.id)
    );
    serialElements.forEach((el) => {
      componentCurrents[el.id] = totalCurrent;
      if (el.type === "lamp") {
        lampPowers[el.id] = totalCurrent * totalCurrent * el.value;
      }
    });
  } else {
    // Semua seri - arus sama untuk semua
    resistiveElements.forEach((el) => {
      componentCurrents[el.id] = totalCurrent;
      if (el.type === "lamp") {
        lampPowers[el.id] = totalCurrent * totalCurrent * el.value;
      }
    });
  }

  // Set current untuk non-resistive elements
  elements.forEach((el) => {
    if (el.type === "battery" || el.type === "switch" || el.type === "wire") {
      componentCurrents[el.id] = totalCurrent;
    }
  });

  // Build topology info
  const topologyGroups: {
    type: 'series' | 'parallel';
    elements: Array<{
      id: string;
      type: string;
      voltage?: number;
      resistance?: number;
      closed?: boolean;
    }>;
    current: number;
    equivalentResistance: number;
  }[] = [];

  // Add parallel groups
  parallelGroups.forEach((group) => {
    const parallelResistance =
      1 /
      group.reduce((sum, id) => {
        const el = resistiveElements.find((e) => e.id === id)!;
        return sum + 1 / el.value;
      }, 0);

    topologyGroups.push({
      type: 'parallel',
      elements: group.map((id) => {
        const el = elements.find((e) => e.id === id)!;
        return {
          id: el.id,
          type: el.type,
          resistance: el.type === 'resistor' || el.type === 'lamp' ? el.value : undefined,
          voltage: el.type === 'battery' ? el.value : undefined,
          closed: el.type === 'switch' ? el.state === 'closed' : undefined,
        };
      }),
      current: totalVoltage / parallelResistance,
      equivalentResistance: parallelResistance,
    });
  });

  // Add series elements
  const serialElements = resistiveElements.filter(
    (el) => !parallelGroups.flat().includes(el.id)
  );
  if (serialElements.length > 0) {
    const seriesResistance = serialElements.reduce((sum, el) => sum + el.value, 0);
    topologyGroups.push({
      type: 'series',
      elements: serialElements.map((el) => ({
        id: el.id,
        type: el.type,
        resistance: el.value,
      })),
      current: totalCurrent,
      equivalentResistance: seriesResistance,
    });
  }

  // Determine overall topology type
  // 🎯 Gunakan informasi percabangan untuk deteksi lebih akurat
  let topologyType: 'series' | 'parallel' | 'mixed';
  
  if (hasParallelBranch || parallelGroups.length > 0) {
    // Ada percabangan atau grup paralel terdeteksi
    if (serialElements.length > 0) {
      topologyType = 'mixed'; // Ada kombinasi seri dan paralel
    } else {
      topologyType = 'parallel'; // Hanya paralel
    }
  } else {
    // Tidak ada percabangan, semua seri
    topologyType = 'series';
  }

  return {
    current: totalCurrent,
    power: totalPower,
    componentCurrents,
    lampPowers,
    topology: {
      type: topologyType,
      groups: topologyGroups,
      hasParallelBranch, // ✅ Flag percabangan
      branchNodes, // ✅ Daftar node yang bercabang
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

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragId) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = snapToGrid(e.clientX - rect.left - dragOffset.x);
    const y = snapToGrid(e.clientY - rect.top - dragOffset.y);

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
  };

  const onMouseUp = () => {
    if (dragId) {
      playSound(700, 30);
    }
    setDragId(null);
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
    if (flow.current > 0 && circuitAnalysis.isClosed) {
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
      topology: flow.topology, // Tambahkan topology info
    };
  }, [elements, wires]);

  // Render Bezier Wire
  const renderWire = (w: Wire) => {
    const fromEl = elements.find((e) => e.id === w.from.elementId);
    const toEl = elements.find((e) => e.id === w.to.elementId);
    if (!fromEl || !toEl) return null;

    const a = terminalAbsPos(fromEl, w.from.terminalId);
    const b = terminalAbsPos(toEl, w.to.terminalId);

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
          stroke={isActive ? "#3b82f6" : "#1f2937"}
          strokeWidth={isMobile ? 4 : 6}
          fill="none"
          className="transition-all duration-200"
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
              const progress = ((flowAnimation + offset) % 100) / 100;
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

        // Render two connections: wireA -> compA and wireB -> compB
        return (
          <g key={`wire-conn-${wireEl.id}`}>
            {/* Connection from wire terminal A to component A */}
            {renderSingleConnection(
              wireTermA,
              compTermA,
              hasCurrent,
              `${wireEl.id}-a`
            )}
            {/* Connection from wire terminal B to component B */}
            {renderSingleConnection(
              wireTermB,
              compTermB,
              hasCurrent,
              `${wireEl.id}-b`
            )}
          </g>
        );
      });
  };

  // Helper to render single connection line
  const renderSingleConnection = (
    from: Pos,
    to: Pos,
    hasCurrent: boolean,
    key: string
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
          stroke="#1f2937"
          strokeWidth={isMobile ? 4 : 6}
          fill="none"
          className="transition-all duration-200"
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
              const progress = ((flowAnimation + offset) % 100) / 100;
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
                stroke="#ef4444"
                strokeWidth={3}
              />
              <line
                x1={7}
                y1={0}
                x2={23}
                y2={0}
                stroke="#ef4444"
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
                stroke="#1f2937"
                strokeWidth={3}
              />
              <line
                x1={25}
                y1={0}
                x2={terminalOffset}
                y2={0}
                stroke="#1f2937"
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
                stroke="#1f2937"
                strokeWidth={3}
              />
              <line
                x1={20}
                y1={0}
                x2={terminalOffset}
                y2={0}
                stroke="#1f2937"
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
            </g>
          );
        }

        case "lamp": {
          const lampPower = (calc.lampPowers as Record<string, number>)?.[el.id] || 0;
          const isOn = lampPower > 0.1;
          const brightness = Math.min(1, lampPower / 2);

          return (
            <g>
              {/* Wires */}
              <line
                x1={-terminalOffset}
                y1={0}
                x2={-20}
                y2={0}
                stroke="#1f2937"
                strokeWidth={3}
              />
              <line
                x1={20}
                y1={0}
                x2={terminalOffset}
                y2={0}
                stroke="#1f2937"
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

              {/* Bulb */}
              <circle
                r={18}
                fill={
                  isOn
                    ? `rgba(254, 243, 199, ${0.9 + 0.1 * brightness})`
                    : "#e5e7eb"
                }
                stroke={isSel ? "#eab308" : isOn ? "#fbbf24" : "#9ca3af"}
                strokeWidth={2}
                style={{
                  filter: isOn
                    ? `drop-shadow(0 0 ${
                        8 + 8 * brightness
                      }px rgba(251, 191, 36, ${brightness}))`
                    : "none",
                }}
              />

              {/* Filament */}
              {isOn ? (
                <path
                  d="M -6 -6 Q 0 -8 6 -6 Q 0 -4 -6 -6 M -6 0 Q 0 2 6 0 Q 0 4 -6 0 M -6 6 Q 0 8 6 6 Q 0 10 -6 6"
                  stroke={`rgba(251, 191, 36, ${brightness})`}
                  strokeWidth={2}
                  fill="none"
                  className="animate-pulse"
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
                stroke="#1f2937"
                strokeWidth={3}
              />
              <line
                x1={15}
                y1={0}
                x2={terminalOffset}
                y2={0}
                stroke="#1f2937"
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
                fill="#6b7280"
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
                stroke={isSel ? "#1f2937" : "#374151"}
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
          fill={connectMode || isSel ? "#3b82f6" : "#6b7280"}
          stroke={connectMode || isSel ? "#1e40af" : "#374151"}
          strokeWidth={2}
          onClick={(e) => {
            e.stopPropagation();
            onClickTerminal(el.id, "a");
          }}
          className="cursor-pointer transition-all duration-150 hover:scale-125"
        />
        <circle
          cx={terminalOffset}
          cy={0}
          r={terminalRadius}
          fill={connectMode || isSel ? "#3b82f6" : "#6b7280"}
          stroke={connectMode || isSel ? "#1e40af" : "#374151"}
          strokeWidth={2}
          onClick={(e) => {
            e.stopPropagation();
            onClickTerminal(el.id, "b");
          }}
          className="cursor-pointer transition-all duration-150 hover:scale-125"
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

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-2xl p-4 sm:p-6 border-2 border-slate-200">
        {/* Toolbar */}
        <div className="mb-6 space-y-3">
          {/* Component Buttons */}
          <div className="flex flex-wrap gap-2">
            <div className="text-sm font-bold text-slate-700 mr-2 flex items-center">
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
                  : "bg-white text-blue-600 border-2 border-blue-300 hover:bg-blue-50"
              }`}
            >
              {connectMode ? "✓ Mode Koneksi ON" : "🔗 Mode Koneksi"}
            </button>
            <button
              onClick={rotateSelected}
              disabled={!selectedId}
              className="px-3 py-2 rounded-xl bg-white text-slate-700 border-2 border-slate-300 font-medium shadow-lg hover:shadow-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 text-sm"
            >
              ↻ Rotasi
            </button>
            <button
              onClick={deleteSelected}
              disabled={!selectedId}
              className="px-3 py-2 rounded-xl bg-white text-red-600 border-2 border-red-300 font-medium shadow-lg hover:shadow-xl hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 text-sm"
            >
              🗑️ Hapus
            </button>
            <button
              onClick={resetCircuit}
              className="px-3 py-2 rounded-xl bg-white text-orange-600 border-2 border-orange-300 font-medium shadow-lg hover:shadow-xl hover:bg-orange-50 transition-all duration-200 text-sm"
            >
              ↺ Reset
            </button>
            {isMobile && (
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-3 py-2 rounded-xl bg-white text-slate-600 border-2 border-slate-300 font-medium shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-200 text-sm"
              >
                📊 Stats
              </button>
            )}
          </div>
        </div>

        {/* Circuit Stats */}
        {showStats && (
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
                Resistansi
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

        {/* Topology Detection Display */}
        {showStats && calc.topology && (
          <div className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border-2 border-emerald-200 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-2xl">
                {calc.topology.type === "series" && "📏"}
                {calc.topology.type === "parallel" && "🔀"}
                {calc.topology.type === "mixed" && "🔄"}
              </div>
              <div className="flex-1">
                <div className="text-xs text-emerald-700 font-medium">
                  Topologi Rangkaian
                </div>
                <div className="text-lg font-bold text-emerald-900">
                  {calc.topology.type === "series" && "Seri"}
                  {calc.topology.type === "parallel" && "Paralel"}
                  {calc.topology.type === "mixed" &&
                    "Campuran (Seri + Paralel)"}
                </div>
              </div>
              {/* Indicator Percabangan */}
              {calc.topology.hasParallelBranch && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-lg border border-blue-300">
                  <span className="text-lg">🌿</span>
                  <span className="text-xs text-blue-700 font-semibold">
                    Percabangan Terdeteksi
                  </span>
                </div>
              )}
            </div>

            {/* Branch Nodes Info */}
            {calc.topology.branchNodes && calc.topology.branchNodes.length > 0 && (
              <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-700 font-semibold mb-1">
                  🔍 Node Percabangan (Degree &gt; 2):
                </div>
                <div className="flex flex-wrap gap-1">
                  {calc.topology.branchNodes.map((node, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-mono"
                    >
                      {node}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  💡 Node ini terhubung ke lebih dari 2 terminal (terjadi percabangan paralel)
                </div>
              </div>
            )}

            {/* Groups Details */}
            {calc.topology.groups && calc.topology.groups.length > 0 && (
              <div className="space-y-2 mt-3">
                <div className="text-xs text-emerald-700 font-semibold mb-2">
                  Detail Grup Komponen:
                </div>
                {calc.topology.groups.map((group, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-3 border border-emerald-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-sm text-emerald-800">
                        {group.type === "parallel"
                          ? "🔀 Grup Paralel"
                          : "📏 Grup Seri"}{" "}
                        #{idx + 1}
                      </div>
                      <div className="text-xs text-blue-600 font-bold">
                        Arus: {group.current.toFixed(3)} A
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.elements.map((elem) => (
                        <div
                          key={elem.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-md text-xs"
                        >
                          <span>
                            {elem.type === "battery" && "🔋"}
                            {elem.type === "resistor" && "⚡"}
                            {elem.type === "lamp" && "💡"}
                            {elem.type === "switch" && "🔘"}
                          </span>
                          <span className="font-medium text-slate-700">
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
                              <span className="text-blue-500 font-bold ml-1">
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
                      <div className="mt-2 text-xs text-slate-600">
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
          className="relative border-4 border-dashed border-slate-300 rounded-2xl overflow-hidden bg-white shadow-inner mx-auto"
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
            backgroundImage: `
              radial-gradient(circle, rgba(148, 163, 184, 0.15) 1px, transparent 1px),
              linear-gradient(to right, rgba(148, 163, 184, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148, 163, 184, 0.05) 1px, transparent 1px)
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
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border-2 border-cyan-200">
            <h4 className="text-sm font-bold text-cyan-900 mb-2 flex items-center">
              <span className="text-lg mr-2">💡</span>
              Panduan Cepat
            </h4>
            <div className="space-y-2 text-xs text-cyan-800">
              <div className="font-semibold text-cyan-900">📦 Komponen:</div>
              <div>• Tambahkan Baterai, Lampu, Resistor, Saklar, dan Kabel</div>
              <div>• Drag komponen untuk memindahkan posisi</div>

              <div className="font-semibold text-cyan-900 mt-2">
                🔗 Koneksi dengan Kabel:
              </div>
              <div>• Tambahkan item &quot;Kabel&quot; ke canvas</div>
              <div>• Aktifkan &quot;Mode Koneksi&quot;</div>
              <div>• Klik terminal Kabel (ujung A atau B)</div>
              <div>• Lalu klik terminal Komponen (Baterai, Lampu, dll)</div>
              <div>• Ulangi untuk ujung kabel lainnya</div>

              <div className="font-semibold text-cyan-900 mt-2">
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
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border-2 border-orange-200 text-center">
              <p className="text-sm font-medium text-orange-900">
                👆 Mulai dengan menambahkan komponen di atas!
              </p>
            </div>
          )}

          {!calc.isClosed &&
            elements.length > 0 &&
            elements.filter((e) => e.type === "wire").length === 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border-2 border-yellow-300">
                <p className="text-sm font-medium text-yellow-900">
                  ⚠️ Tambahkan item &quot;Kabel&quot; untuk menghubungkan
                  komponen!
                </p>
              </div>
            )}

          {!calc.isClosed && wires.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border-2 border-yellow-300">
              <p className="text-sm font-medium text-yellow-900">
                ⚠️ Rangkaian belum tertutup. Pastikan semua komponen terhubung
                dalam satu loop!
              </p>
            </div>
          )}

          {calc.hasOpenSwitch && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border-2 border-red-300">
              <p className="text-sm font-medium text-red-900">
                🔴 Saklar terbuka! Arus listrik tidak mengalir. Double-click
                saklar untuk menutup.
              </p>
            </div>
          )}

          {calc.isClosed && !calc.hasOpenSwitch && calc.current > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
              <p className="text-sm font-medium text-green-900">
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
