import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";

// Types
export type ComponentType = "battery" | "resistor" | "lamp" | "switch";

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
}

interface WireEnd {
  elementId: string;
  terminalId: Terminal["id"];
}

interface Wire {
  id: string;
  from: WireEnd;
  to: WireEnd;
}

// Responsive constants
const getCanvasSize = (isMobile: boolean) => ({
  width: isMobile ? 350 : 900,
  height: isMobile ? 300 : 480,
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
    case 0:
      break;
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
  baseId: string,
  pos: Pos,
  isMobile: boolean
): CircuitElement {
  const id = `${type}_${Date.now()}`;
  // Scale terminal offsets for mobile
  const terminalOffset = isMobile ? 30 : 40;
  
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
  }
}

function useDrag() {
  const [dragId, setDragId] = useState<string | null>(null);
  const [offset, setOffset] = useState<Pos>({ x: 0, y: 0 });
  return { dragId, setDragId, offset, setOffset };
}

// Hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export default function CircuitBuilder() {
  const isMobile = useIsMobile();
  const canvasSize = getCanvasSize(isMobile);
  
  // State
  const [elements, setElements] = useState<CircuitElement[]>(() => [
    makeElement("battery", "battery", { x: isMobile ? 120 : 200, y: isMobile ? 150 : 200 }, isMobile),
    makeElement("resistor", "resistor", { x: isMobile ? 230 : 400, y: isMobile ? 150 : 200 }, isMobile),
  ]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [connectMode, setConnectMode] = useState(false);
  const [pending, setPending] = useState<WireEnd | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(!isMobile);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const drag = useDrag();

  // Update canvas size when mobile state changes
  useEffect(() => {
    const newCanvasSize = getCanvasSize(isMobile);
    setElements(prev => prev.map(el => ({
      ...el,
      position: {
        x: Math.max(40, Math.min(newCanvasSize.width - 40, el.position.x)),
        y: Math.max(40, Math.min(newCanvasSize.height - 40, el.position.y))
      }
    })));
  }, [isMobile]);

  const addComponent = (type: ComponentType) => {
    const center = { 
      x: canvasSize.width / 2, 
      y: isMobile ? 80 : 120 
    };
    setElements((prev) => [...prev, makeElement(type, type, center, isMobile)]);
  };

  const onMouseDownElement = (e: React.MouseEvent, id: string) => {
    if (connectMode) return;
    e.stopPropagation();
    const rect = canvasRef.current!.getBoundingClientRect();
    const el = elements.find((el) => el.id === id)!;
    drag.setDragId(id);
    drag.setOffset({
      x: e.clientX - rect.left - el.position.x,
      y: e.clientY - rect.top - el.position.y,
    });
    setSelectedId(id);
  };

  // Touch support for mobile
  const onTouchStartElement = (e: React.TouchEvent, id: string) => {
    if (connectMode) return;
    e.stopPropagation();
    const rect = canvasRef.current!.getBoundingClientRect();
    const touch = e.touches[0];
    const el = elements.find((el) => el.id === id)!;
    drag.setDragId(id);
    drag.setOffset({
      x: touch.clientX - rect.left - el.position.x,
      y: touch.clientY - rect.top - el.position.y,
    });
    setSelectedId(id);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.dragId) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = snapToGrid(e.clientX - rect.left - drag.offset.x);
    const y = snapToGrid(e.clientY - rect.top - drag.offset.y);
    updateElementPosition(x, y);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!drag.dragId) return;
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const touch = e.touches[0];
    const x = snapToGrid(touch.clientX - rect.left - drag.offset.x);
    const y = snapToGrid(touch.clientY - rect.top - drag.offset.y);
    updateElementPosition(x, y);
  };

  const updateElementPosition = (x: number, y: number) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === drag.dragId
          ? {
              ...el,
              position: {
                x: Math.max(40, Math.min(canvasSize.width - 40, x)),
                y: Math.max(40, Math.min(canvasSize.height - 40, y)),
              },
            }
          : el
      )
    );
  };

  const onMouseUp = () => {
    drag.setDragId(null);
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
  };

  const toggleSwitch = (id: string) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? { ...el, state: el.state === "open" ? "closed" : "open" }
          : el
      )
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setWires((prev) =>
      prev.filter(
        (w) => w.from.elementId !== selectedId && w.to.elementId !== selectedId
      )
    );
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const onClickTerminal = (elId: string, termId: Terminal["id"]) => {
    if (!connectMode) return;
    if (!pending) {
      setPending({ elementId: elId, terminalId: termId });
      return;
    }
    if (pending.elementId === elId && pending.terminalId === termId) return;
    const id = `wire_${Date.now()}`;
    setWires((prev) => [
      ...prev,
      { id, from: pending, to: { elementId: elId, terminalId: termId } },
    ]);
    setPending(null);
  };

  // Calculations
  const calc = useMemo(() => {
    const totalV = elements
      .filter((e) => e.type === "battery")
      .reduce((s, b) => s + b.value, 0);
    const switchOpen = elements.some(
      (e) => e.type === "switch" && e.state === "open"
    );
    const totalR = elements
      .filter((e) => e.type === "resistor" || e.type === "lamp")
      .reduce((s, r) => s + r.value, 0);

    const allHaveTwoConnections = elements.every((e) => {
      const degA = wires.filter(
        (w) =>
          (w.from.elementId === e.id && w.from.terminalId === "a") ||
          (w.to.elementId === e.id && w.to.terminalId === "a")
      ).length;
      const degB = wires.filter(
        (w) =>
          (w.from.elementId === e.id && w.from.terminalId === "b") ||
          (w.to.elementId === e.id && w.to.terminalId === "b")
      ).length;
      return degA === 1 && degB === 1;
    });

    const looksLikeClosedLoop =
      allHaveTwoConnections && wires.length >= elements.length;

    let current = 0;
    if (!switchOpen && totalR > 0 && looksLikeClosedLoop) {
      current = totalV / totalR;
    }
    const power = totalV * current;

    const lampPowers: Record<string, number> = {};
    for (const el of elements) {
      if (el.type === "lamp") {
        const p = current * current * el.value;
        lampPowers[el.id] = p;
      }
    }

    return {
      totalV,
      totalR,
      current,
      power,
      lampPowers,
      looksLikeClosedLoop,
      switchOpen,
    };
  }, [elements, wires]);

  // Rendering helpers
  const renderElement = (el: CircuitElement) => {
    const w = isMobile ? 70 : 100;
    const h = isMobile ? 30 : 40;
    const isSel = selectedId === el.id;
    const common = "transition-all duration-150";
    const fontSize = isMobile ? 10 : 12;

    const body = () => {
      switch (el.type) {
        case "battery":
          return (
            <g>
              <rect
                x={-w / 2 + 12}
                y={-h / 2}
                width={w - 24}
                height={h}
                rx={4}
                className={
                  isSel
                    ? "fill-yellow-200 stroke-yellow-500"
                    : "fill-amber-100 stroke-amber-400"
                }
                strokeWidth={2}
              />
              <line
                x1={-w / 2}
                y1={0}
                x2={-w / 2 + 12}
                y2={0}
                stroke="#374151"
                strokeWidth={2}
              />
              <line
                x1={w / 2 - 12}
                y1={0}
                x2={w / 2}
                y2={0}
                stroke="#374151"
                strokeWidth={2}
              />
              <text
                x={0}
                y={isMobile ? -12 : -16}
                textAnchor="middle"
                className="fill-gray-800 font-bold"
                fontSize={fontSize}
              >
                {el.value}V
              </text>
            </g>
          );
        case "resistor":
          return (
            <g>
              <rect
                x={-w / 2 + 12}
                y={-h / 2}
                width={w - 24}
                height={h}
                rx={4}
                className={
                  isSel
                    ? "fill-red-200 stroke-red-500"
                    : "fill-red-100 stroke-red-400"
                }
                strokeWidth={2}
              />
              <line
                x1={-w / 2}
                y1={0}
                x2={-w / 2 + 12}
                y2={0}
                stroke="#374151"
                strokeWidth={2}
              />
              <line
                x1={w / 2 - 12}
                y1={0}
                x2={w / 2}
                y2={0}
                stroke="#374151"
                strokeWidth={2}
              />
              <text
                x={0}
                y={isMobile ? -12 : -16}
                textAnchor="middle"
                className="fill-gray-800 font-bold"
                fontSize={fontSize}
              >
                {el.value}Ω
              </text>
            </g>
          );
        case "lamp": {
          const p = calc.lampPowers[el.id] || 0;
          const brightness = Math.min(1, p / 1);
          const fill = `rgba(250, 204, 21, ${0.2 + 0.6 * brightness})`;
          const circleRadius = isMobile ? 15 : 20;
          return (
            <g>
              <circle
                r={circleRadius}
                className={isSel ? "stroke-yellow-500" : "stroke-yellow-400"}
                fill={fill}
                strokeWidth={2}
              />
              <line
                x1={-w / 2}
                y1={0}
                x2={-circleRadius}
                y2={0}
                stroke="#374151"
                strokeWidth={2}
              />
              <line
                x1={circleRadius}
                y1={0}
                x2={w / 2}
                y2={0}
                stroke="#374151"
                strokeWidth={2}
              />
              <text
                x={0}
                y={isMobile ? -20 : -28}
                textAnchor="middle"
                className="fill-gray-800 font-bold"
                fontSize={fontSize}
              >
                Lamp
              </text>
            </g>
          );
        }
        case "switch": {
          const open = el.state !== "closed";
          return (
            <g
              onDoubleClick={() => toggleSwitch(el.id)}
              className="cursor-pointer"
            >
              <line
                x1={-w / 2}
                y1={0}
                x2={-10}
                y2={0}
                stroke="#374151"
                strokeWidth={2}
              />
              <line
                x1={10}
                y1={0}
                x2={w / 2}
                y2={0}
                stroke="#374151"
                strokeWidth={2}
              />
              {open ? (
                <line
                  x1={-10}
                  y1={0}
                  x2={10}
                  y2={isMobile ? -8 : -12}
                  stroke="#ef4444"
                  strokeWidth={3}
                />
              ) : (
                <line
                  x1={-10}
                  y1={0}
                  x2={10}
                  y2={0}
                  stroke="#10b981"
                  strokeWidth={3}
                />
              )}
              <text
                x={0}
                y={isMobile ? -12 : -16}
                textAnchor="middle"
                className="fill-gray-800 font-bold"
                fontSize={fontSize}
              >
                {open ? "Open" : "Closed"}
              </text>
            </g>
          );
        }
      }
    };

    const terminalRadius = isMobile ? 5 : 6;
    const terminalOffset = isMobile ? 37 : 50;

    return (
      <g
        key={el.id}
        className={`cursor-move ${common}`}
        transform={`translate(${el.position.x}, ${el.position.y}) rotate(${el.rotation})`}
        onMouseDown={(e) => onMouseDownElement(e, el.id)}
        onTouchStart={(e) => onTouchStartElement(e, el.id)}
        onClick={() => setSelectedId(el.id)}
      >
        {isSel && (
          <>
            <rect
              x={isMobile ? -45 : -60}
              y={isMobile ? -25 : -34}
              width={isMobile ? 90 : 120}
              height={isMobile ? 50 : 68}
              rx={8}
              fill="none"
              stroke="#2563eb"
              strokeWidth={2}
              strokeDasharray="4 2"
            />
            <text
              x={0}
              y={-h / 2 - (isMobile ? 14 : 20)}
              textAnchor="middle"
              className="fill-blue-600"
              fontSize={isMobile ? 8 : 12}
              fontWeight={600}
            >
              {el.type.toUpperCase()}
            </text>
          </>
        )}
        {body()}
        <circle
          r={isSel ? terminalRadius + 1 : terminalRadius}
          cx={-terminalOffset}
          cy={0}
          className={connectMode || isSel ? "fill-blue-500" : "fill-gray-500"}
          stroke={isSel ? "#ffffff" : undefined}
          strokeWidth={isSel ? 2 : undefined}
          onClick={(e) => {
            e.stopPropagation();
            onClickTerminal(el.id, "a");
          }}
        />
        <circle
          r={isSel ? terminalRadius + 1 : terminalRadius}
          cx={terminalOffset}
          cy={0}
          className={connectMode || isSel ? "fill-blue-500" : "fill-gray-500"}
          stroke={isSel ? "#ffffff" : undefined}
          strokeWidth={isSel ? 2 : undefined}
          onClick={(e) => {
            e.stopPropagation();
            onClickTerminal(el.id, "b");
          }}
        />
      </g>
    );
  };

  const renderWires = () => (
    <g>
      {wires.map((w) => {
        const fromEl = elements.find((e) => e.id === w.from.elementId);
        const toEl = elements.find((e) => e.id === w.to.elementId);
        if (!fromEl || !toEl) return null;
        const a = terminalAbsPos(fromEl, w.from.terminalId);
        const b = terminalAbsPos(toEl, w.to.terminalId);
        const active =
          selectedId &&
          (w.from.elementId === selectedId || w.to.elementId === selectedId);
        return (
          <line
            key={w.id}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={active ? "#2563eb" : "#374151"}
            strokeWidth={active ? (isMobile ? 3 : 4) : (isMobile ? 2 : 3)}
            opacity={active ? 1 : 0.9}
          />
        );
      })}
    </g>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-2 sm:p-4 w-full max-w-full overflow-hidden">
      {/* Mobile-responsive Toolbar */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3">
          <span className="font-semibold text-xs sm:text-sm mr-1">Komponen:</span>
          <button
            onClick={() => addComponent("battery")}
            className="px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-amber-500 text-white hover:bg-amber-600 text-xs sm:text-sm"
          >
            + Baterai
          </button>
          <button
            onClick={() => addComponent("lamp")}
            className="px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-xs sm:text-sm"
          >
            + Lampu
          </button>
          <button
            onClick={() => addComponent("resistor")}
            className="px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-red-500 text-white hover:bg-red-600 text-xs sm:text-sm"
          >
            + Resistor
          </button>
          <button
            onClick={() => addComponent("switch")}
            className="px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-emerald-500 text-white hover:bg-emerald-600 text-xs sm:text-sm"
          >
            + Saklar
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <button
            onClick={() => setConnectMode((c) => !c)}
            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm ${
              connectMode
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            {connectMode ? "Keluar Koneksi" : "Mode Koneksi"}
          </button>
          <button
            onClick={rotateSelected}
            className="px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm"
          >
            ↻ Rotasi
          </button>
          <button
            onClick={deleteSelected}
            className="px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm"
          >
            Hapus
          </button>
          {isMobile && (
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-xs"
            >
              Stats
            </button>
          )}
        </div>
      </div>

      {/* Stats - Responsive layout */}
      {showStats && (
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:flex gap-1 sm:gap-2 text-xs sm:text-sm">
            <span className="px-2 py-1 rounded bg-gray-100">
              V: <b>{calc.totalV.toFixed(1)}V</b>
            </span>
            <span className="px-2 py-1 rounded bg-gray-100">
              R: <b>{calc.totalR.toFixed(1)}Ω</b>
            </span>
            <span className="px-2 py-1 rounded bg-gray-100">
              I: <b>{calc.current.toFixed(3)}A</b>
            </span>
            <span className="px-2 py-1 rounded bg-gray-100">
              P: <b>{calc.power.toFixed(2)}W</b>
            </span>
          </div>
        </div>
      )}

      {/* Canvas - Responsive */}
      <div
        ref={canvasRef}
        className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden mx-auto"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: `${GRID}px ${GRID}px`,
        }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchMove={onTouchMove}
        onTouchEnd={onMouseUp}
        onClick={() => setSelectedId(null)}
      >
        <svg width={canvasSize.width} height={canvasSize.height} className="absolute inset-0">
          {renderWires()}
          {elements.map(renderElement)}
        </svg>
      </div>

      {/* Tips - Mobile optimized */}
      <div className="mt-3 text-xs sm:text-sm text-gray-600">
        <div className="space-y-1">
          <div>• Mode Koneksi: klik terminal untuk menghubungkan kabel</div>
          <div>• Double-tap saklar untuk buka/tutup</div>
          {!isMobile && <div>• Pilih komponen lalu klik &quot;↻ Rotasi&quot;</div>}
        </div>
      </div>

      {/* Status messages */}
      {!calc.looksLikeClosedLoop && (
        <div className="mt-3 p-2 rounded bg-yellow-50 text-yellow-800 border border-yellow-200 text-xs sm:text-sm">
          Rangkaian belum tertutup. Hubungkan semua terminal untuk perhitungan otomatis.
        </div>
      )}
      {calc.switchOpen && (
        <div className="mt-2 p-2 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs sm:text-sm">
          Salah satu saklar terbuka. Tutup saklar untuk aliran arus.
        </div>
      )}
    </div>
  );
}