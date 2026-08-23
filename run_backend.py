#!/usr/bin/env python
import os
import sys

backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
sys.path.insert(0, backend_dir)

from app import create_app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app = create_app()
    print("=" * 60)
    print(f"  Assist Me Backend API Server")
    print(f"  Server URL: http://localhost:{port}")
    print(f"  API Health: http://localhost:{port}/api/health")
    print(f"  API Docs & Endpoints: http://localhost:{port}/")
    print("=" * 60)
    app.run(host='0.0.0.0', port=port, debug=True)
