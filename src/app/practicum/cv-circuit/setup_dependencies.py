"""
Setup script untuk menginstal dependencies Python untuk CV Practicum
"""
import subprocess
import sys
import os

def install_package(package):
    """Install a package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        return True
    except subprocess.CalledProcessError:
        return False

def main():
    """Main installation function"""
    print("🔧 Setting up CV Practicum Dependencies...")
    print("=" * 50)
    
    # List of required packages
    packages = [
        "opencv-python==4.8.1.78",
        "mediapipe==0.10.8", 
        "pygame==2.5.2",
        "flask==2.3.3",
        "numpy==1.24.4"
    ]
    
    failed_packages = []
    
    for package in packages:
        print(f"📦 Installing {package}...")
        if install_package(package):
            print(f"✅ Successfully installed {package}")
        else:
            print(f"❌ Failed to install {package}")
            failed_packages.append(package)
        print()
    
    print("=" * 50)
    
    if failed_packages:
        print("❌ Installation completed with errors:")
        for package in failed_packages:
            print(f"   - {package}")
        print("\nPlease install these packages manually.")
        return False
    else:
        print("✅ All packages installed successfully!")
        print("\n🎉 CV Practicum is ready to use!")
        print("\nYou can now run the practicum from the Cirvia web interface.")
        return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
