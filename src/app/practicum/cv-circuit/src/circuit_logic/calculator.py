"""
Circuit Calculator Module
Kalkulator untuk perhitungan rangkaian listrik berdasarkan Hukum Ohm
"""

import math

class CircuitCalculator:
    """Kalkulator rangkaian listrik"""
    
    def __init__(self):
        """Initialize calculator"""
        self.voltage = 0
        self.current = 0
        self.resistance = 0
        self.power = 0
        self.circuit_type = 'open'  # 'series', 'parallel', 'mixed', 'open'
        
    def detect_switch_control(self, hand_landmarks):
        """
        Deteksi kontrol saklar menggunakan gesture jari
        
        Args:
            hand_landmarks: Landmark tangan dari MediaPipe
            
        Returns:
            str: 'ON', 'OFF', atau 'UNCHANGED'
        """
        if not hand_landmarks:
            return 'UNCHANGED'
            
        landmarks = hand_landmarks.landmark
        
        # Cek jari telunjuk tegak (untuk ON)
        index_tip = landmarks[8]
        index_mcp = landmarks[5]
        index_up = index_tip.y < index_mcp.y
        
        # Cek jari tengah tegak (untuk peace sign - OFF)
        middle_tip = landmarks[12]
        middle_mcp = landmarks[9]
        middle_up = middle_tip.y < middle_mcp.y
        
        # Cek jari lain tertutup
        ring_tip = landmarks[16]
        ring_mcp = landmarks[13]
        ring_down = ring_tip.y > ring_mcp.y
        
        pinky_tip = landmarks[20]
        pinky_mcp = landmarks[17]
        pinky_down = pinky_tip.y > pinky_mcp.y
        
        # Peace sign (2 jari) = OFF
        if index_up and middle_up and ring_down and pinky_down:
            return 'OFF'
        # Hanya telunjuk = ON
        elif index_up and not middle_up and ring_down and pinky_down:
            return 'ON'
        else:
            return 'UNCHANGED'
    
    def calculate_circuit(self, circuit_components, wire_connections=None):
        """
        Hitung nilai rangkaian berdasarkan komponen dan koneksi
        
        Args:
            circuit_components: List komponen dalam rangkaian
            wire_connections: List koneksi kabel (opsional)
            
        Returns:
            dict: Hasil perhitungan {voltage, current, resistance, power}
        """
        # Reset values
        self.voltage = 0
        self.current = 0
        self.resistance = 0
        self.power = 0
        self.circuit_type = 'open'
        
        if not circuit_components:
            return self._get_results()
        
        # Identifikasi komponen
        batteries = [c for c in circuit_components if c['type'] == 'battery']
        resistors = [c for c in circuit_components if c['type'] == 'resistor']
        lamps = [c for c in circuit_components if c['type'] == 'lamp']
        switches = [c for c in circuit_components if c['type'] == 'switch']
        
        # Cek apakah ada saklar yang OFF
        if any(s['value'].get('state') == 'OFF' for s in switches):
            self.circuit_type = 'open'
            return self._get_results()
        
        # Cek apakah ada baterai
        if not batteries:
            return self._get_results()
        
        # Hitung total tegangan baterai (asumsi seri untuk sekarang)
        total_voltage = sum(b['value'].get('voltage', 0) for b in batteries)
        
        # Hitung total resistansi
        resistive_components = resistors + lamps
        if not resistive_components:
            return self._get_results()
        
        # Simplified calculation - asumsi rangkaian seri
        total_resistance = sum(r['value'].get('resistance', 0) for r in resistive_components)
        
        if total_resistance > 0:
            self.voltage = total_voltage
            self.resistance = total_resistance
            self.current = self.voltage / self.resistance  # V = I × R
            self.power = self.voltage * self.current        # P = V × I
            self.circuit_type = 'series'
        
        return self._get_results()
    
    def calculate_series_circuit(self, components):
        """
        Hitung rangkaian seri
        
        Args:
            components: List komponen
            
        Returns:
            dict: Hasil perhitungan
        """
        voltage_sources = [c for c in components if c['type'] == 'battery']
        resistive_loads = [c for c in components if c['type'] in ['resistor', 'lamp']]
        
        if not voltage_sources or not resistive_loads:
            return {'voltage': 0, 'current': 0, 'resistance': 0, 'power': 0}
        
        # Total tegangan (semua baterai seri)
        total_voltage = sum(v['value'].get('voltage', 0) for v in voltage_sources)
        
        # Total resistansi (semua resistor seri)
        total_resistance = sum(r['value'].get('resistance', 0) for r in resistive_loads)
        
        if total_resistance == 0:
            return {'voltage': total_voltage, 'current': 0, 'resistance': 0, 'power': 0}
        
        # Hukum Ohm: I = V / R
        current = total_voltage / total_resistance
        power = total_voltage * current
        
        return {
            'voltage': round(total_voltage, 2),
            'current': round(current, 3),
            'resistance': round(total_resistance, 2),
            'power': round(power, 2)
        }
    
    def calculate_parallel_circuit(self, components):
        """
        Hitung rangkaian paralel
        
        Args:
            components: List komponen
            
        Returns:
            dict: Hasil perhitungan
        """
        voltage_sources = [c for c in components if c['type'] == 'battery']
        resistive_loads = [c for c in components if c['type'] in ['resistor', 'lamp']]
        
        if not voltage_sources or not resistive_loads:
            return {'voltage': 0, 'current': 0, 'resistance': 0, 'power': 0}
        
        # Tegangan sama untuk semua cabang paralel
        voltage = max(v['value'].get('voltage', 0) for v in voltage_sources)
        
        # Resistansi paralel: 1/Rtotal = 1/R1 + 1/R2 + ...
        reciprocal_sum = 0
        for r in resistive_loads:
            resistance = r['value'].get('resistance', 0)
            if resistance > 0:
                reciprocal_sum += 1 / resistance
        
        if reciprocal_sum == 0:
            return {'voltage': voltage, 'current': 0, 'resistance': 0, 'power': 0}
        
        total_resistance = 1 / reciprocal_sum
        current = voltage / total_resistance if total_resistance > 0 else 0
        power = voltage * current
        
        return {
            'voltage': round(voltage, 2),
            'current': round(current, 3),
            'resistance': round(total_resistance, 2),
            'power': round(power, 2)
        }
    
    def analyze_circuit_topology(self, components, connections):
        """
        Analisis topologi rangkaian (seri/paralel/campuran)
        
        Args:
            components: List komponen
            connections: List koneksi kabel
            
        Returns:
            str: 'series', 'parallel', 'mixed', 'open'
        """
        # Simplified analysis
        # TODO: Implement proper circuit topology analysis
        if not connections:
            return 'open'
        elif len(connections) == len(components) - 1:
            return 'series'
        else:
            return 'parallel'  # atau 'mixed'
    
    def _get_results(self):
        """Dapatkan hasil perhitungan dalam format dict"""
        return {
            'voltage': round(self.voltage, 2),
            'current': round(self.current, 3),
            'resistance': round(self.resistance, 2),
            'power': round(self.power, 2),
            'circuit_type': self.circuit_type
        }
    
    def get_component_analysis(self, components):
        """
        Analisis individual untuk setiap komponen
        
        Args:
            components: List komponen
            
        Returns:
            dict: Analisis per komponen
        """
        analysis = {}
        
        for component in components:
            comp_id = component['id']
            comp_type = component['type']
            comp_value = component['value']
            
            if comp_type == 'battery':
                analysis[comp_id] = {
                    'type': 'Sumber Tegangan',
                    'voltage': f"{comp_value.get('voltage', 0)}V",
                    'description': 'Menyediakan energi listrik'
                }
            elif comp_type == 'resistor':
                resistance = comp_value.get('resistance', 0)
                voltage_drop = self.current * resistance if hasattr(self, 'current') else 0
                power_dissipated = (self.current ** 2) * resistance if hasattr(self, 'current') else 0
                
                analysis[comp_id] = {
                    'type': 'Resistor',
                    'resistance': f"{resistance}Ω",
                    'voltage_drop': f"{voltage_drop:.2f}V",
                    'power': f"{power_dissipated:.2f}W",
                    'description': 'Menghambat arus listrik'
                }
            elif comp_type == 'lamp':
                resistance = comp_value.get('resistance', 0)
                voltage_drop = self.current * resistance if hasattr(self, 'current') else 0
                power_dissipated = (self.current ** 2) * resistance if hasattr(self, 'current') else 0
                brightness = min(100, (power_dissipated / 10) * 100)  # Simplified brightness calculation
                
                analysis[comp_id] = {
                    'type': 'Lampu',
                    'resistance': f"{resistance}Ω",
                    'voltage_drop': f"{voltage_drop:.2f}V",
                    'power': f"{power_dissipated:.2f}W",
                    'brightness': f"{brightness:.0f}%",
                    'description': 'Mengubah energi listrik menjadi cahaya'
                }
            elif comp_type == 'switch':
                state = comp_value.get('state', 'OFF')
                analysis[comp_id] = {
                    'type': 'Saklar',
                    'state': state,
                    'description': 'Memutus/menyambung arus listrik'
                }
        
        return analysis
