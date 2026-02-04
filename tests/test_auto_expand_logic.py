import unittest
import os

class TestAutoExpandLogic(unittest.TestCase):
    def test_page_has_auto_expand_logic(self):
        """Verify that page.tsx passes defaultExpanded to cards when query is present."""
        with open("frontend/src/app/page.tsx", "r") as f:
            content = f.read()
            self.assertIn("defaultExpanded={!!query}", content, "page.tsx does not seem to pass defaultExpanded based on query state")

if __name__ == '__main__':
    unittest.main()
