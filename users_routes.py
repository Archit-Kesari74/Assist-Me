from flask import Blueprint, jsonify
from database import get_db_connection

users_bp = Blueprint('users_bp', __name__)


@users_bp.route('/api/users', methods=['GET'])
def get_users():
    """Get all registered user profiles."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users")
        rows = cursor.fetchall()
        return jsonify([dict(row) for row in rows]), 200


@users_bp.route('/api/users/<role>', methods=['GET'])
def get_user_by_role(role):
    """Get user profile by role ('elder', 'family', 'helper')."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE role = ?", (role,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": f"User with role {role} not found"}), 404
        return jsonify(dict(row)), 200


@users_bp.route('/api/stats', methods=['GET'])
def get_stats():
    """Retrieve app-wide stats for dashboard, family, and helper summaries."""
    with get_db_connection() as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM requests")
        total_requests = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM requests WHERE is_active = 1")
        active_count = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM requests WHERE status = 'completed'")
        completed_deliveries = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM requests WHERE status = 'approved'")
        pending_helper = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM requests WHERE status = 'pending_family'")
        pending_family = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM requests WHERE status = 'rejected'")
        rejected_count = cursor.fetchone()[0]

        cursor.execute("SELECT COALESCE(SUM(estimated_cost), 0) FROM requests WHERE status = 'completed'")
        total_delivered_value = cursor.fetchone()[0]

        return jsonify({
            "totalRequests": total_requests,
            "activeCount": active_count,
            "completedDeliveries": completed_deliveries,
            "pendingFamily": pending_family,
            "pendingHelper": pending_helper,
            "rejectedCount": rejected_count,
            "totalDeliveredValue": total_delivered_value,
        }), 200
