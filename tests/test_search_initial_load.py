import unittest
import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.getcwd())

class TestSearchInitialLoad(unittest.TestCase):
    def test_search_empty_query_returns_all(self):
        """Test that /search returns all conversations when no query is provided."""
        from api import app
        client = TestClient(app)
        response = client.get("/search")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreater(len(data), 0)
        # Should be sorted newest first (based on the spec requirement)
        # We'll check sorting in implementation.

    def test_search_pagination(self):
        """Test that /search supports limit and offset."""
        from api import app
        client = TestClient(app)
        
        # Get first 2
        resp1 = client.get("/search?limit=2")
        self.assertEqual(len(resp1.json()), 2)
        
        # Get next 2
        resp2 = client.get("/search?limit=2&offset=2")
        self.assertEqual(len(resp2.json()), 2)
        
        # Ensure they are different
        self.assertNotEqual(resp1.json()[0]["uuid"], resp2.json()[0]["uuid"])

    def test_archive_stats(self):
        """Test that /archive/stats returns correct metadata."""
        from api import app
        client = TestClient(app)
        response = client.get("/archive/stats")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("total_count", data)
        self.assertIn("start_date", data)
        self.assertIn("end_date", data)
        self.assertGreater(data["total_count"], 0)

if __name__ == '__main__':
    unittest.main()
