"""
Main Interface Module
Interface utama aplikasi Circuit Builder CV dengan visual components yang menarik
"""

import pygame
import cv2
import numpy as np
from .visual_components import ComponentRenderer

class MainInterface:
    """Interface utama aplikasi"""
    
    def __init__(self, screen, screen_width, screen_height):
        """
        Initialize main interface
        
        Args:
            screen: Surface pygame
            screen_width: Lebar layar
            screen_height: Tinggi layar
        """
        self.screen = screen
        self.screen_width = screen_width
        self.screen_height = screen_height
        
        # Area layout
        self.panel_height = 120  # Tingkatkan tinggi panel
        self.info_panel_height = 80
        self.workspace_y = self.panel_height
        self.workspace_height = screen_height - self.panel_height - self.info_panel_height
        
        # Fonts
        self.font_large = pygame.font.Font(None, 28)
        self.font_medium = pygame.font.Font(None, 24)
        self.font_small = pygame.font.Font(None, 20)
        
        # Colors
        self.colors = {
            'background': (30, 30, 40),
            'panel': (50, 50, 70),
            'info_panel': (40, 40, 60),
            'text': (255, 255, 255),
            'accent': (100, 200, 255),
            'success': (100, 255, 100),
            'warning': (255, 200, 100),
            'error': (255, 100, 100)
        }
        
        # Current status
        self.current_calculations = {
            'voltage': 0,
            'current': 0,
            'resistance': 0,
            'power': 0,
            'circuit_type': 'open'
        }
        
        # Pinch status tracking
        self.current_pinch_status = False
        
        # Visual component renderer
        self.renderer = ComponentRenderer()
        
        # Hand tracking overlay
        self.show_hand_overlay = True
        self.pointed_component = None
        
        # Camera display area
        self.camera_width = 200
        self.camera_height = 150
        self.camera_x = screen_width - self.camera_width - 10
        self.camera_y = self.workspace_y + 10
        
    def render(self, frame=None, pinch_data=None, components=None, 
               dragging_component=None, temp_pos=None, wires=None):
        """
        Render seluruh interface
        
        Args:
            frame: Frame kamera
            pinch_data: Data deteksi pinch
            components: List komponen rangkaian
            dragging_component: Komponen yang sedang di-drag
            temp_pos: Posisi temporary saat drag
            wires: List kabel
        """
        # Update pinch status
        self.current_pinch_status = pinch_data['is_pinching'] if pinch_data else False
        
        # Clear screen
        self.screen.fill(self.colors['background'])
        
        # Render panel komponen PERTAMA (di atas semua)
        from .component_panel import ComponentPanel
        if not hasattr(self, 'component_panel'):
            self.component_panel = ComponentPanel(self.screen_width, self.screen_height)
        self.component_panel.render(self.screen)
        
        # Render workspace area
        self._render_workspace()
        
        # Render components
        if components:
            self._render_components(components)
        
        # Render dragging component
        if dragging_component and temp_pos:
            self._render_dragging_component(dragging_component, temp_pos)
        
        # Render wires
        if wires:
            self._render_wires(wires)
        
        # Render hand tracking overlay
        if frame is not None and pinch_data:
            self._render_hand_overlay(pinch_data, components)
        
        # Render camera feed
        if frame is not None:
            self._render_camera_feed(frame, pinch_data)
        
        # Render info panel
        self._render_info_panel()
        
        # Render instructions
        self._render_instructions()
    
    def _render_workspace(self):
        """Render area workspace untuk praktikum"""
        workspace_rect = pygame.Rect(
            0, self.workspace_y, 
            self.screen_width, self.workspace_height
        )
        pygame.draw.rect(self.screen, (40, 40, 50), workspace_rect)
        
        # Grid lines untuk membantu penempatan
        grid_size = 50
        grid_color = (60, 60, 70)
        
        # Vertical lines
        for x in range(0, self.screen_width, grid_size):
            pygame.draw.line(self.screen, grid_color, 
                           (x, self.workspace_y), 
                           (x, self.workspace_y + self.workspace_height))
        
        # Horizontal lines
        for y in range(self.workspace_y, self.workspace_y + self.workspace_height, grid_size):
            pygame.draw.line(self.screen, grid_color, 
                           (0, y), (self.screen_width, y))
        
        # Title workspace
        title = self.font_medium.render("AREA PRAKTIKUM", True, self.colors['text'])
        self.screen.blit(title, (20, self.workspace_y + 10))
    
    def _render_components(self, components):
        """Render komponen yang sudah ditempatkan"""
        for component in components:
            self._render_single_component(component)
    
    def _render_single_component(self, component):
        """Render satu komponen dengan visual yang menarik di area praktikum"""
        pos = component['position']
        comp_type = component['type']
        comp_value = component['value']
        
        # Ukuran komponen yang sedikit lebih besar untuk area praktikum
        size_map = {
            'battery': (80, 50),
            'lamp': (60, 60),
            'resistor': (80, 30),
            'switch': (80, 40),
            'wire': (60, 20)
        }
        
        size = size_map.get(comp_type, (50, 50))
        
        # Tambahkan visual indicator bahwa komponen bisa dipindah
        detection_w = size[0] + 20
        detection_h = size[1] + 20
        
        # Gambar border area yang bisa di-interact (subtle)
        detection_rect = pygame.Rect(
            pos[0] - detection_w//2, pos[1] - detection_h//2, 
            detection_w, detection_h
        )
        pygame.draw.rect(self.screen, (100, 255, 100, 50), detection_rect, 1)  # Hijau transparan
        
        # Gambar komponen menggunakan visual renderer
        if comp_type == 'battery':
            self.renderer.draw_battery(self.screen, pos[0], pos[1], size)
        elif comp_type == 'lamp':
            self.renderer.draw_lamp(self.screen, pos[0], pos[1], size)
        elif comp_type == 'resistor':
            self.renderer.draw_resistor(self.screen, pos[0], pos[1], size)
        elif comp_type == 'switch':
            state = comp_value.get('state', 'OFF')
            self.renderer.draw_switch(self.screen, pos[0], pos[1], size, state)
        elif comp_type == 'wire':
            self.renderer.draw_wire(self.screen, pos[0], pos[1], size)
        
        # Value text dengan background yang jelas
        value_text = self._get_component_value_text(comp_type, comp_value)
        if value_text:
            self.renderer.draw_component_label(self.screen, pos[0], pos[1] + size[1]//2 + 15, 
                                             value_text, self.font_small, (255, 255, 255))
        
        # Tambahkan icon kecil untuk menunjukkan komponen bisa dipindah
        move_icon_color = (100, 255, 100)
        move_icon_size = 8
        # Gambar 4 titik kecil di sudut untuk indicate moveable
        for dx, dy in [(-1, -1), (1, -1), (-1, 1), (1, 1)]:
            icon_x = pos[0] + dx * (size[0]//2 - 5)
            icon_y = pos[1] + dy * (size[1]//2 - 5)
            pygame.draw.circle(self.screen, move_icon_color, (icon_x, icon_y), 3)
    
    def _get_component_value_text(self, comp_type, comp_value):
        """Dapatkan text nilai komponen"""
        if comp_type == 'battery':
            return f"{comp_value.get('voltage', 0)}V"
        elif comp_type == 'resistor':
            return f"{comp_value.get('resistance', 0)}Ω"
        elif comp_type == 'lamp':
            return f"{comp_value.get('resistance', 0)}Ω"
        elif comp_type == 'switch':
            state = comp_value.get('state', 'OFF')
            return f"[{state}]"
        return ""
    
    def _render_dragging_component(self, comp_type, pos):
        """Render komponen yang sedang di-drag dengan visual yang menarik"""
        # Ukuran untuk dragging
        size_map = {
            'battery': (80, 50),
            'lamp': (60, 60),
            'resistor': (80, 30),
            'switch': (80, 40),
            'wire': (60, 20)
        }
        
        size = size_map.get(comp_type, (50, 50))
        
        # Efek glow saat dragging
        for i in range(3):
            glow_alpha = 100 - i * 30
            glow_size = (size[0] + i * 6, size[1] + i * 6)
            glow_rect = pygame.Rect(
                pos[0] - glow_size[0]//2, pos[1] - glow_size[1]//2,
                glow_size[0], glow_size[1]
            )
            pygame.draw.rect(self.screen, (255, 255, 100), glow_rect, 2)
        
        # Gambar komponen dengan semi-transparansi
        temp_surface = pygame.Surface(size, pygame.SRCALPHA)
        
        if comp_type == 'battery':
            self.renderer.draw_battery(temp_surface, size[0]//2, size[1]//2, size)
        elif comp_type == 'lamp':
            self.renderer.draw_lamp(temp_surface, size[0]//2, size[1]//2, size)
        elif comp_type == 'resistor':
            self.renderer.draw_resistor(temp_surface, size[0]//2, size[1]//2, size)
        elif comp_type == 'switch':
            self.renderer.draw_switch(temp_surface, size[0]//2, size[1]//2, size)
        elif comp_type == 'wire':
            self.renderer.draw_wire(temp_surface, size[0]//2, size[1]//2, size)
        
        # Buat semi-transparan
        temp_surface.set_alpha(180)
        
        # Blit ke layar
        self.screen.blit(temp_surface, (pos[0] - size[0]//2, pos[1] - size[1]//2))
        
        # Label "DRAGGING"
        drag_label = self.font_small.render(f"DRAG {comp_type.upper()}", True, self.colors['warning'])
        label_pos = (pos[0] - drag_label.get_width()//2, pos[1] - size[1]//2 - 25)
        self.screen.blit(drag_label, label_pos)
    
    def _render_wires(self, wires):
        """Render kabel"""
        for wire in wires:
            start_pos = wire['start_pos']
            end_pos = wire['end_pos']
            color = wire.get('color', self.colors['text'])
            is_connected = wire.get('is_connected', False)
            
            # Line thickness based on connection status
            line_width = 4 if is_connected else 2
            
            # Draw wire
            pygame.draw.line(self.screen, color, start_pos, end_pos, line_width)
            
            # Connection points
            start_color = self.colors['success'] if wire.get('start_connection') else self.colors['error']
            end_color = self.colors['success'] if wire.get('end_connection') else self.colors['error']
            
            pygame.draw.circle(self.screen, start_color, start_pos, 6)
            pygame.draw.circle(self.screen, end_color, end_pos, 6)
    
    def _render_camera_feed(self, frame, pinch_data):
        """Render feed kamera di sudut kanan atas"""
        # Resize frame
        frame_resized = cv2.resize(frame, (self.camera_width, self.camera_height))
        
        # Convert BGR to RGB
        frame_rgb = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2RGB)
        
        # Convert to pygame surface
        frame_surface = pygame.surfarray.make_surface(frame_rgb.swapaxes(0, 1))
        
        # Border
        camera_rect = pygame.Rect(self.camera_x - 2, self.camera_y - 2, 
                                 self.camera_width + 4, self.camera_height + 4)
        pygame.draw.rect(self.screen, self.colors['panel'], camera_rect)
        
        # Display frame
        self.screen.blit(frame_surface, (self.camera_x, self.camera_y))
        
        # Pinch status overlay
        if pinch_data:
            status_color = self.colors['success'] if pinch_data['is_pinching'] else self.colors['error']
            status_text = "PINCH" if pinch_data['is_pinching'] else "OPEN"
            
            status_surface = self.font_small.render(status_text, True, status_color)
            self.screen.blit(status_surface, (self.camera_x + 5, self.camera_y + 5))
    
    def _render_info_panel(self):
        """Render panel informasi perhitungan"""
        info_y = self.screen_height - self.info_panel_height
        
        # Background
        info_rect = pygame.Rect(0, info_y, self.screen_width, self.info_panel_height)
        pygame.draw.rect(self.screen, self.colors['info_panel'], info_rect)
        pygame.draw.line(self.screen, self.colors['accent'], 
                        (0, info_y), (self.screen_width, info_y), 2)
        
        # Title
        title = self.font_medium.render("HASIL PERHITUNGAN HUKUM OHM", True, self.colors['text'])
        self.screen.blit(title, (20, info_y + 10))
        
        # Calculation values
        calc = self.current_calculations
        
        values = [
            f"V = {calc['voltage']}V",
            f"I = {calc['current']}A", 
            f"R = {calc['resistance']}Ω",
            f"P = {calc['power']}W"
        ]
        
        x_positions = [20, 150, 280, 410]
        for i, (value, x_pos) in enumerate(zip(values, x_positions)):
            color = self.colors['success'] if calc['voltage'] > 0 else self.colors['text']
            value_surface = self.font_medium.render(value, True, color)
            self.screen.blit(value_surface, (x_pos, info_y + 40))
        
        # Circuit type
        circuit_type = calc['circuit_type'].upper()
        type_color = {
            'SERIES': self.colors['success'],
            'PARALLEL': self.colors['warning'],
            'OPEN': self.colors['error']
        }.get(circuit_type, self.colors['text'])
        
        type_text = f"Rangkaian: {circuit_type}"
        type_surface = self.font_medium.render(type_text, True, type_color)
        self.screen.blit(type_surface, (550, info_y + 40))
    
    def _render_instructions(self):
        """Render instruksi penggunaan dengan tampilan yang lebih jelas"""
        # Background untuk instruksi
        instruction_bg = pygame.Rect(10, self.workspace_y + self.workspace_height - 120, 400, 110)
        pygame.draw.rect(self.screen, (0, 0, 0, 200), instruction_bg)
        pygame.draw.rect(self.screen, self.colors['accent'], instruction_bg, 2)
        
        # Title instruksi
        title = self.font_medium.render("PANDUAN PENGGUNAAN:", True, self.colors['warning'])
        self.screen.blit(title, (15, self.workspace_y + self.workspace_height - 115))
        
        instructions = [
            "🤏 PINCH: Pilih & drag komponen dari panel atas",
            "☝️ TELUNJUK: Hidupkan saklar (ON)",
            "✌️ PEACE: Matikan saklar (OFF)", 
            "⌨️ ESC: Keluar | R: Reset rangkaian"
        ]
        
        y_start = self.workspace_y + self.workspace_height - 90
        for i, instruction in enumerate(instructions):
            # Background untuk setiap instruksi
            text_surface = self.font_small.render(instruction, True, self.colors['text'])
            text_bg = pygame.Rect(15, y_start + i * 18 - 1, text_surface.get_width() + 4, 16)
            pygame.draw.rect(self.screen, (40, 40, 40), text_bg)
            self.screen.blit(text_surface, (17, y_start + i * 18))
        
        # Status pinch di sudut kanan bawah
        if hasattr(self, 'current_pinch_status'):
            status_text = f"PINCH: {'AKTIF' if self.current_pinch_status else 'TIDAK AKTIF'}"
            status_color = self.colors['success'] if self.current_pinch_status else self.colors['error']
            status_surface = self.font_small.render(status_text, True, status_color)
            status_pos = (self.screen_width - status_surface.get_width() - 10, 
                         self.screen_height - status_surface.get_height() - 10)
            self.screen.blit(status_surface, status_pos)
    
    def update_calculations(self, calculations):
        """
        Update hasil perhitungan
        
        Args:
            calculations: Dict hasil perhitungan
        """
        self.current_calculations.update(calculations)
    
    def _render_hand_overlay(self, pinch_data, components):
        """Render overlay hand tracking di workspace dengan feedback visual"""
        if not pinch_data:
            return
            
        # Posisi pinch di workspace
        pinch_pos = pinch_data['position']
        workspace_rect = self.get_workspace_area()
        
        # Hanya render jika di area workspace (bukan panel komponen)
        if pinch_pos[1] > self.panel_height:
            
            # Warna berdasarkan status pinch
            if pinch_data['is_pinching']:
                color = (0, 255, 0)  # Hijau untuk pinch aktif
                status_text = "PINCH AKTIF"
                circle_radius = 15
            else:
                color = (255, 100, 100)  # Merah untuk open
                status_text = "TANGAN TERDETEKSI"
                circle_radius = 25
            
            # Crosshair besar di posisi pinch
            crosshair_size = 30
            pygame.draw.line(self.screen, color,
                           (pinch_pos[0] - crosshair_size, pinch_pos[1]),
                           (pinch_pos[0] + crosshair_size, pinch_pos[1]), 4)
            pygame.draw.line(self.screen, color,
                           (pinch_pos[0], pinch_pos[1] - crosshair_size),
                           (pinch_pos[0], pinch_pos[1] + crosshair_size), 4)
            
            # Lingkaran di sekitar posisi
            pygame.draw.circle(self.screen, color, pinch_pos, circle_radius, 3)
            
            # Animasi ripple effect untuk pinch
            if pinch_data['is_pinching']:
                for i in range(3):
                    ripple_radius = circle_radius + (i * 10)
                    ripple_alpha = 255 - (i * 80)
                    ripple_color = (*color, ripple_alpha)
                    pygame.draw.circle(self.screen, color, pinch_pos, ripple_radius, 2)
            
            # Status text dengan background
            distance = pinch_data.get('distance', 0)
            confidence = pinch_data.get('confidence', 0)
            
            status_lines = [
                status_text,
                f"Jarak: {distance:.1f}px",
                f"Posisi: ({pinch_pos[0]}, {pinch_pos[1]})",
                f"Confidence: {confidence:.2f}"
            ]
            
            # Background untuk status text
            text_width = max([self.font_small.size(line)[0] for line in status_lines])
            text_height = len(status_lines) * 18
            text_bg = pygame.Rect(pinch_pos[0] + 40, pinch_pos[1] - 30, 
                                 text_width + 10, text_height + 10)
            pygame.draw.rect(self.screen, (0, 0, 0, 200), text_bg)
            pygame.draw.rect(self.screen, color, text_bg, 2)
            
            # Render status text
            for i, line in enumerate(status_lines):
                text_surface = self.font_small.render(line, True, (255, 255, 255))
                self.screen.blit(text_surface, (pinch_pos[0] + 45, pinch_pos[1] - 25 + i * 18))
            
            # Cek apakah menunjuk komponen tertentu
            pointed_component = self._get_pointed_component(pinch_pos, components)
            if pointed_component:
                self._highlight_pointed_component(pointed_component, pinch_data['is_pinching'])
        
        # Render landmark jari jika tersedia
        if 'thumb_pos' in pinch_data and 'index_pos' in pinch_data:
            self._render_finger_landmarks(pinch_data)
    
    def _get_pointed_component(self, pinch_pos, components):
        """Cek komponen mana yang ditunjuk oleh posisi pinch"""
        if not components:
            return None
            
        for component in components:
            comp_pos = component['position']
            comp_type = component['type']
            
            # Ukuran area deteksi berdasarkan tipe komponen
            detection_radius = 40  # Radius deteksi
            
            # Hitung jarak dari pinch ke komponen
            distance = ((pinch_pos[0] - comp_pos[0])**2 + (pinch_pos[1] - comp_pos[1])**2)**0.5
            
            if distance <= detection_radius:
                return component
        
        return None
    
    def _highlight_pointed_component(self, component, is_pinching):
        """Highlight komponen yang sedang ditunjuk"""
        pos = component['position']
        comp_type = component['type']
        
        # Warna highlight
        if is_pinching:
            highlight_color = (255, 255, 0)  # Kuning untuk pinch
            effect_text = "MENGAMBIL"
        else:
            highlight_color = (100, 200, 255)  # Biru untuk hover
            effect_text = "MENUNJUK"
        
        # Highlight circle
        pygame.draw.circle(self.screen, highlight_color, pos, 50, 4)
        
        # Pulsing effect
        for i in range(3):
            pulse_radius = 50 + (i * 8)
            pulse_alpha = 100 - (i * 30)
            pygame.draw.circle(self.screen, highlight_color, pos, pulse_radius, 2)
        
        # Info komponen yang ditunjuk
        comp_info = f"{effect_text}: {comp_type.upper()}"
        if comp_type in ['battery', 'resistor', 'lamp']:
            value = component['value']
            if comp_type == 'battery':
                comp_info += f" ({value.get('voltage', 0)}V)"
            elif comp_type in ['resistor', 'lamp']:
                comp_info += f" ({value.get('resistance', 0)}Ω)"
        
        # Background untuk info
        info_surface = self.font_medium.render(comp_info, True, (255, 255, 255))
        info_bg = pygame.Rect(pos[0] - info_surface.get_width()//2 - 5, pos[1] - 70, 
                             info_surface.get_width() + 10, info_surface.get_height() + 6)
        pygame.draw.rect(self.screen, (0, 0, 0, 200), info_bg)
        pygame.draw.rect(self.screen, highlight_color, info_bg, 2)
        
        self.screen.blit(info_surface, (pos[0] - info_surface.get_width()//2, pos[1] - 67))
    
    def _render_finger_landmarks(self, pinch_data):
        """Render landmark jari (jempol dan telunjuk) di workspace"""
        thumb_pos = pinch_data['thumb_pos']
        index_pos = pinch_data['index_pos']
        
        # Hanya render jika di area workspace
        if (thumb_pos[1] > self.panel_height and index_pos[1] > self.panel_height):
            
            # Gambar titik landmark
            pygame.draw.circle(self.screen, (255, 0, 255), thumb_pos, 6)  # Jempol - magenta
            pygame.draw.circle(self.screen, (0, 255, 255), index_pos, 6)  # Telunjuk - cyan
            
            # Garis antara jempol dan telunjuk
            pygame.draw.line(self.screen, (255, 255, 100), thumb_pos, index_pos, 3)
            
            # Label
            thumb_label = self.font_small.render("JEMPOL", True, (255, 0, 255))
            index_label = self.font_small.render("TELUNJUK", True, (0, 255, 255))
            
            # Background untuk label
            thumb_bg = pygame.Rect(thumb_pos[0] + 8, thumb_pos[1] - 15, 
                                  thumb_label.get_width() + 4, thumb_label.get_height() + 2)
            index_bg = pygame.Rect(index_pos[0] + 8, index_pos[1] - 15, 
                                  index_label.get_width() + 4, index_label.get_height() + 2)
            
            pygame.draw.rect(self.screen, (0, 0, 0, 180), thumb_bg)
            pygame.draw.rect(self.screen, (0, 0, 0, 180), index_bg)
            
            self.screen.blit(thumb_label, (thumb_pos[0] + 10, thumb_pos[1] - 13))
            self.screen.blit(index_label, (index_pos[0] + 10, index_pos[1] - 13))
    
    def _convert_camera_to_workspace(self, camera_pos, camera_size, workspace_rect):
        """Convert posisi kamera ke workspace coordinates"""
        if not camera_pos:
            return None
            
        cam_x, cam_y = camera_pos
        cam_w, cam_h = camera_size
        
        # Normalize to 0-1
        norm_x = cam_x / cam_w
        norm_y = cam_y / cam_h
        
        # Map to workspace coordinates
        workspace_x = workspace_rect.x + (norm_x * workspace_rect.width)
        workspace_y = workspace_rect.y + (norm_y * workspace_rect.height)
        
        return (int(workspace_x), int(workspace_y))
    
    def _draw_hand_skeleton(self, finger_positions):
        """Gambar skeleton tangan di workspace"""
        if not finger_positions:
            return
            
        # Warna untuk setiap jari
        finger_colors = {
            'thumb': (255, 100, 100),   # Merah
            'index': (100, 255, 100),   # Hijau
            'middle': (100, 100, 255),  # Biru
            'ring': (255, 255, 100),    # Kuning
            'pinky': (255, 100, 255),   # Magenta
            'wrist': (255, 255, 255)    # Putih
        }
        
        # Gambar titik untuk setiap ujung jari
        for finger_name, pos in finger_positions.items():
            if pos and finger_name in finger_colors:
                color = finger_colors[finger_name]
                
                # Lingkaran untuk ujung jari
                radius = 8 if finger_name == 'index' else 6  # Telunjuk lebih besar
                pygame.draw.circle(self.screen, color, pos, radius)
                pygame.draw.circle(self.screen, (255, 255, 255), pos, radius, 2)
                
                # Label jari
                if finger_name == 'index':  # Highlight telunjuk
                    label = self.font_small.render("👆", True, (255, 255, 255))
                    label_pos = (pos[0] - 10, pos[1] - 25)
                    self.screen.blit(label, label_pos)
        
        # Gambar garis koneksi (simplified)
        if 'wrist' in finger_positions and 'index' in finger_positions:
            if finger_positions['wrist'] and finger_positions['index']:
                pygame.draw.line(self.screen, (100, 100, 100), 
                               finger_positions['wrist'], finger_positions['index'], 2)
    
    def _check_pointing_at_components(self, finger_positions, components):
        """Cek apakah telunjuk menunjuk ke komponen tertentu"""
        if not finger_positions.get('index') or not components:
            self.pointed_component = None
            return
            
        index_pos = finger_positions['index']
        pointing_threshold = 40  # pixel
        
        self.pointed_component = None
        min_distance = float('inf')
        
        for component in components:
            comp_pos = component['position']
            distance = self._calculate_distance(index_pos, comp_pos)
            
            if distance < pointing_threshold and distance < min_distance:
                min_distance = distance
                self.pointed_component = component
        
        # Highlight komponen yang ditunjuk
        if self.pointed_component:
            comp_pos = self.pointed_component['position']
            comp_type = self.pointed_component['type']
            
            # Lingkaran highlight
            pygame.draw.circle(self.screen, (255, 255, 0), comp_pos, 50, 4)
            
            # Info popup
            info_text = f"👆 {comp_type.upper()}"
            value_text = self._get_component_value_text(comp_type, self.pointed_component['value'])
            if value_text:
                info_text += f" ({value_text})"
            
            # Background untuk info
            info_surface = self.font_medium.render(info_text, True, (255, 255, 255))
            info_bg = pygame.Rect(
                comp_pos[0] - info_surface.get_width()//2 - 5,
                comp_pos[1] - 70,
                info_surface.get_width() + 10,
                info_surface.get_height() + 4
            )
            pygame.draw.rect(self.screen, (0, 0, 0, 200), info_bg)
            pygame.draw.rect(self.screen, (255, 255, 0), info_bg, 2)
            
            # Text info
            info_pos = (comp_pos[0] - info_surface.get_width()//2, comp_pos[1] - 68)
            self.screen.blit(info_surface, info_pos)
    
    def _calculate_distance(self, pos1, pos2):
        """Hitung jarak euclidean antara dua posisi"""
        return ((pos2[0] - pos1[0])**2 + (pos2[1] - pos1[1])**2)**0.5
    
    def get_workspace_area(self):
        """Dapatkan area workspace"""
        return pygame.Rect(0, self.workspace_y, self.screen_width, self.workspace_height)
