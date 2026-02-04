import unittest
import os

class TestDebouncing(unittest.TestCase):
    def test_page_has_debouncing(self):
        """Verify that page.tsx contains debouncing logic."""
        with open("frontend/src/app/page.tsx", "r") as f:
            content = f.read()
            # We expect a timeout mechanism for debouncing
            self.assertIn("setTimeout", content, "page.tsx does not seem to have debouncing logic (no setTimeout found)")

if __name__ == '__main__':
    unittest.main()
