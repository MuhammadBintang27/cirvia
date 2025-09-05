"""
Web Streaming Server untuk CV Application
Menjalankan aplikasi CV dan stream output ke web browser
"""

import cv2
import pygame
import numpy as np
from flask import Flask, Response, render_template_string
import threading
import base64
import io
import sys
import os
from datetime import datetime

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.hand_detection.pinch_detector import PinchDetector
from src.ui.component_panel import ComponentPanel
from src.circuit_logic.wire_system import WireSystem
from src.circuit_logic.calculator import CircuitCalculator
from src.ui.interface import MainInterface

app = Flask(__name__)

class WebCVStreamer:
    def __init__(self):
        """Initialize web CV streamer"""
        # Initialize pygame for UI components
        import pygame
        pygame.init()
        
        # Initialize components
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            print("Error: Tidak dapat membuka kamera!")
            return
            
        self.pinch_detector = PinchDetector()
        self.component_panel = ComponentPanel(800, 600)
        self.wire_system = WireSystem()
        self.calculator = CircuitCalculator()
        
        # Web streaming state
        self.is_running = False
        self.current_frame = None
        self.circuit_data = {
            'components': [],
            'calculations': {
                'voltage': 0,
                'current': 0,
                'resistance': 0,
                'power': 0
            }
        }
        
        # Application state
        self.dragging_component = None
        self.selected_component = None  # Add missing attribute
        self.circuit_components = []
        
        print("Web CV Streamer berhasil diinisialisasi!")
    
    def process_frame(self):
        """Process single frame with CV detection"""
        ret, frame = self.cap.read()
        if not ret:
            return None
            
        # Flip frame horizontally for mirror effect
        frame = cv2.flip(frame, 1)
        
        # Detect hand gestures
        pinch_results = self.pinch_detector.detect_pinch(frame)
        
        if pinch_results:
            # Get pinch information
            is_pinching = pinch_results.get('is_pinching', False)
            position = pinch_results.get('position', (0, 0))
            
            # Update circuit state based on gestures
            # TODO: Implement gesture-based circuit building
            
            # Handle pinch interactions
            if is_pinching:
                self.handle_pinch_interaction({
                    'position': position,
                    'is_pinching': is_pinching
                })
        
        # Create circuit visualization overlay
        circuit_overlay = self.create_circuit_overlay(frame.shape)
        
        # Combine frame with circuit overlay
        combined_frame = cv2.addWeighted(frame, 0.7, circuit_overlay, 0.3, 0)
        
        # Add UI elements
        self.draw_ui_elements(combined_frame)
        
        return combined_frame
    
    def create_circuit_overlay(self, shape):
        """Create circuit visualization overlay"""
        overlay = np.zeros(shape, dtype=np.uint8)
        height, width = shape[:2]
        
        # Draw component panel area
        cv2.rectangle(overlay, (0, 0), (width, 100), (50, 50, 50), -1)
        
        # Draw component icons in panel
        self.draw_component_icons(overlay, width)
        
        # Draw workspace area
        cv2.rectangle(overlay, (0, 100), (width, height), (30, 30, 30), 2)
        
        # Draw circuit components
        for component in self.circuit_components:
            self.draw_component(overlay, component)
        
        return overlay
    
    def draw_component_icons(self, overlay, width):
        """Draw component icons in panel"""
        icon_width = width // 4
        
        # Battery icon
        cv2.rectangle(overlay, (icon_width//2 - 30, 25), (icon_width//2 + 30, 75), (0, 255, 0), 2)
        cv2.putText(overlay, "BAT", (icon_width//2 - 20, 55), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        
        # Resistor icon  
        x_center = icon_width + icon_width//2
        cv2.rectangle(overlay, (x_center - 30, 25), (x_center + 30, 75), (0, 255, 255), 2)
        cv2.putText(overlay, "RES", (x_center - 20, 55), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        
        # Wire icon
        x_center = 2 * icon_width + icon_width//2
        cv2.line(overlay, (x_center - 30, 50), (x_center + 30, 50), (128, 128, 128), 5)
        cv2.putText(overlay, "WIRE", (x_center - 25, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
    
    def draw_component(self, overlay, component):
        """Draw individual circuit component"""
        x, y = component['position']
        comp_type = component['type']
        
        if comp_type == 'battery':
            cv2.rectangle(overlay, (x-20, y-15), (x+20, y+15), (0, 255, 0), -1)
            cv2.putText(overlay, f"{component.get('value', 12)}V", (x-15, y+25), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
        elif comp_type == 'resistor':
            cv2.rectangle(overlay, (x-25, y-10), (x+25, y+10), (0, 255, 255), -1)
            cv2.putText(overlay, f"{component.get('value', 100)}Ω", (x-20, y+25), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
        elif comp_type == 'wire':
            cv2.line(overlay, (x-20, y), (x+20, y), (128, 128, 128), 3)
    
    def draw_ui_elements(self, frame):
        """Draw UI elements on frame"""
        height, width = frame.shape[:2]
        
        # Draw calculations panel
        calc_x = width - 200
        calc_y = 120
        
        cv2.rectangle(frame, (calc_x, calc_y), (width-10, calc_y + 150), (0, 0, 0), -1)
        cv2.rectangle(frame, (calc_x, calc_y), (width-10, calc_y + 150), (255, 255, 255), 2)
        
        # Draw calculation values
        calcs = self.circuit_data['calculations']
        cv2.putText(frame, "CALCULATIONS", (calc_x + 5, calc_y + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, f"V: {calcs['voltage']:.2f}V", (calc_x + 5, calc_y + 40), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 255), 1)
        cv2.putText(frame, f"I: {calcs['current']:.3f}A", (calc_x + 5, calc_y + 60), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)
        cv2.putText(frame, f"R: {calcs['resistance']:.2f}Ω", (calc_x + 5, calc_y + 80), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 0), 1)
        cv2.putText(frame, f"P: {calcs['power']:.3f}W", (calc_x + 5, calc_y + 100), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 0, 255), 1)
        
        # Draw instructions
        instructions = [
            "PINCH: Select & drag components",
            "POINT: Navigate interface", 
            "OPEN: Release components"
        ]
        
        for i, instruction in enumerate(instructions):
            cv2.putText(frame, instruction, (10, height - 60 + i*20), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)
    
    def handle_pinch_interaction(self, pinch_data):
        """Handle pinch gesture interactions"""
        if not pinch_data['is_pinching']:
            if self.dragging_component:
                # Place component at current position
                self.place_component(pinch_data['position'])
            return
            
        pos = pinch_data['position']
        
        # Check if pinching in component panel area
        if pos[1] < 100:  # Top 100 pixels are component panel
            self.select_component_from_panel(pos)
        else:
            # Check if pinching existing component
            clicked_component = self.check_component_at_position(pos)
            if clicked_component:
                self.select_existing_component(clicked_component)
            elif self.dragging_component:
                # Move dragging component
                self.update_dragging_position(pos)
    
    def check_component_at_position(self, pos):
        """Check if there's a component at the given position"""
        # Simple implementation - check distance to each component
        for component in self.circuit_data['components']:
            comp_pos = component.get('position', (0, 0))
            distance = ((pos[0] - comp_pos[0])**2 + (pos[1] - comp_pos[1])**2)**0.5
            if distance < 50:  # 50 pixel radius
                return component
        return None
    
    def select_existing_component(self, component):
        """Select an existing component for dragging"""
        self.selected_component = component
        self.dragging_component = True
    
    def update_dragging_position(self, pos):
        """Update position of dragging component"""
        if self.selected_component:
            self.selected_component['position'] = pos
    
    def select_component_from_panel(self, pos):
        """Select component type from panel"""
        x = pos[0]
        width = 800  # Assumed width
        icon_width = width // 4
        
        if x < icon_width:
            self.dragging_component = {'type': 'battery', 'value': 12}
        elif x < 2 * icon_width:
            self.dragging_component = {'type': 'resistor', 'value': 100}
        elif x < 3 * icon_width:
            self.dragging_component = {'type': 'wire', 'value': 0}
    
    def place_component(self, pos):
        """Place component at position"""
        if self.dragging_component and pos[1] > 100:  # Only place in workspace
            new_component = {
                'id': f"{self.dragging_component['type']}_{len(self.circuit_components)}",
                'type': self.dragging_component['type'],
                'position': pos,
                'value': self.dragging_component['value']
            }
            self.circuit_components.append(new_component)
            self.calculate_circuit()
        
        self.dragging_component = None
    
    def calculate_circuit(self):
        """Calculate circuit values"""
        batteries = [c for c in self.circuit_components if c['type'] == 'battery']
        resistors = [c for c in self.circuit_components if c['type'] == 'resistor']
        
        voltage = sum(c['value'] for c in batteries)
        resistance = sum(c['value'] for c in resistors)
        current = voltage / resistance if resistance > 0 else 0
        power = voltage * current
        
        self.circuit_data['calculations'] = {
            'voltage': voltage,
            'current': current,
            'resistance': resistance,
            'power': power
        }
        self.circuit_data['components'] = self.circuit_components
    
    def generate_frames(self):
        """Generate frames for streaming"""
        while self.is_running:
            frame = self.process_frame()
            if frame is not None:
                # Encode frame as JPEG
                ret, buffer = cv2.imencode('.jpg', frame)
                if ret:
                    frame_data = buffer.tobytes()
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame_data + b'\r\n')
    
    def start_streaming(self):
        """Start streaming"""
        self.is_running = True
    
    def stop_streaming(self):
        """Stop streaming"""
        self.is_running = False
        if self.cap:
            self.cap.release()

# Global streamer instance
cv_streamer = WebCVStreamer()

@app.route('/')
def index():
    """Main page with embedded video stream"""
    return render_template_string('''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Embedded CV Circuit Builder</title>
        <style>
            body { 
                margin: 0; 
                padding: 20px; 
                background-color: #f0f0f0;
                font-family: Arial, sans-serif;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .video-container {
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
            }
            .video-stream {
                border: 2px solid #333;
                border-radius: 10px;
                max-width: 100%;
                height: auto;
            }
            .controls {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-bottom: 20px;
            }
            .btn {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
            }
            .btn-primary { background-color: #007bff; color: white; }
            .btn-danger { background-color: #dc3545; color: white; }
            .btn:hover { opacity: 0.8; }
            .info-panel {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                margin-top: 20px;
            }
            .instructions {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            .instruction-card {
                background: white;
                padding: 15px;
                border-radius: 5px;
                border-left: 4px solid #007bff;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎮 Embedded CV Circuit Builder</h1>
                <p>Build electrical circuits using hand gestures - directly in your browser!</p>
            </div>
            
            <div class="video-container">
                <img src="{{ url_for('video_feed') }}" class="video-stream" alt="CV Stream">
            </div>
            
            <div class="controls">
                <button class="btn btn-primary" onclick="startStream()">🚀 Start CV Stream</button>
                <button class="btn btn-danger" onclick="stopStream()">⏹️ Stop Stream</button>
            </div>
            
            <div class="info-panel">
                <h3>📋 Instructions</h3>
                <div class="instructions">
                    <div class="instruction-card">
                        <h4>🤏 Pinch Gesture</h4>
                        <p>Use thumb and index finger to select and drag components from the top panel</p>
                    </div>
                    <div class="instruction-card">
                        <h4>👆 Point Gesture</h4>
                        <p>Point to navigate and interact with the interface</p>
                    </div>
                    <div class="instruction-card">
                        <h4>✋ Open Hand</h4>
                        <p>Open your hand to release components and place them in the workspace</p>
                    </div>
                    <div class="instruction-card">
                        <h4>📊 Real-time Calculations</h4>
                        <p>See live calculations of voltage, current, resistance, and power in the side panel</p>
                    </div>
                </div>
            </div>
        </div>
        
        <script>
            function startStream() {
                fetch('/start_stream', {method: 'POST'})
                    .then(response => response.json())
                    .then(data => console.log('Stream started:', data));
            }
            
            function stopStream() {
                fetch('/stop_stream', {method: 'POST'})
                    .then(response => response.json())
                    .then(data => console.log('Stream stopped:', data));
            }
            
            // Auto-start stream when page loads
            window.onload = function() {
                setTimeout(startStream, 1000);
            };
        </script>
    </body>
    </html>
    ''')

@app.route('/video_feed')
def video_feed():
    """Video streaming route"""
    return Response(cv_streamer.generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start_stream', methods=['POST'])
def start_stream():
    """Start CV streaming"""
    cv_streamer.start_streaming()
    return {'status': 'started'}

@app.route('/stop_stream', methods=['POST'])
def stop_stream():
    """Stop CV streaming"""
    cv_streamer.stop_streaming()
    return {'status': 'stopped'}

@app.route('/circuit_data')
def circuit_data():
    """Get current circuit data"""
    return cv_streamer.circuit_data

if __name__ == '__main__':
    print("Starting Embedded CV Circuit Builder...")
    print("Access at: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
