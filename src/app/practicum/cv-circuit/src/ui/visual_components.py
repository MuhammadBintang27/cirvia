"""
Visual Components Module
Menggambar komponen elektronik dengan bentuk visual yang menarik
"""

import pygame
import math

# Initialize pygame
pygame.init()

class ComponentRenderer:
    """Class untuk menggambar komponen dengan bentuk visual yang menarik"""
    
    @staticmethod
    def draw_battery(surface, x, y, size, selected=False):
        """Gambar baterai dengan bentuk visual yang menarik dan kontras tinggi"""
        w, h = size
        
        # Body baterai (hitam dengan outline putih tebal)
        body_rect = pygame.Rect(x - w//2 + 10, y - h//2 + 8, w - 25, h - 16)
        pygame.draw.rect(surface, (20, 20, 20), body_rect)
        pygame.draw.rect(surface, (255, 255, 255), body_rect, 4)
        
        # Positive terminal (orange/merah terang)
        pos_terminal = pygame.Rect(x + w//2 - 12, y - 8, 12, 16)
        pygame.draw.rect(surface, (255, 100, 0), pos_terminal)
        pygame.draw.rect(surface, (255, 255, 255), pos_terminal, 2)
        
        # Label + dan - dengan font yang lebih besar
        font = pygame.font.Font(None, 28)
        plus_text = font.render("+", True, (255, 255, 0))
        minus_text = font.render("-", True, (255, 255, 0))
        surface.blit(plus_text, (x + 15, y - 10))
        surface.blit(minus_text, (x - 25, y - 10))
        
        # Highlight jika dipilih
        if selected:
            pygame.draw.rect(surface, (255, 255, 0), 
                           pygame.Rect(x - w//2, y - h//2, w, h), 5)
    
    @staticmethod
    def draw_lamp(surface, x, y, size, selected=False):
        """Gambar bola lampu dengan filamen - lebih kontras"""
        w, h = size
        radius = min(w, h) // 2 - 8
        
        # Base lampu (abu-abu gelap dengan outline)
        base_rect = pygame.Rect(x - 12, y + radius - 8, 24, 16)
        pygame.draw.rect(surface, (80, 80, 80), base_rect)
        pygame.draw.rect(surface, (255, 255, 255), base_rect, 3)
        
        # Bulb (putih dengan outline tebal)
        pygame.draw.circle(surface, (255, 255, 200), (x, y), radius)
        pygame.draw.circle(surface, (255, 255, 255), (x, y), radius, 4)
        
        # Filamen (garis-garis tebal di dalam)
        filament_color = (255, 150, 0)
        for i in range(-2, 3):
            start_pos = (x - 12, y + i * 6)
            end_pos = (x + 12, y + i * 6)
            pygame.draw.line(surface, filament_color, start_pos, end_pos, 3)
        
        # Highlight jika dipilih
        if selected:
            pygame.draw.circle(surface, (255, 255, 0), (x, y), radius + 5, 4)
    
    @staticmethod
    def draw_resistor(surface, x, y, size, selected=False):
        """Gambar resistor dengan garis-garis warna - kontras tinggi"""
        w, h = size
        
        # Body resistor (putih dengan outline hitam tebal)
        body_rect = pygame.Rect(x - w//2 + 10, y - 12, w - 20, 24)
        pygame.draw.rect(surface, (255, 255, 255), body_rect)
        pygame.draw.rect(surface, (0, 0, 0), body_rect, 4)
        
        # Kabel kiri dan kanan (emas tebal)
        pygame.draw.line(surface, (255, 215, 0), 
                        (x - w//2, y), (x - w//2 + 10, y), 6)
        pygame.draw.line(surface, (255, 215, 0), 
                        (x + w//2 - 10, y), (x + w//2, y), 6)
        
        # Garis-garis warna resistor yang kontras
        colors = [(139, 69, 19), (255, 215, 0), (255, 165, 0), (0, 0, 0)]
        for i, color in enumerate(colors):
            line_x = x - w//2 + 15 + i * 8
            pygame.draw.line(surface, color, 
                           (line_x, y - 10), (line_x, y + 10), 4)
        
        # Label "RESISTOR"
        font = pygame.font.Font(None, 20)
        label_text = font.render("RESISTOR", True, (0, 0, 0))
        label_rect = label_text.get_rect(center=(x, y + 20))
        surface.blit(label_text, label_rect)
        
        # Highlight jika dipilih
        if selected:
            pygame.draw.rect(surface, (255, 255, 0), 
                           pygame.Rect(x - w//2, y - 15, w, 30), 4)
    
    @staticmethod
    def draw_switch(surface, x, y, size, state="OFF", selected=False):
        """Gambar saklar dengan tuas - kontras tinggi"""
        w, h = size
        
        # Base saklar (hitam dengan outline putih)
        base_rect = pygame.Rect(x - w//2 + 10, y - 8, w - 20, 16)
        pygame.draw.rect(surface, (40, 40, 40), base_rect)
        pygame.draw.rect(surface, (255, 255, 255), base_rect, 3)
        
        # Terminal kiri dan kanan (emas)
        pygame.draw.circle(surface, (255, 215, 0), (x - w//2 + 15, y), 4)
        pygame.draw.circle(surface, (255, 215, 0), (x + w//2 - 15, y), 4)
        pygame.draw.circle(surface, (0, 0, 0), (x - w//2 + 15, y), 4, 2)
        pygame.draw.circle(surface, (0, 0, 0), (x + w//2 - 15, y), 4, 2)
        
        # Tuas saklar
        if state == "ON":
            # Tuas horizontal (ON) - hijau terang
            pygame.draw.line(surface, (0, 255, 0), 
                           (x - 12, y), (x + 12, y), 5)
            status_text = "ON"
            status_color = (0, 255, 0)
        else:
            # Tuas diagonal (OFF) - abu-abu gelap
            pygame.draw.line(surface, (128, 128, 128), 
                           (x - 8, y - 8), (x + 8, y + 8), 5)
            status_text = "OFF"
            status_color = (192, 192, 192)
        
        # Label status
        font = pygame.font.Font(None, 24)
        label_text = font.render(status_text, True, status_color)
        label_rect = label_text.get_rect(center=(x, y + 18))
        surface.blit(label_text, label_rect)
        
        # Label "SAKLAR"
        switch_font = pygame.font.Font(None, 20)
        switch_text = switch_font.render("SAKLAR", True, (255, 255, 255))
        switch_rect = switch_text.get_rect(center=(x, y - 20))
        surface.blit(switch_text, switch_rect)
        
        # Highlight jika dipilih
        if selected:
            pygame.draw.rect(surface, (255, 255, 0), 
                           pygame.Rect(x - w//2, y - 12, w, 24), 4)
        pygame.draw.rect(surface, (100, 100, 100), base_rect, 2)
        
        # Terminal kiri dan kanan
        pygame.draw.circle(surface, (150, 150, 150), (x - w//2 + 8, y), 3)
        pygame.draw.circle(surface, (150, 150, 150), (x + w//2 - 8, y), 3)
        
        # Tuas saklar
        lever_color = (200, 50, 50) if state == "ON" else (100, 100, 100)
        if state == "ON":
            # Tuas horizontal (ON)
            pygame.draw.line(surface, lever_color, 
                           (x - 8, y), (x + 8, y), 4)
        else:
            # Tuas miring (OFF)
            pygame.draw.line(surface, lever_color, 
                           (x - 8, y), (x + 5, y - 8), 4)
        
        # Label ON/OFF
        font = pygame.font.Font(None, 16)
        state_text = font.render(state, True, lever_color)
        text_rect = state_text.get_rect(center=(x, y + 15))
        surface.blit(state_text, text_rect)
        
        # Highlight jika dipilih
        if selected:
            pygame.draw.rect(surface, (255, 255, 0), 
                           pygame.Rect(x - w//2, y - 12, w, 24), 3)
    
    @staticmethod
    def draw_wire(surface, x, y, size, selected=False):
        """Gambar kabel/kawat yang sederhana dan jelas"""
        w, h = size
        
        # Kabel horizontal (coklat tembaga yang lebih gelap)
        wire_color = (139, 69, 19)  # Dark brown
        wire_thickness = 8
        
        # Gambar kabel utama
        pygame.draw.line(surface, wire_color, 
                        (x - w//2 + 15, y), (x + w//2 - 15, y), wire_thickness)
        
        # Efek highlight di atas (untuk kilap)
        pygame.draw.line(surface, (180, 120, 60), 
                        (x - w//2 + 15, y - 2), (x + w//2 - 15, y - 2), 2)
        
        # Terminal/connector di ujung (abu-abu, bukan merah)
        terminal_color = (120, 120, 120)  # Abu-abu
        terminal_size = 6
        
        # Terminal kiri
        pygame.draw.circle(surface, terminal_color, (x - w//2 + 15, y), terminal_size)
        pygame.draw.circle(surface, (80, 80, 80), (x - w//2 + 15, y), terminal_size, 2)
        
        # Terminal kanan  
        pygame.draw.circle(surface, terminal_color, (x + w//2 - 15, y), terminal_size)
        pygame.draw.circle(surface, (80, 80, 80), (x + w//2 - 15, y), terminal_size, 2)
        
        # Label "KABEL"
        wire_font = pygame.font.Font(None, 18)
        wire_text = wire_font.render("KABEL", True, (255, 255, 255))
        wire_rect = wire_text.get_rect(center=(x, y + 15))
        surface.blit(wire_text, wire_rect)
        
        # Highlight jika dipilih (kuning, bukan merah)
        if selected:
            pygame.draw.rect(surface, (255, 255, 0), 
                           pygame.Rect(x - w//2, y - 12, w, 24), 3)
    
    @staticmethod
    def draw_component_label(surface, x, y, text, font, color=(255, 255, 255)):
        """Gambar label komponen dengan background"""
        text_surface = font.render(text, True, color)
        text_rect = text_surface.get_rect(center=(x, y))
        
        # Background untuk text
        bg_rect = pygame.Rect(text_rect.x - 3, text_rect.y - 1, 
                             text_rect.width + 6, text_rect.height + 2)
        pygame.draw.rect(surface, (0, 0, 0, 150), bg_rect)
        
        surface.blit(text_surface, text_rect)
