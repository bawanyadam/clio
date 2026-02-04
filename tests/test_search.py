import unittest
import os
import sys

class TestSearchScript(unittest.TestCase):
    def test_search_script_exists(self):
        """Verify that search.py exists in the current directory."""
        self.assertTrue(os.path.exists("search.py"), "search.py does not exist")

    def test_search_script_imports(self):
        """Verify that search.py can be imported without errors."""
        sys.path.append(os.getcwd())
        try:
            import search
        except ImportError:
            self.fail("Failed to import search.py")

if __name__ == '__main__':
    unittest.main()