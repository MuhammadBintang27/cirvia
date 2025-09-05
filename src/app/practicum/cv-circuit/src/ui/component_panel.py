"""
Component Panel Module
Panel untuk memilih komponen rangkaian listrik dengan visual yang menarik
"""

import pygame
import math
from .visual_components import ComponentRenderer

# Initialize pygame and font system
pygame.init()
pygame.font.init()

class ComponentPanel:
    """Panel komponen untuk pemilihan dan drag & drop"""
    
    def __init__(self, screen_width, screen_height):
        """
        Initialize component panel
        
        Args:
            screen_width: Lebar layar
            screen_height: Tinggi layar
        """
        self.screen_width = screen_width
        self.screen_height = screen_height
        self.panel_height = 120  # Tingkatkan tinggi panel
        self.panel_y = 0
        self.debug_mode = True  # Mode untuk menampilkan area detection
        
        # Definisi komponen dengan visual yang menarik - Kabel di sebelah kiri
        self.components = {
            'wire': {
                'name': 'Kabel',
                'pos': (100, 60),
                'size': (120, 50),
                'description': 'Penghubung'
            },
            'battery': {
                'name': 'Baterai',
                'pos': (250, 60),  # Posisi lebih ke bawah
                'size': (120, 70),  # Ukuran lebih besar
                'description': 'Sumber tegangan 12V'
            },
            'lamp': {
                'name': 'Bola Lampu',
                'pos': (400, 60),
                'size': (100, 100),
                'description': 'Beban lampu 50Ω'
            },
            'resistor': {
                'name': 'Resistor',
                'pos': (550, 60),
                'size': (120, 50),
                'description': 'Hambatan 100Ω'
            },
            'switch': {
                'name': 'Saklar',
                'pos': (700, 60),
                'size': (120, 70),
                'description': 'Saklar ON/OFF'
            }
        }
        
        self.selected_component = None
        
        # Initialize pygame fonts with safety check
        pygame.font.init()  # Ensure pygame font is initialized
        self.font = pygame.font.Font(None, 24)
        self.small_font = pygame.font.Font(None, 18)
        self.renderer = ComponentRenderer()
        
    def render(self, screen):
        """
        Render panel komponen dengan visual yang menarik
        
        Args:
            screen: Surface pygame untuk menggambar
        """
        # Background panel dengan gradient
        panel_rect = pygame.Rect(0, self.panel_y, self.screen_width, self.panel_height)
        
        # Gradient background - lebih kontras
        for y in range(self.panel_height):
            color_intensity = 30 + (y * 40 // self.panel_height)  # Lebih gelap
            color = (color_intensity, color_intensity, color_intensity + 20)
            pygame.draw.line(screen, color, (0, y), (self.screen_width, y))
        
        # Border panel - lebih tebal dan putih
        pygame.draw.line(screen, (255, 255, 255), 
                        (0, self.panel_height-5), (self.screen_width, self.panel_height-5), 5)
        
        # Title dengan background yang sangat kontras
        title_bg = pygame.Rect(10, 5, 200, 30)
        pygame.draw.rect(screen, (0, 0, 0), title_bg)  # Hitam
        pygame.draw.rect(screen, (255, 255, 255), title_bg, 3)  # Border putih
        title_text = self.font.render("KOMPONEN LISTRIK", True, (255, 255, 255))
        screen.blit(title_text, (15, 12))
        
        # Render setiap komponen
        for comp_name, comp_data in self.components.items():
            self._render_component(screen, comp_name, comp_data)
    
    def _render_component(self, screen, comp_name, comp_data):
        """Render komponen individual dengan visual yang menarik dan area detection yang besar"""
        x, y = comp_data['pos']
        w, h = comp_data['size']
        
        # Area detection yang lebih besar (visual debug)
        if self.debug_mode:
            if comp_name == 'wire':
                detection_w = w + 40  # Area detection kabel sangat besar
                detection_h = h + 40
                # Gambar border area detection untuk kabel
                detection_rect = pygame.Rect(x - detection_w//2, y - detection_h//2, detection_w, detection_h)
                pygame.draw.rect(screen, (255, 200, 0), detection_rect, 2)  # Kuning untuk kabel
            else:
                detection_w = w + 20
                detection_h = h + 20
                # Gambar border area detection untuk komponen lain
                detection_rect = pygame.Rect(x - detection_w//2, y - detection_h//2, detection_w, detection_h)
                pygame.draw.rect(screen, (100, 200, 255), detection_rect, 1)  # Biru muda
        
        # Background area untuk komponen - kontras tinggi
        bg_rect = pygame.Rect(x - w//2 - 5, y - h//2 - 5, w + 10, h + 10)
        
        # Background dengan efek yang lebih terlihat
        if self.selected_component == comp_name:
            # Background kuning terang untuk yang dipilih
            pygame.draw.rect(screen, (255, 255, 0), bg_rect)
            pygame.draw.rect(screen, (255, 255, 255), bg_rect, 4)
        else:
            # Background putih untuk yang tidak dipilih
            pygame.draw.rect(screen, (220, 220, 220), bg_rect)
            pygame.draw.rect(screen, (0, 0, 0), bg_rect, 3)
        
        # Gambar komponen menggunakan visual renderer
        selected = (self.selected_component == comp_name)
        
        if comp_name == 'battery':
            self.renderer.draw_battery(screen, x, y, comp_data['size'], selected)
        elif comp_name == 'lamp':
            self.renderer.draw_lamp(screen, x, y, comp_data['size'], selected)
        elif comp_name == 'resistor':
            self.renderer.draw_resistor(screen, x, y, comp_data['size'], selected)
        elif comp_name == 'switch':
            self.renderer.draw_switch(screen, x, y, comp_data['size'], selected=selected)
        elif comp_name == 'wire':
            self.renderer.draw_wire(screen, x, y, comp_data['size'], selected)
        
        # Label nama komponen
        self.renderer.draw_component_label(screen, x, y + h//2 + 15, 
                                         comp_data['name'], self.small_font)
        
        # Label khusus untuk kabel
        if comp_name == 'wire' and self.debug_mode:
            hint_text = self.small_font.render("AREA BESAR", True, (255, 150, 0))
            screen.blit(hint_text, (x - 30, y - h//2 - 25))
    
    def check_component_selection(self, pinch_pos):
        """
        Cek apakah posisi pinch berada di area komponen dengan area detection yang lebih besar
        
        Args:
            pinch_pos: Tuple (x, y) posisi pinch
            
        Returns:
            str: Nama komponen yang dipilih atau None
        """
        if not pinch_pos:
            return None
            
        x, y = pinch_pos
        
        # Cek apakah di area panel dengan toleransi lebih besar
        if y <= self.panel_height + 20:  # Tambah toleransi 20px
            for comp_name, comp_data in self.components.items():
                comp_x, comp_y = comp_data['pos']
                comp_w, comp_h = comp_data['size']
                
                # Area detection yang lebih besar, terutama untuk kabel
                if comp_name == 'wire':
                    # Area detection khusus untuk kabel yang lebih besar
                    detection_w = comp_w + 40  # Tambah 40px untuk kabel
                    detection_h = comp_h + 40
                else:
                    # Area detection normal tapi lebih besar
                    detection_w = comp_w + 20
                    detection_h = comp_h + 20
                
                # Cek collision dengan area detection yang diperbesar
                if (comp_x - detection_w//2 <= x <= comp_x + detection_w//2 and
                    comp_y - detection_h//2 <= y <= comp_y + detection_h//2):
                    
                    self.selected_component = comp_name
                    print(f"Komponen {comp_name} terpilih! Area: {detection_w}x{detection_h}")
                    return comp_name
        
        return None
    
    def get_component_info(self, comp_name):
        """
        Dapatkan informasi komponen
        
        Args:
            comp_name: Nama komponen
            
        Returns:
            dict: Informasi komponen
        """
        return self.components.get(comp_name, None)
    
    def clear_selection(self):
        """Clear komponen yang dipilih"""
        self.selected_component = None
    
    def is_in_panel_area(self, position):
        """
        Cek apakah posisi berada di area panel
        
        Args:
            position: Tuple (x, y)
            
        Returns:
            bool: True jika di area panel
        """
        if not position:
            return False
        return position[1] <= self.panel_height
