import unittest
import os

class TestFilterUI(unittest.TestCase):
    def test_filter_popover_component_exists(self):
        """Verify that the FilterPopover component exists."""
        self.assertTrue(os.path.exists("frontend/src/components/FilterPopover.tsx"), "FilterPopover.tsx not found")

    def test_page_uses_filter_popover(self):
        """Verify that page.tsx uses FilterPopover."""
        with open("frontend/src/app/page.tsx", "r") as f:
            content = f.read()
            self.assertIn("FilterPopover", content, "page.tsx does not seem to use FilterPopover component")

if __name__ == '__main__':
    unittest.main()
