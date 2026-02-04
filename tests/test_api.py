import unittest
import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.getcwd())

class TestAPI(unittest.TestCase):
    def test_health_check(self):
        """Test the health check endpoint."""
        from api import app
        client = TestClient(app)
        response = client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

if __name__ == '__main__':
    unittest.main()
