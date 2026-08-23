from flask import Flask, jsonify, request, make_response, render_template
import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import init_db
from routes.requests_routes import requests_bp
from routes.parser_routes import parser_bp
from routes.users_routes import users_bp


def create_app():
    templates_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
    static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

    app = Flask(__name__, template_folder=templates_dir, static_folder=static_dir)

    # Initialize SQLite database
    init_db()

    # Register Blueprints
    app.register_blueprint(requests_bp)
    app.register_blueprint(parser_bp)
    app.register_blueprint(users_bp)

    # Global CORS Handling
    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept'
        return response

    # Handle OPTIONS preflight requests globally
    @app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
    @app.route('/<path:path>', methods=['OPTIONS'])
    def handle_options(path):
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Accept'
        return response, 204

    # Serve Full UI Web Application at root
    @app.route('/', methods=['GET'])
    @app.route('/app', methods=['GET'])
    def index():
        return render_template('index.html')

    # API Directory endpoint
    @app.route('/api', methods=['GET'])
    def api_index():
        return jsonify({
            "service": "Assist Me API Backend",
            "status": "online",
            "version": "1.0.0",
            "endpoints": [
                "/api/health",
                "/api/requests",
                "/api/requests/active",
                "/api/requests/history",
                "/api/parse",
                "/api/users",
                "/api/stats"
            ]
        }), 200

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "version": "1.0.0"
        }), 200

    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        if request.path.startswith('/api'):
            return jsonify({"error": "Resource not found"}), 404
        return render_template('index.html'), 200

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app = create_app()
    print(f"🚀 Assist Me Website & Backend Server starting on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
