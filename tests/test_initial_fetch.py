import unittest
import os

class TestInitialFetch(unittest.TestCase):
    def test_page_fetches_on_mount(self):
        """Verify that page.tsx fetches data even if query is empty."""
        with open("frontend/src/app/page.tsx", "r") as f:
            content = f.read()
            # We should NOT see an early return if (!debouncedQuery && !startDate && !endDate)
            self.assertNotIn("if (!debouncedQuery && !startDate && !endDate)", content, "page.tsx still has an early return for empty queries")

if __name__ == '__main__':
    unittest.main()
