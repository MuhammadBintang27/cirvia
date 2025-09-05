"""
Pinch Detection Module
Mendeteksi gesture pinch (jempol + telunjuk) untuk interaksi drag & drop
"""

import cv2
import mediapipe as mp
import numpy as np

class PinchDetector:
    """Detector untuk gesture pinch menggunakan MediaPipe"""
    
    def __init__(self):
        """Initialize MediaPipe hands detection"""
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.8,
            min_tracking_confidence=0.8
        )
        self.mp_drawing = mp.solutions.drawing_utils
        self.hand_landmarks = None
        
        # Threshold untuk deteksi pinch (dalam pixel)
        self.pinch_threshold = 40
        
    def detect_pinch(self, frame):
        """
        Deteksi gesture pinch dari frame kamera
        
        Args:
            frame: Frame dari kamera (BGR format)
            
        Returns:
            dict: {
                'is_pinching': bool,
                'position': (x, y),
                'distance': float,
                'confidence': float,
                'hand_landmarks': landmarks,
                'finger_positions': dict
            } atau None jika tidak ada tangan terdeteksi
        """
        # Convert BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)
        
        self.hand_landmarks = None
        
        if results.multi_hand_landmarks:
            hand_landmarks = results.multi_hand_landmarks[0]
            self.hand_landmarks = hand_landmarks
            
            # Gambar landmark di frame (untuk debugging)
            self.mp_drawing.draw_landmarks(
                frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS
            )
            
            # Ambil koordinat jempol dan telunjuk
            thumb_tip = hand_landmarks.landmark[4]  # Ujung jempol
            index_tip = hand_landmarks.landmark[8]  # Ujung telunjuk
            
            # Convert ke koordinat pixel
            h, w, _ = frame.shape
            thumb_x = int(thumb_tip.x * w)
            thumb_y = int(thumb_tip.y * h)
            index_x = int(index_tip.x * w)
            index_y = int(index_tip.y * h)
            
            # Hitung jarak euclidean
            distance = self._calculate_distance(
                (thumb_x, thumb_y), (index_x, index_y)
            )
            
            # Tentukan apakah sedang pinch
            is_pinching = distance < self.pinch_threshold
            
            # Posisi pinch (titik tengah antara jempol dan telunjuk)
            pinch_x = (thumb_x + index_x) // 2
            pinch_y = (thumb_y + index_y) // 2
            
            # Confidence berdasarkan jarak (semakin dekat = confidence tinggi)
            confidence = max(0, (self.pinch_threshold - distance) / self.pinch_threshold)
            
            # Gambar indikator pinch
            self._draw_pinch_indicator(frame, (pinch_x, pinch_y), is_pinching, distance)
            
            # Get all finger positions for workspace overlay
            finger_positions = self._get_all_finger_positions(hand_landmarks, w, h)
            
            return {
                'is_pinching': is_pinching,
                'position': (pinch_x, pinch_y),
                'distance': distance,
                'confidence': confidence,
                'thumb_pos': (thumb_x, thumb_y),
                'index_pos': (index_x, index_y),
                'hand_landmarks': hand_landmarks,
                'finger_positions': finger_positions
            }
        
        return None
    
    def get_hand_landmarks(self):
        """Dapatkan landmark tangan terakhir yang terdeteksi"""
        return self.hand_landmarks
    
    def detect_finger_gestures(self):
        """
        Deteksi gesture jari untuk kontrol saklar
        
        Returns:
            str: 'INDEX_UP', 'PEACE_SIGN', 'NONE'
        """
        if not self.hand_landmarks:
            return 'NONE'
            
        landmarks = self.hand_landmarks.landmark
        
        # Cek jari telunjuk tegak
        index_tip = landmarks[8]
        index_mcp = landmarks[5]
        index_up = index_tip.y < index_mcp.y
        
        # Cek jari tengah tegak
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
        
        if index_up and middle_up and ring_down and pinky_down:
            return 'PEACE_SIGN'
        elif index_up and not middle_up and ring_down and pinky_down:
            return 'INDEX_UP'
        else:
            return 'NONE'
    
    def _calculate_distance(self, point1, point2):
        """Hitung jarak euclidean antara dua titik"""
        return np.sqrt((point2[0] - point1[0])**2 + (point2[1] - point1[1])**2)
    
    def _draw_pinch_indicator(self, frame, position, is_pinching, distance):
        """Gambar indikator visual untuk pinch detection"""
        x, y = position
        
        # Warna berdasarkan status pinch
        color = (0, 255, 0) if is_pinching else (0, 0, 255)  # Hijau jika pinch, merah jika tidak
        
        # Gambar lingkaran di posisi pinch
        radius = max(5, int(30 - distance/2))
        cv2.circle(frame, (x, y), radius, color, 2)
        
        # Gambar crosshair
        cv2.line(frame, (x-10, y), (x+10, y), color, 2)
        cv2.line(frame, (x, y-10), (x, y+10), color, 2)
        
        # Text status
        status_text = "PINCH" if is_pinching else f"OPEN ({int(distance)}px)"
        cv2.putText(frame, status_text, (x+15, y-15), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)
    
    def _get_all_finger_positions(self, hand_landmarks, frame_width, frame_height):
        """Dapatkan posisi semua ujung jari untuk overlay di workspace"""
        finger_positions = {}
        
        # MediaPipe landmark indices untuk ujung jari
        finger_tips = {
            'thumb': 4,      # Jempol
            'index': 8,      # Telunjuk
            'middle': 12,    # Tengah
            'ring': 16,      # Manis
            'pinky': 20      # Kelingking
        }
        
        for finger_name, landmark_id in finger_tips.items():
            landmark = hand_landmarks.landmark[landmark_id]
            x = int(landmark.x * frame_width)
            y = int(landmark.y * frame_height)
            finger_positions[finger_name] = (x, y)
        
        # Tambahkan wrist position
        wrist = hand_landmarks.landmark[0]
        finger_positions['wrist'] = (int(wrist.x * frame_width), int(wrist.y * frame_height))
        
        return finger_positions
    
    def convert_camera_to_workspace(self, camera_pos, camera_size, workspace_rect):
        """
        Convert posisi dari koordinat kamera ke koordinat workspace
        
        Args:
            camera_pos: (x, y) posisi di kamera
            camera_size: (width, height) ukuran frame kamera
            workspace_rect: pygame.Rect area workspace
            
        Returns:
            (x, y) posisi di workspace
        """
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
    
    def set_pinch_threshold(self, threshold):
        """Set threshold untuk deteksi pinch"""
        self.pinch_threshold = max(10, min(100, threshold))
    
    def get_pinch_threshold(self):
        """Dapatkan threshold pinch saat ini"""
        return self.pinch_threshold
