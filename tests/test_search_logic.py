import unittest
import os
import sys

sys.path.append(os.getcwd())
from search import search_keyword

class TestSearchLogic(unittest.TestCase):
    def setUp(self):
        self.sample_data = [
            {
                "uuid": "1",
                "name": "Three-Body Problem Discussion",
                "summary": "Talking about sophons and dimensions.",
                "chat_messages": [
                    {"text": "What are sophons?"},
                    {"text": "They are protons."}
                ]
            },
            {
                "uuid": "2",
                "name": "Tax Filing",
                "summary": "Delaware C Corp requirements.",
                "chat_messages": [
                    {"text": "When is the deadline?"},
                    {"text": "March 1st."}
                ]
            }
        ]

    def test_search_by_name(self):
        """Test searching by conversation name."""
        results = search_keyword(self.sample_data, "three-body")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["uuid"], "1")

    def test_search_by_summary(self):
        """Test searching by conversation summary."""
        results = search_keyword(self.sample_data, "delaware")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["uuid"], "2")

    def test_search_by_message(self):
        """Test searching by message text."""
        results = search_keyword(self.sample_data, "protons")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["uuid"], "1")

    def test_search_case_insensitive(self):
        """Test that search is case-insensitive."""
        results = search_keyword(self.sample_data, "SOPHONS")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["uuid"], "1")

    def test_search_no_results(self):
        """Test search with no matches."""
        results = search_keyword(self.sample_data, "nonexistent")
        self.assertEqual(len(results), 0)

if __name__ == '__main__':
    unittest.main()
