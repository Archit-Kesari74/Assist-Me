import unittest
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import get_db_connection, init_db


class BackendTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        # Clean requests table for test isolation
        with get_db_connection() as conn:
            conn.execute("DELETE FROM activity_log")
            conn.execute("DELETE FROM requests")
            conn.commit()

    def test_01_health_check(self):
        """Test health endpoint and website UI rendering."""
        res_ui = self.client.get('/')
        self.assertEqual(res_ui.status_code, 200)
        self.assertIn(b'Assist Me', res_ui.data)

        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['status'], 'healthy')

    def test_02_users_and_stats(self):
        """Test users and initial stats endpoints."""
        res = self.client.get('/api/users')
        self.assertEqual(res.status_code, 200)
        users = res.get_json()
        self.assertEqual(len(users), 3)
        roles = [u['role'] for u in users]
        self.assertIn('elder', roles)
        self.assertIn('family', roles)
        self.assertIn('helper', roles)

        res_stats = self.client.get('/api/stats')
        self.assertEqual(res_stats.status_code, 200)
        stats = res_stats.get_json()
        self.assertEqual(stats['totalRequests'], 0)

    def test_03_nlp_parser(self):
        """Test NLP transcript parser with various categories."""
        # Groceries
        res = self.client.post('/api/parse', json={"text": "I need milk, bread and eggs please"})
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['category'], 'groceries')
        self.assertFalse(data['isMedicine'])

        # Medicine
        res_med = self.client.post('/api/parse', json={"text": "I need my blood pressure pills"})
        self.assertEqual(res_med.status_code, 200)
        data_med = res_med.get_json()
        self.assertEqual(data_med['category'], 'medicine')
        self.assertTrue(data_med['isMedicine'])
        self.assertTrue(data_med['needsSafetyReview'])

        # Ride
        res_ride = self.client.post('/api/parse', json={"text": "Please take me to the doctor clinic"})
        self.assertEqual(res_ride.status_code, 200)
        self.assertEqual(res_ride.get_json()['category'], 'ride')

        # Home repair
        res_home = self.client.post('/api/parse', json={"text": "Can someone help repair the leaking tap?"})
        self.assertEqual(res_home.status_code, 200)
        self.assertEqual(res_home.get_json()['category'], 'home')

    def test_04_request_lifecycle(self):
        """Test full request flow: Create -> Approve -> Accept -> On the way -> Picked up -> Completed."""
        # 1. Create request
        req_payload = {
            "title": "Groceries",
            "description": "Milk and bread from corner store",
            "category": "groceries",
            "elder": "Mary",
            "family": "Sarah",
            "helper": "Alex",
            "estimatedCost": 280.0
        }
        res_create = self.client.post('/api/requests', json=req_payload)
        self.assertEqual(res_create.status_code, 201)
        created = res_create.get_json()
        req_id = created['id']
        self.assertEqual(created['status'], 'pending_family')
        self.assertTrue(created['isActive'])

        # 2. Get active request
        res_active = self.client.get('/api/requests/active')
        self.assertEqual(res_active.status_code, 200)
        self.assertEqual(res_active.get_json()['id'], req_id)

        # 3. Family Approves
        res_appr = self.client.patch(f'/api/requests/{req_id}/status', json={
            "status": "approved",
            "performedBy": "Sarah"
        })
        self.assertEqual(res_appr.status_code, 200)
        self.assertEqual(res_appr.get_json()['status'], 'approved')

        # 4. Helper Accepts
        res_acc = self.client.patch(f'/api/requests/{req_id}/status', json={
            "status": "accepted",
            "performedBy": "Alex"
        })
        self.assertEqual(res_acc.status_code, 200)
        self.assertEqual(res_acc.get_json()['status'], 'accepted')

        # 5. On the way
        res_otw = self.client.patch(f'/api/requests/{req_id}/status', json={
            "status": "on_the_way",
            "performedBy": "Alex"
        })
        self.assertEqual(res_otw.status_code, 200)
        self.assertEqual(res_otw.get_json()['status'], 'on_the_way')

        # 6. Picked up
        res_pu = self.client.patch(f'/api/requests/{req_id}/status', json={
            "status": "picked_up",
            "performedBy": "Alex"
        })
        self.assertEqual(res_pu.status_code, 200)
        self.assertEqual(res_pu.get_json()['status'], 'picked_up')

        # 7. Completed (delivered)
        res_comp = self.client.patch(f'/api/requests/{req_id}/status', json={
            "status": "completed",
            "performedBy": "Alex"
        })
        self.assertEqual(res_comp.status_code, 200)
        self.assertEqual(res_comp.get_json()['status'], 'completed')
        self.assertFalse(res_comp.get_json()['isActive'])

        # 8. Check History and Stats
        res_hist = self.client.get('/api/requests/history')
        self.assertEqual(res_hist.status_code, 200)
        history = res_hist.get_json()
        self.assertEqual(len(history), 1)
        self.assertEqual(history[0]['id'], req_id)

        res_stats = self.client.get('/api/stats')
        self.assertEqual(res_stats.get_json()['completedDeliveries'], 1)
        self.assertEqual(res_stats.get_json()['totalDeliveredValue'], 280.0)

    def test_05_rejection_flow(self):
        """Test family rejecting a request with reason."""
        res_create = self.client.post('/api/requests', json={
            "title": "Ride to mall",
            "description": "Need a ride to downtown mall",
            "category": "ride",
            "estimatedCost": 250.0
        })
        req_id = res_create.get_json()['id']

        res_rej = self.client.patch(f'/api/requests/{req_id}/status', json={
            "status": "rejected",
            "rejectReason": "I have already booked an Uber for you",
            "performedBy": "Sarah"
        })
        self.assertEqual(res_rej.status_code, 200)
        rej_data = res_rej.get_json()
        self.assertEqual(rej_data['status'], 'rejected')
        self.assertEqual(rej_data['rejectReason'], "I have already booked an Uber for you")
        self.assertFalse(rej_data['isActive'])


if __name__ == '__main__':
    unittest.main()
