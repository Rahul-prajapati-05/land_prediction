"""
HomePrice AI - One-Click Full Stack Launcher
Starts both:
1. Python Flask Backend API (Port 5000)
2. React Vite Development Server (Port 5173)
"""

import os
import sys
import time
import subprocess
import webbrowser

def main():
    print("=" * 70)
    print("               HomePrice AI - Machine Learning Platform               ")
    print("=" * 70)
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'model', 'house_price_model.joblib')
    
    # 1. Check if model is trained
    if not os.path.exists(model_path):
        print("\n[+] Model artifact not detected. Running training pipeline...")
        train_script = os.path.join(base_dir, 'model', 'train_model.py')
        subprocess.run([sys.executable, train_script], check=True)
        print("[✓] Model trained and serialized successfully.\n")
    else:
        print("[✓] Pre-trained Scikit-learn Linear Regression model verified.")

    # 2. Start Flask Backend Server (Port 5000)
    print("[+] Launching Flask Web & API Server on http://127.0.0.1:5000 ...")
    backend_script = os.path.join(base_dir, 'backend', 'app.py')
    backend_process = subprocess.Popen([sys.executable, backend_script])
    
    # 3. Start React Vite Dev Server (Port 5173)
    frontend_dir = os.path.join(base_dir, 'frontend')
    npm_cmd = 'npm.cmd' if os.name == 'nt' else 'npm'
    print("[+] Launching React Vite Dev Server on http://localhost:5173 ...")
    frontend_process = None
    try:
        frontend_process = subprocess.Popen([npm_cmd, 'run', 'dev'], cwd=frontend_dir)
    except Exception as e:
        print(f"[!] Note: Could not auto-start Vite ({e}). Flask will serve the build on Port 5000.")

    # Allow 3 seconds for both servers to spin up
    time.sleep(3)
    
    print("\n" + "=" * 70)
    print(" [🚀] APPLICATION IS RUNNING!")
    print("      • Frontend (Vite Dev Server):  http://localhost:5173")
    print("      • Backend & Unified App (Flask): http://127.0.0.1:5000")
    print("=" * 70)
    print("[i] Press Ctrl+C in this terminal to terminate all servers.\n")
    
    # 4. Open Browser to http://localhost:5173
    try:
        webbrowser.open("http://localhost:5173")
    except Exception:
        pass

    try:
        if frontend_process:
            frontend_process.wait()
        else:
            backend_process.wait()
    except KeyboardInterrupt:
        print("\n[!] Shutting down all servers gracefully...")
        backend_process.terminate()
        if frontend_process:
            frontend_process.terminate()
        print("[✓] All servers stopped.")

if __name__ == '__main__':
    main()
