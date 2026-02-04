import unittest
import os

class TestAPIConnection(unittest.TestCase):
    def test_page_calls_api(self):
        """Verify that page.tsx contains logic to call the search API."""
        with open("frontend/src/app/page.tsx", "r") as f:
            content = f.read()
            self.assertIn("fetch", content, "page.tsx does not seem to use fetch")
            self.assertIn("8000/search", content, "page.tsx does not seem to call the search endpoint")

if __name__ == '__main__':
    unittest.main()
