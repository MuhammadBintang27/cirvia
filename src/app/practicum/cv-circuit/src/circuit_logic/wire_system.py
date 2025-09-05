"""
Wire System Module
Sistem untuk membuat dan mengelola koneksi kabel
"""

import pygame
import math

class WireSystem:
    """Sistem untuk mengelola kabel dan koneksi"""
    
    def __init__(self):
        """Initialize wire system"""
        self.wires = []
        self.active_wire = None
        self.connection_threshold = 30  # Jarak untuk deteksi koneksi (pixel)
        
    def start_wire_placement(self, start_pos):
        """
        Mulai penempatan kabel baru
        
        Args:
            start_pos: Tuple (x, y) posisi awal kabel
        """
        self.active_wire = {
            'id': len(self.wires),
            'start_pos': start_pos,
            'end_pos': start_pos,
            'start_connection': None,
            'end_connection': None,
            'is_connected': False,
            'color': (255, 255, 0)  # Kuning untuk kabel yang sedang ditarik
        }
        
    def update_wire_end(self, end_pos):
        """
        Update posisi ujung kabel yang sedang aktif
        
        Args:
            end_pos: Tuple (x, y) posisi ujung kabel
        """
        if self.active_wire:
            self.active_wire['end_pos'] = end_pos
    
    def finish_wire_placement(self):
        """Selesaikan penempatan kabel"""
        if self.active_wire:
            # Tambahkan ke daftar kabel
            self.wires.append(self.active_wire.copy())
            self.active_wire = None
            return len(self.wires) - 1  # Return wire ID
        return None
    
    def cancel_wire_placement(self):
        """Batalkan penempatan kabel"""
        self.active_wire = None
    
    def detect_wire_rotation(self, pinch_pos):
        """
        Deteksi rotasi ujung kabel berdasarkan posisi pinch
        
        Args:
            pinch_pos: Tuple (x, y) posisi pinch
            
        Returns:
            str: 'start', 'end', atau None
        """
        if not self.active_wire or not pinch_pos:
            return None
            
        start_pos = self.active_wire['start_pos']
        end_pos = self.active_wire['end_pos']
        
        dist_to_start = self._calculate_distance(pinch_pos, start_pos)
        dist_to_end = self._calculate_distance(pinch_pos, end_pos)
        
        if dist_to_start < self.connection_threshold:
            return 'start'
        elif dist_to_end < self.connection_threshold:
            return 'end'
        
        return None
    
    def check_connection(self, components):
        """
        Cek koneksi kabel dengan komponen
        
        Args:
            components: List komponen dalam rangkaian
            
        Returns:
            list: List koneksi yang terdeteksi
        """
        if not self.active_wire:
            return []
            
        connections = []
        start_pos = self.active_wire['start_pos']
        end_pos = self.active_wire['end_pos']
        
        for component in components:
            comp_pos = component['position']
            comp_type = component['type']
            
            # Cek koneksi ujung start
            if self._is_touching(start_pos, comp_pos):
                connections.append({
                    'wire_end': 'start',
                    'component': component,
                    'connection_point': self._get_connection_point(comp_pos, comp_type, start_pos)
                })
            
            # Cek koneksi ujung end
            if self._is_touching(end_pos, comp_pos):
                connections.append({
                    'wire_end': 'end',
                    'component': component,
                    'connection_point': self._get_connection_point(comp_pos, comp_type, end_pos)
                })
        
        return connections
    
    def apply_connections(self, connections):
        """
        Terapkan koneksi ke kabel aktif
        
        Args:
            connections: List koneksi dari check_connection
        """
        if not self.active_wire:
            return
            
        for connection in connections:
            wire_end = connection['wire_end']
            component = connection['component']
            connection_point = connection['connection_point']
            
            if wire_end == 'start':
                self.active_wire['start_connection'] = component['id']
                self.active_wire['start_pos'] = connection_point
            elif wire_end == 'end':
                self.active_wire['end_connection'] = component['id']
                self.active_wire['end_pos'] = connection_point
        
        # Cek apakah kabel sudah terhubung penuh
        if (self.active_wire['start_connection'] is not None and 
            self.active_wire['end_connection'] is not None):
            self.active_wire['is_connected'] = True
            self.active_wire['color'] = (0, 255, 0)  # Hijau jika terhubung
    
    def render_wires(self, screen):
        """
        Render semua kabel
        
        Args:
            screen: Surface pygame
        """
        # Render kabel yang sudah selesai
        for wire in self.wires:
            self._render_single_wire(screen, wire)
        
        # Render kabel aktif (sedang dibuat)
        if self.active_wire:
            self._render_single_wire(screen, self.active_wire, is_active=True)
    
    def _render_single_wire(self, screen, wire, is_active=False):
        """Render satu kabel"""
        start_pos = wire['start_pos']
        end_pos = wire['end_pos']
        color = wire.get('color', (139, 69, 19))  # Coklat default untuk kabel selesai
        
        # Garis kabel dengan efek shadow jika aktif
        line_width = 4 if is_active else 3
        
        if is_active:
            # Shadow untuk kabel aktif
            shadow_color = (100, 100, 100)
            pygame.draw.line(screen, shadow_color, 
                           (start_pos[0]+2, start_pos[1]+2), 
                           (end_pos[0]+2, end_pos[1]+2), line_width)
        
        # Garis kabel utama
        pygame.draw.line(screen, color, start_pos, end_pos, line_width)
        
        # Titik koneksi
        connection_radius = 6 if is_active else 4
        
        # Ujung start
        start_color = (0, 255, 0) if wire.get('start_connection') else (255, 128, 0)
        pygame.draw.circle(screen, start_color, start_pos, connection_radius)
        pygame.draw.circle(screen, (0, 0, 0), start_pos, connection_radius, 2)
        
        # Ujung end
        end_color = (0, 255, 0) if wire.get('end_connection') else (255, 128, 0)
        pygame.draw.circle(screen, end_color, end_pos, connection_radius)
        pygame.draw.circle(screen, (0, 0, 0), end_pos, connection_radius, 2)
        
        # Label jika sedang aktif
        if is_active:
            font = pygame.font.Font(None, 24)
            label = font.render("TARIK UNTUK SAMBUNG KABEL", True, (255, 255, 0))
            # Background semi-transparan untuk label
            label_rect = label.get_rect()
            label_pos = ((start_pos[0] + end_pos[0]) // 2 - label_rect.width//2, 
                        (start_pos[1] + end_pos[1]) // 2 - 30)
            
            # Background gelap untuk kontras
            bg_rect = pygame.Rect(label_pos[0]-5, label_pos[1]-2, 
                                label_rect.width+10, label_rect.height+4)
            pygame.draw.rect(screen, (0, 0, 0, 180), bg_rect)
            screen.blit(label, label_pos)
    
    def _get_connection_point(self, comp_pos, comp_type, wire_pos):
        """
        Dapatkan titik koneksi pada komponen
        
        Args:
            comp_pos: Posisi komponen
            comp_type: Tipe komponen
            wire_pos: Posisi ujung kabel
            
        Returns:
            tuple: Posisi titik koneksi
        """
        # Simplified: gunakan posisi komponen sebagai titik koneksi
        # TODO: Implement proper connection points based on component type
        return comp_pos
    
    def _is_touching(self, pos1, pos2):
        """Cek apakah dua posisi bersentuhan"""
        return self._calculate_distance(pos1, pos2) < self.connection_threshold
    
    def _calculate_distance(self, pos1, pos2):
        """Hitung jarak euclidean"""
        return math.sqrt((pos2[0] - pos1[0])**2 + (pos2[1] - pos1[1])**2)
    
    def get_wires(self):
        """Dapatkan semua kabel"""
        wires = self.wires.copy()
        if self.active_wire:
            wires.append(self.active_wire)
        return wires
    
    def clear(self):
        """Hapus semua kabel"""
        self.wires.clear()
        self.active_wire = None
    
    def remove_wire(self, wire_id):
        """
        Hapus kabel berdasarkan ID
        
        Args:
            wire_id: ID kabel yang akan dihapus
        """
        self.wires = [w for w in self.wires if w.get('id') != wire_id]
    
    def get_connected_components(self):
        """
        Dapatkan komponen yang terhubung melalui kabel
        
        Returns:
            list: List pasangan komponen yang terhubung
        """
        connections = []
        for wire in self.wires:
            if (wire.get('start_connection') is not None and 
                wire.get('end_connection') is not None):
                connections.append({
                    'component1': wire['start_connection'],
                    'component2': wire['end_connection'],
                    'wire_id': wire['id']
                })
        return connections
