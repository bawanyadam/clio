import unittest
import os

class TestLayout(unittest.TestCase):
    def test_main_page_exists(self):
        """Verify that the main page.tsx exists."""
        self.assertTrue(os.path.exists("frontend/src/app/page.tsx"), "page.tsx not found")

    def test_layout_structure(self):
        """Check for basic layout markers in page.tsx."""
        with open("frontend/src/app/page.tsx", "r") as f:
            content = f.read()
            # We expect a centered container eventually
            # For now, we'll just check if it's been modified from the default
            self.assertIn("max-w-", content, "Layout does not seem to have a max-width container")

    def test_search_title(self):
        """Verify that the page has the ClaudeJSON Search title."""
        with open("frontend/src/app/page.tsx", "r") as f:
            content = f.read()
            self.assertIn("ClaudeJSON Search", content, "Page title 'ClaudeJSON Search' not found")

if __name__ == '__main__':
    unittest.main()
