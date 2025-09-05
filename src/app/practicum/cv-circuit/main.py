"""
Circuit Builder Computer Vision - Main Application
Aplikasi untuk siswa SMA belajar rangkaian listrik menggunakan deteksi gesture tangan.
"""

import cv2
import pygame
import sys
import os

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.hand_detection.pinch_detector import PinchDetector
from src.ui.component_panel import ComponentPanel
from src.circuit_logic.wire_system import WireSystem
from src.circuit_logic.calculator import CircuitCalculator
from src.ui.interface import MainInterface

class CircuitBuilderApp:
    """Main application class for Circuit Builder CV"""
    
    def __init__(self):
        """Initialize application"""
        # Initialize pygame
        pygame.init()
        self.screen_width = 1024
        self.screen_height = 768
        self.screen = pygame.display.set_mode((self.screen_width, self.screen_height))
        pygame.display.set_caption("Circuit Builder CV - Praktikum Listrik Statis")
        
        # Initialize camera
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            print("Error: Tidak dapat membuka kamera!")
            sys.exit(1)
            
        # Initialize components
        self.pinch_detector = PinchDetector()
        self.component_panel = ComponentPanel(self.screen_width, self.screen_height)
        self.wire_system = WireSystem()
        self.calculator = CircuitCalculator()
        self.interface = MainInterface(self.screen, self.screen_width, self.screen_height)
        
        # Application state
        self.dragging_component = None
        self.dragging_offset = (0, 0)
        self.dragging_existing_id = None  # Track ID of existing component being moved
        self.circuit_components = []
        self.clock = pygame.time.Clock()
        self.running = True
        
        print("Circuit Builder CV berhasil diinisialisasi!")
        print("Gunakan pinch gesture untuk berinteraksi dengan komponen.")
        
    def handle_pinch_interaction(self, pinch_data):
        """Handle pinch gesture interactions"""
        if not pinch_data or not pinch_data['is_pinching']:
            # Release any dragging component
            if self.dragging_component:
                self._place_component(pinch_data['position'] if pinch_data else None)
            return
            
        pinch_pos = pinch_data['position']
        
        # Check if we're pinching an existing component first
        if not self.dragging_component:
            existing_component = self._check_existing_component_selection(pinch_pos)
            if existing_component:
                # Start dragging existing component
                self.dragging_component = existing_component['type']
                self.dragging_existing_id = existing_component['id']
                self.dragging_offset = (
                    pinch_pos[0] - existing_component['position'][0],
                    pinch_pos[1] - existing_component['position'][1]
                )
                print(f"Memindahkan komponen: {existing_component['type']}")
                return
        
        # Check component selection from panel
        if not self.dragging_component:
            selected = self.component_panel.check_component_selection(pinch_pos)
            if selected:
                self.dragging_component = selected
                self.dragging_existing_id = None  # New component
                self.dragging_offset = (0, 0)
                print(f"Memilih komponen: {selected}")
        
        # Handle wire interaction
        if self.dragging_component == 'wire':
            self._handle_wire_interaction(pinch_pos)
        
        # Handle component dragging
        elif self.dragging_component:
            self._handle_component_drag(pinch_pos)
    
    def _check_existing_component_selection(self, pinch_pos):
        """Check if pinch position is over an existing component in workspace"""
        # Only check if we're in the workspace area
        if pinch_pos[1] <= self.component_panel.panel_height:
            return None
            
        # Size map untuk detection area
        size_map = {
            'battery': (80, 50),
            'lamp': (60, 60),
            'resistor': (80, 30),
            'switch': (80, 40),
            'wire': (60, 20)
        }
        
        # Check each component (reverse order untuk priority komponen di atas)
        for component in reversed(self.circuit_components):
            comp_pos = component['position']
            comp_type = component['type']
            comp_size = size_map.get(comp_type, (50, 50))
            
            # Area detection yang lebih besar untuk easier interaction
            detection_w = comp_size[0] + 20
            detection_h = comp_size[1] + 20
            
            # Check if pinch is within component bounds
            if (abs(pinch_pos[0] - comp_pos[0]) < detection_w // 2 and
                abs(pinch_pos[1] - comp_pos[1]) < detection_h // 2):
                return component
                
        return None
    
    def _handle_component_drag(self, pinch_pos):
        """Handle dragging of components"""
        # Update component position during drag
        drag_x = pinch_pos[0] - self.dragging_offset[0]
        drag_y = pinch_pos[1] - self.dragging_offset[1]
        
        # Store temporary position for rendering
        self.temp_component_pos = (drag_x, drag_y)
    
    def _handle_wire_interaction(self, pinch_pos):
        """Handle wire placement and connection"""
        if not self.wire_system.active_wire:
            # Start new wire
            self.wire_system.start_wire_placement(pinch_pos)
        else:
            # Update wire end position
            self.wire_system.update_wire_end(pinch_pos)
            
            # Check for connections
            connections = self.wire_system.check_connection(self.circuit_components)
            if connections:
                print(f"Koneksi terdeteksi: {connections}")
    
    def _place_component(self, position):
        """Place component in circuit area"""
        if self.dragging_component and position:
            # Only place if not in panel area
            if position[1] > self.component_panel.panel_height:
                
                if self.dragging_existing_id is not None:
                    # Moving existing component
                    for component in self.circuit_components:
                        if component['id'] == self.dragging_existing_id:
                            component['position'] = position
                            print(f"Komponen {self.dragging_component} dipindah ke {position}")
                            break
                else:
                    # Create new component
                    new_component = {
                        'type': self.dragging_component,
                        'position': position,
                        'id': len(self.circuit_components),
                        'connections': [],
                        'value': self._get_default_value(self.dragging_component)
                    }
                    
                    self.circuit_components.append(new_component)
                    print(f"Komponen {self.dragging_component} ditempatkan di {position}")
            else:
                # If dragging existing component back to panel, remove it
                if self.dragging_existing_id is not None:
                    self.circuit_components = [c for c in self.circuit_components 
                                             if c['id'] != self.dragging_existing_id]
                    print(f"Komponen {self.dragging_component} dihapus")
        
        self.dragging_component = None
        self.dragging_existing_id = None
        self.temp_component_pos = None
    
    def _get_default_value(self, component_type):
        """Get default values for components"""
        defaults = {
            'battery': {'voltage': 12},  # 12V
            'resistor': {'resistance': 100},  # 100Ω
            'lamp': {'resistance': 50},  # 50Ω
            'switch': {'state': 'OFF'}
        }
        return defaults.get(component_type, {})
    
    def handle_switch_control(self, hand_landmarks):
        """Handle switch control with finger gestures"""
        if hand_landmarks:
            switch_action = self.calculator.detect_switch_control(hand_landmarks)
            
            if switch_action != 'UNCHANGED':
                # Find switches in circuit and update their state
                for component in self.circuit_components:
                    if component['type'] == 'switch':
                        component['value']['state'] = switch_action
                        print(f"Saklar: {switch_action}")
    
    def update_calculations(self):
        """Update circuit calculations"""
        if self.circuit_components:
            results = self.calculator.calculate_circuit(self.circuit_components)
            self.interface.update_calculations(results)
    
    def run(self):
        """Main application loop"""
        print("Memulai Circuit Builder CV...")
        print("Tekan ESC untuk keluar")
        
        while self.running:
            # Handle pygame events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        self.running = False
                    elif event.key == pygame.K_r:
                        # Reset circuit
                        self.circuit_components.clear()
                        self.wire_system.clear()
                        print("Rangkaian direset")
            
            # Read camera frame
            ret, frame = self.cap.read()
            if not ret:
                print("Error: Tidak dapat membaca frame kamera")
                break
                
            # Flip frame horizontally (mirror effect)
            frame = cv2.flip(frame, 1)
            
            # Detect pinch gesture
            pinch_data = self.pinch_detector.detect_pinch(frame)
            hand_landmarks = self.pinch_detector.get_hand_landmarks()
            
            # Handle interactions
            self.handle_pinch_interaction(pinch_data)
            self.handle_switch_control(hand_landmarks)
            
            # Update calculations
            self.update_calculations()
            
            # Render interface
            self.interface.render(
                frame=frame,
                pinch_data=pinch_data,
                components=self.circuit_components,
                dragging_component=self.dragging_component,
                temp_pos=getattr(self, 'temp_component_pos', None),
                wires=self.wire_system.get_wires()
            )
            
            # Update display
            pygame.display.flip()
            self.clock.tick(30)  # 30 FPS
        
        # Cleanup
        self.cleanup()
    
    def cleanup(self):
        """Clean up resources"""
        print("Membersihkan resources...")
        self.cap.release()
        cv2.destroyAllWindows()
        pygame.quit()
        print("Circuit Builder CV ditutup")

def main():
    """Main function"""
    try:
        app = CircuitBuilderApp()
        app.run()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
