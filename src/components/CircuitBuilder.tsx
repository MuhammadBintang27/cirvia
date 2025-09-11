"use client";

import React, { useMemo, useRef, useState, useCallback } from "react";

// Types
export type ComponentType = "battery" | "resistor" | "lamp" | "switch";

interface Pos {
  x: number;
  y: number;
}

interface Terminal {
  id: "a" | "b";
  // offset from element position (center) in px
  offset: Pos;
}

interface CircuitElement {
  id: string;
  type: ComponentType;
  value: number; // V for battery, Ohm for resistor/lamp. Switch ignores value
  position: Pos; // px inside canvas
  rotation: 0 | 90 | 180 | 270;
  state?: "open" | "closed"; // for switch
  terminals: Terminal[]; // always 2
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

// Constants
const CANVAS_W = 900;
const CANVAS_H = 480;
const GRID = 20;

function snapToGrid(v: number) {
  return Math.round(v / GRID) * GRID;
}

function terminalAbsPos(el: CircuitElement, termId: Terminal["id"]): Pos {
  const t = el.terminals.find((t) => t.id === termId)!;
  let dx = t.offset.x;
  let dy = t.offset.y;
  // handle 90-degree rotations
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
  pos: Pos
): CircuitElement {
  const id = `${type}_${Date.now()}`;
  switch (type) {
    case "battery":
      return {
        id,
        type,
        value: 12, // V
        position: pos,
        rotation: 0,
        terminals: [
          { id: "a", offset: { x: -40, y: 0 } },
          { id: "b", offset: { x: 40, y: 0 } },
        ],
      };
    case "resistor":
      return {
        id,
        type,
        value: 100, // Ohm
        position: pos,
        rotation: 0,
        terminals: [
          { id: "a", offset: { x: -40, y: 0 } },
          { id: "b", offset: { x: 40, y: 0 } },
        ],
      };
    case "lamp":
      return {
        id,
        type,
        value: 50, // Ohm equivalent
        position: pos,
        rotation: 0,
        terminals: [
          { id: "a", offset: { x: -40, y: 0 } },
          { id: "b", offset: { x: 40, y: 0 } },
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
          { id: "a", offset: { x: -40, y: 0 } },
          { id: "b", offset: { x: 40, y: 0 } },
        ],
      };
  }
}

function useDrag() {
  const [dragId, setDragId] = useState<string | null>(null);
  const [offset, setOffset] = useState<Pos>({ x: 0, y: 0 });
  return { dragId, setDragId, offset, setOffset };
}

export default function CircuitBuilder() {
  // State
  const [elements, setElements] = useState<CircuitElement[]>([
    makeElement("battery", "battery", { x: 200, y: 200 }),
    makeElement("resistor", "resistor", { x: 400, y: 200 }),
  ]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [connectMode, setConnectMode] = useState(false);
  const [pending, setPending] = useState<WireEnd | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const drag = useDrag();

  const addComponent = (type: ComponentType) => {
    const center = { x: CANVAS_W / 2, y: 120 };
    setElements((prev) => [...prev, makeElement(type, type, center)]);
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

  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.dragId) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = snapToGrid(e.clientX - rect.left - drag.offset.x);
    const y = snapToGrid(e.clientY - rect.top - drag.offset.y);
    setElements((prev) =>
      prev.map((el) =>
        el.id === drag.dragId
          ? {
              ...el,
              position: {
                x: Math.max(40, Math.min(CANVAS_W - 40, x)),
                y: Math.max(40, Math.min(CANVAS_H - 40, y)),
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
    // ignore same terminal
    if (pending.elementId === elId && pending.terminalId === termId) return;
    const id = `wire_${Date.now()}`;
    setWires((prev) => [
      ...prev,
      { id, from: pending, to: { elementId: elId, terminalId: termId } },
    ]);
    setPending(null);
  };

  // Calculations (simple series loop only)
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
        const p = current * current * el.value; // I^2 R
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
    const w = 100,
      h = 40;
    const isSel = selectedId === el.id;
    const common = "transition-all duration-150";

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
                rx={6}
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
                strokeWidth={3}
              />
              <line
                x1={w / 2 - 12}
                y1={0}
                x2={w / 2}
                y2={0}
                stroke="#374151"
                strokeWidth={3}
              />
              <text
                x={0}
                y={-16}
                textAnchor="middle"
                className="fill-gray-800 font-bold"
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
                rx={6}
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
                strokeWidth={3}
              />
              <line
                x1={w / 2 - 12}
                y1={0}
                x2={w / 2}
                y2={0}
                stroke="#374151"
                strokeWidth={3}
              />
              <text
                x={0}
                y={-16}
                textAnchor="middle"
                className="fill-gray-800 font-bold"
              >
                {el.value}Ω
              </text>
            </g>
          );
        case "lamp": {
          const p = calc.lampPowers[el.id] || 0;
          // brightness map: cap to 1 at, say, 1W reference
          const brightness = Math.min(1, p / 1);
          const fill = `rgba(250, 204, 21, ${0.2 + 0.6 * brightness})`; // amber with glow
          return (
            <g>
              <circle
                r={20}
                className={isSel ? "stroke-yellow-500" : "stroke-yellow-400"}
                fill={fill}
                strokeWidth={3}
              />
              <line
                x1={-w / 2}
                y1={0}
                x2={-20}
                y2={0}
                stroke="#374151"
                strokeWidth={3}
              />
              <line
                x1={20}
                y1={0}
                x2={w / 2}
                y2={0}
                stroke="#374151"
                strokeWidth={3}
              />
              <text
                x={0}
                y={-28}
                textAnchor="middle"
                className="fill-gray-800 font-bold"
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
                strokeWidth={3}
              />
              <line
                x1={10}
                y1={0}
                x2={w / 2}
                y2={0}
                stroke="#374151"
                strokeWidth={3}
              />
              {open ? (
                <line
                  x1={-10}
                  y1={0}
                  x2={10}
                  y2={-12}
                  stroke="#ef4444"
                  strokeWidth={4}
                />
              ) : (
                <line
                  x1={-10}
                  y1={0}
                  x2={10}
                  y2={0}
                  stroke="#10b981"
                  strokeWidth={4}
                />
              )}
              <text
                x={0}
                y={-16}
                textAnchor="middle"
                className="fill-gray-800 font-bold"
              >
                {open ? "Open" : "Closed"}
              </text>
            </g>
          );
        }
      }
    };

    const tA = terminalAbsPos(el, "a");
    const tB = terminalAbsPos(el, "b");

    return (
      <g
        key={el.id}
        className={`cursor-move ${common}`}
        transform={`translate(${el.position.x}, ${el.position.y}) rotate(${el.rotation})`}
        onMouseDown={(e) => onMouseDownElement(e, el.id)}
        onClick={() => setSelectedId(el.id)}
      >
        {/* selection highlight */}
        {isSel && (
          <>
            <rect
              x={-60}
              y={-34}
              width={120}
              height={68}
              rx={10}
              fill="none"
              stroke="#2563eb"
              strokeWidth={3}
              strokeDasharray="6 4"
            />
            <text
              x={0}
              y={-h / 2 - 20}
              textAnchor="middle"
              className="fill-blue-600"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              {el.type.toUpperCase()}
            </text>
          </>
        )}
        {body()}
        {/* terminals */}
        <circle
          r={isSel ? 7.5 : 6}
          cx={-50}
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
          r={isSel ? 7.5 : 6}
          cx={50}
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
            strokeWidth={active ? 4 : 3}
            opacity={active ? 1 : 0.9}
          />
        );
      })}
    </g>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-semibold mr-2">Komponen:</span>
        <button
          onClick={() => addComponent("battery")}
          className="px-3 py-1.5 rounded bg-amber-500 text-white hover:bg-amber-600"
        >
          + Baterai
        </button>
        <button
          onClick={() => addComponent("lamp")}
          className="px-3 py-1.5 rounded bg-yellow-500 text-white hover:bg-yellow-600"
        >
          + Lampu
        </button>
        <button
          onClick={() => addComponent("resistor")}
          className="px-3 py-1.5 rounded bg-red-500 text-white hover:bg-red-600"
        >
          + Resistor
        </button>
        <button
          onClick={() => addComponent("switch")}
          className="px-3 py-1.5 rounded bg-emerald-500 text-white hover:bg-emerald-600"
        >
          + Saklar
        </button>
        <div className="mx-2 h-6 w-px bg-gray-300" />
        <button
          onClick={() => setConnectMode((c) => !c)}
          className={`px-3 py-1.5 rounded ${
            connectMode
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          {connectMode ? "Keluar Mode Koneksi" : "Mode Koneksi (Tarik Kabel)"}
        </button>
        <button
          onClick={rotateSelected}
          className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200"
        >
          ↻ Rotasi
        </button>
        <button
          onClick={deleteSelected}
          className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200"
        >
          Hapus Terpilih
        </button>
        <div className="ml-auto flex gap-2 text-sm">
          <span className="px-2 py-1 rounded bg-gray-100">
            V Total: <b>{calc.totalV.toFixed(2)}V</b>
          </span>
          <span className="px-2 py-1 rounded bg-gray-100">
            R Total: <b>{calc.totalR.toFixed(2)}Ω</b>
          </span>
          <span className="px-2 py-1 rounded bg-gray-100">
            I: <b>{calc.current.toFixed(3)}A</b>
          </span>
          <span className="px-2 py-1 rounded bg-gray-100">
            P: <b>{calc.power.toFixed(2)}W</b>
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: `${GRID}px ${GRID}px`,
        }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={() => setSelectedId(null)}
      >
        <svg width={CANVAS_W} height={CANVAS_H} className="absolute inset-0">
          {renderWires()}
          {elements.map(renderElement)}
        </svg>
      </div>

      {/* Tips */}
      <div className="mt-3 text-sm text-gray-600">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Klik tombol &quot;Mode Koneksi&quot; lalu klik dua terminal untuk
            menarik kabel (wire).
          </li>
          <li>Double-click saklar untuk membuka/menutup.</li>
          <li>
            Pilih komponen lalu klik &quot;↻ Rotasi&quot; untuk memutar arah.
          </li>
          <li>Arus hanya dihitung untuk rangkaian seri tertutup sederhana.</li>
        </ul>
      </div>

      {/* Status */}
      {!calc.looksLikeClosedLoop && (
        <div className="mt-3 p-2 rounded bg-yellow-50 text-yellow-800 border border-yellow-200 text-sm">
          Rangkaian belum tertutup atau terdapat percabangan kompleks. Hubungkan
          semua terminal sehingga membentuk loop seri untuk perhitungan
          otomatis.
        </div>
      )}
      {calc.switchOpen && (
        <div className="mt-2 p-2 rounded bg-blue-50 text-blue-800 border border-blue-200 text-sm">
          Salah satu saklar terbuka. Tutup saklar untuk aliran arus.
        </div>
      )}
    </div>
  );
}
