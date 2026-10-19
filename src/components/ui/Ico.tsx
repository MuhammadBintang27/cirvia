import {
  Check, X, Lightbulb, Search, Zap, RefreshCw, Sparkles, TriangleAlert, Target, Battery, Wrench, ChartColumn,
  Pointer, Plug, MapPin, FileText, Hand, Grab, ThumbsUp, Trash2, PartyPopper, Gamepad2, Bot, Rocket, ToggleLeft,
  Clock, Ruler, TrendingUp, TrendingDown, Package, Bug, Headphones, Shuffle, Circle, Link, GraduationCap, Save,
  Sun, Car, Waves, Timer, BookOpen, ClipboardList, Eraser, Pause, Square, Star, Download, Route, Trophy, Mouse,
  Globe, Plus, BadgePlus, Tv, Fan, House, Cable, User, ArrowRight, Sprout, Smile, TrainFront, Banknote, Brain,
  Music, Microscope, Volume2, Mic, LifeBuoy, Eye, Pencil, Moon, SkipForward, Flag, MessageCircle, Snail, Wind,
  Ban, Lock, Puzzle, RotateCw, RotateCcw, Shield, CircleHelp, Award,
  type LucideIcon, type LucideProps,
} from "lucide-react";

// Pengganti emoji: satu nama pendek per ikon, supaya data (icon: "battery") tetap berupa string.
const ICONS: Record<string, LucideIcon> = {
  check: Check, x: X, lightbulb: Lightbulb, search: Search, zap: Zap, refresh: RefreshCw, sparkles: Sparkles,
  alert: TriangleAlert, target: Target, battery: Battery, wrench: Wrench, chart: ChartColumn, pointer: Pointer,
  plug: Plug, pin: MapPin, file: FileText, hand: Hand, grab: Grab, "thumbs-up": ThumbsUp, trash: Trash2,
  party: PartyPopper, gamepad: Gamepad2, bot: Bot, rocket: Rocket, switch: ToggleLeft, clock: Clock, ruler: Ruler,
  "trending-up": TrendingUp, "trending-down": TrendingDown, package: Package, bug: Bug, headphones: Headphones,
  shuffle: Shuffle, dot: Circle, link: Link, graduation: GraduationCap, save: Save, sun: Sun, car: Car, waves: Waves,
  timer: Timer, book: BookOpen, clipboard: ClipboardList, eraser: Eraser, pause: Pause, stop: Square, star: Star,
  download: Download, route: Route, trophy: Trophy, mouse: Mouse, globe: Globe, plus: Plus, new: BadgePlus, tv: Tv,
  fan: Fan, home: House, cable: Cable, user: User, "arrow-right": ArrowRight, sprout: Sprout, smile: Smile,
  train: TrainFront, banknote: Banknote, brain: Brain, music: Music, microscope: Microscope, volume: Volume2,
  mic: Mic, lifebuoy: LifeBuoy, eye: Eye, pencil: Pencil, moon: Moon, skip: SkipForward, flag: Flag,
  message: MessageCircle, snail: Snail, wind: Wind, ban: Ban, lock: Lock, puzzle: Puzzle, "rotate-cw": RotateCw,
  "rotate-ccw": RotateCcw, shield: Shield, help: CircleHelp, award: Award,
};

export function Ico({ n, className = "", ...rest }: { n: string } & LucideProps) {
  const Icon = ICONS[n] ?? Sparkles;
  // ukuran mengikuti font induk (1em), kecuali dipakai di dalam <svg> dengan width/height sendiri
  const size = rest.width === undefined ? "inline-block h-[1.1em] w-[1.1em] align-[-0.15em] " : "";
  return <Icon aria-hidden className={size + className} {...rest} />;
}
