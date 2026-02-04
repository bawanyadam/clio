import unittest
import os

class TestSearchInput(unittest.TestCase):
    def test_search_input_component_exists(self):
        """Verify that the SearchInput component exists."""
        self.assertTrue(os.path.exists("frontend/src/components/SearchInput.tsx"), "SearchInput.tsx not found")

    def test_page_uses_search_input(self):
        """Verify that page.tsx imports and uses SearchInput."""
        with open("frontend/src/app/page.tsx", "r") as f:
            content = f.read()
            self.assertIn("SearchInput", content, "page.tsx does not seem to use SearchInput component")

if __name__ == '__main__':
    unittest.main()
