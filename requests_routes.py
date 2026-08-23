from flask import Blueprint, request, jsonify
import time
import uuid
from database import get_db_connection, row_to_dict

requests_bp = Blueprint('requests_bp', __name__)

VALID_STATUSES = {
    'pending_family',
    'approved',
    'accepted',
    'on_the_way',
    'picked_up',
    'completed',
    'rejected'
}

VALID_CATEGORIES = {'groceries', 'home', 'ride', 'medicine', 'other'}


@requests_bp.route('/api/requests', methods=['GET'])
def get_requests():
    """Retrieve all requests with optional status filtering and pagination."""
    status = request.args.get('status')
    limit = request.args.get('limit', default=50, type=int)

    with get_db_connection() as conn:
        cursor = conn.cursor()
        if status:
            cursor.execute(
                "SELECT * FROM requests WHERE status = ? ORDER BY created_at DESC LIMIT ?",
                (status, limit)
            )
        else:
            cursor.execute(
                "SELECT * FROM requests ORDER BY created_at DESC LIMIT ?",
                (limit,)
            )
        rows = cursor.fetchall()
        return jsonify([row_to_dict(row) for row in rows]), 200


@requests_bp.route('/api/requests/active', methods=['GET'])
def get_active_request():
    """Get the currently active ongoing request."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT * FROM requests 
            WHERE is_active = 1 
            ORDER BY created_at DESC 
            LIMIT 1
            """
        )
        row = cursor.fetchone()
        return jsonify(row_to_dict(row)), 200


@requests_bp.route('/api/requests/history', methods=['GET'])
def get_history():
    """Get past completed or rejected requests."""
    limit = request.args.get('limit', default=20, type=int)
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT * FROM requests 
            WHERE status IN ('completed', 'rejected') OR is_active = 0
            ORDER BY updated_at DESC 
            LIMIT ?
            """,
            (limit,)
        )
        rows = cursor.fetchall()
        return jsonify([row_to_dict(row) for row in rows]), 200


@requests_bp.route('/api/requests/<req_id>', methods=['GET'])
def get_request_by_id(req_id):
    """Retrieve a single request by ID."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM requests WHERE id = ?", (req_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Request not found"}), 404
        return jsonify(row_to_dict(row)), 200


@requests_bp.route('/api/requests', methods=['POST'])
def create_request():
    """Create a new help request."""
    data = request.get_json() or {}

    title = data.get('title', 'Help Request').strip()
    description = data.get('description', '').strip()
    category = data.get('category', 'other')
    if category not in VALID_CATEGORIES:
        category = 'other'

    elder = data.get('elder', 'Mary')
    family = data.get('family', 'Sarah')
    helper = data.get('helper', 'Alex')
    estimated_cost = float(data.get('estimatedCost', 0.0))
    location = data.get('location', "Mary's home")
    status = data.get('status', 'pending_family')
    if status not in VALID_STATUSES:
        status = 'pending_family'

    now = int(time.time() * 1000)
    req_id = data.get('id') or f"req_{now}_{uuid.uuid4().hex[:6]}"

    with get_db_connection() as conn:
        cursor = conn.cursor()

        # Archive any previous active requests if creating a new active request
        cursor.execute("UPDATE requests SET is_active = 0 WHERE is_active = 1")

        cursor.execute("""
            INSERT INTO requests (
                id, title, description, category, status,
                elder, family, helper, estimated_cost,
                created_at, updated_at, location, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        """, (
            req_id, title, description, category, status,
            elder, family, helper, estimated_cost,
            now, now, location
        ))

        # Log creation
        cursor.execute("""
            INSERT INTO activity_log (request_id, action, performed_by, timestamp, details)
            VALUES (?, 'created', ?, ?, ?)
        """, (req_id, elder, now, f"Created {title}: {description}"))

        conn.commit()

        cursor.execute("SELECT * FROM requests WHERE id = ?", (req_id,))
        new_row = cursor.fetchone()
        return jsonify(row_to_dict(new_row)), 201


@requests_bp.route('/api/requests/<req_id>/status', methods=['PATCH'])
def update_status(req_id):
    """Advance or update the request status (e.g. approve, accept, deliver, reject)."""
    data = request.get_json() or {}
    new_status = data.get('status')
    reject_reason = data.get('rejectReason')
    performed_by = data.get('performedBy', 'User')

    if not new_status or new_status not in VALID_STATUSES:
        return jsonify({"error": f"Invalid status: {new_status}"}), 400

    now = int(time.time() * 1000)
    is_terminal = new_status in ('completed', 'rejected')

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM requests WHERE id = ?", (req_id,))
        existing = cursor.fetchone()
        if not existing:
            return jsonify({"error": "Request not found"}), 404

        if reject_reason:
            cursor.execute("""
                UPDATE requests 
                SET status = ?, reject_reason = ?, updated_at = ?, is_active = ?
                WHERE id = ?
            """, (new_status, reject_reason, now, 0 if is_terminal else 1, req_id))
        else:
            cursor.execute("""
                UPDATE requests 
                SET status = ?, updated_at = ?, is_active = ?
                WHERE id = ?
            """, (new_status, now, 0 if is_terminal else 1, req_id))

        # Record activity log
        cursor.execute("""
            INSERT INTO activity_log (request_id, action, performed_by, timestamp, details)
            VALUES (?, ?, ?, ?, ?)
        """, (req_id, f"status_change_to_{new_status}", performed_by, now, reject_reason or f"Status updated to {new_status}"))

        conn.commit()

        cursor.execute("SELECT * FROM requests WHERE id = ?", (req_id,))
        updated_row = cursor.fetchone()
        return jsonify(row_to_dict(updated_row)), 200


@requests_bp.route('/api/requests/<req_id>', methods=['PATCH'])
def update_request(req_id):
    """Generic update for request fields."""
    data = request.get_json() or {}
    now = int(time.time() * 1000)

    allowed_fields = {
        'title': 'title',
        'description': 'description',
        'category': 'category',
        'status': 'status',
        'estimatedCost': 'estimated_cost',
        'rejectReason': 'reject_reason',
        'location': 'location',
        'helper': 'helper',
        'family': 'family',
    }

    set_clauses = ["updated_at = ?"]
    params = [now]

    for key, col in allowed_fields.items():
        if key in data:
            set_clauses.append(f"{col} = ?")
            params.append(data[key])

    params.append(req_id)

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM requests WHERE id = ?", (req_id,))
        if not cursor.fetchone():
            return jsonify({"error": "Request not found"}), 404

        query = f"UPDATE requests SET {', '.join(set_clauses)} WHERE id = ?"
        cursor.execute(query, params)
        conn.commit()

        cursor.execute("SELECT * FROM requests WHERE id = ?", (req_id,))
        return jsonify(row_to_dict(cursor.fetchone())), 200


@requests_bp.route('/api/requests/clear', methods=['POST'])
def clear_active_request():
    """Clear currently active request (set is_active = 0)."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE requests SET is_active = 0 WHERE is_active = 1")
        conn.commit()
        return jsonify({"message": "Active request cleared"}), 200


@requests_bp.route('/api/requests/<req_id>', methods=['DELETE'])
def delete_request(req_id):
    """Delete a request by ID."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM requests WHERE id = ?", (req_id,))
        conn.commit()
        return jsonify({"message": "Request deleted"}), 200
