import unittest
import sys
import os
from unittest.mock import patch
from fastapi.testclient import TestClient

sys.path.append(os.getcwd())

class TestEnhancedAPI(unittest.TestCase):
    def test_search_endpoint_enhanced(self):
        """Test the /search endpoint uses enhanced search logic."""
        from api import app
        
        # We'll use a sample that reflects the new return structure of search_keyword_enhanced
        mock_enhanced_results = [
            {
                "uuid": "conv-1",
                "name": "Test",
                "matches": [
                    {"message_uuid": "msg-1", "context": "...test..."}
                ]
            }
        ]
        
        with patch("search.search_keyword_enhanced", return_value=mock_enhanced_results):
            client = TestClient(app)
            response = client.get("/search?query=test")
            
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(len(data), 1)
            self.assertIn("matches", data[0])
            self.assertEqual(data[0]["matches"][0]["message_uuid"], "msg-1")

if __name__ == '__main__':
    unittest.main()
