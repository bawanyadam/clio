import unittest
import os
import sys
from typing import List, Dict, Any

sys.path.append(os.getcwd())
from search import search_keyword_enhanced

class TestEnhancedSearch(unittest.TestCase):
    def setUp(self):
        self.sample_data = [
            {
                "uuid": "conv-1",
                "name": "The Three-Body Problem",
                "summary": "Sci-fi discussion about Trisolarans.",
                "created_at": "2026-02-02T23:42:03Z",
                "chat_messages": [
                    {"uuid": "msg-1", "text": "What are sophons?", "created_at": "2026-02-02T23:42:04Z"},
                    {"uuid": "msg-2", "text": "Sophons are unfolded protons.", "created_at": "2026-02-02T23:42:06Z"}
                ]
            }
        ]

    def test_search_returns_matches(self):
        """Test that search returns specific message matches."""
        results = search_keyword_enhanced(self.sample_data, "sophon")
        self.assertEqual(len(results), 1)
        conv = results[0]
        self.assertEqual(conv["uuid"], "conv-1")
        self.assertEqual(len(conv["matches"]), 2)
        self.assertEqual(conv["matches"][0]["message_uuid"], "msg-1")
        self.assertEqual(conv["matches"][1]["message_uuid"], "msg-2")

    def test_search_context_snippet(self):
        """Test that search returns context snippets."""
        results = search_keyword_enhanced(self.sample_data, "protons")
        self.assertEqual(len(results), 1)
        conv = results[0]
        self.assertEqual(len(conv["matches"]), 1)
        match = conv["matches"][0]
        self.assertIn("protons", match["context"])

if __name__ == '__main__':
    unittest.main()
