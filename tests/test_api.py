import unittest
import sys
import os
from unittest.mock import patch
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

    @patch("search.load_conversations")
    @patch("search.search_keyword_enhanced")
    @patch("search.filter_by_date")
    def test_search_endpoint(self, mock_filter, mock_keyword, mock_load):
        """Test the /search endpoint calls the correct logic."""
        from api import app
        mock_load.return_value = [{"uuid": "1"}]
        mock_keyword.return_value = [{"uuid": "1"}]
        mock_filter.return_value = [{"uuid": "1"}]
        
        client = TestClient(app)
        response = client.get("/search?query=test&start=2026-01-01")
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [{"uuid": "1"}])
        
        mock_load.assert_called_once()
        mock_keyword.assert_called_once()
        mock_filter.assert_called_once()

    @patch("search.load_conversations")
    @patch("search.get_conversation_by_uuid")
    def test_get_conversation_endpoint(self, mock_get, mock_load):
        """Test the /conversations/{uuid} endpoint."""
        from api import app
        mock_load.return_value = [{"uuid": "1"}]
        mock_get.return_value = {"uuid": "1", "name": "Test"}
        
        client = TestClient(app)
        response = client.get("/conversations/1")
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"uuid": "1", "name": "Test"})
        
        mock_get.assert_called_once()

    @patch("search.load_conversations")
    @patch("search.get_conversation_by_uuid")
    def test_get_conversation_not_found(self, mock_get, mock_load):
        """Test the /conversations/{uuid} endpoint returns 404 when not found."""
        from api import app
        mock_load.return_value = []
        mock_get.return_value = None
        
        client = TestClient(app)
        response = client.get("/conversations/nonexistent")
        
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
