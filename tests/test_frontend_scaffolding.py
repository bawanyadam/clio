import unittest
import os

class TestFrontendScaffolding(unittest.TestCase):
    def test_frontend_directory_exists(self):
        """Verify that the frontend directory exists."""
        self.assertTrue(os.path.isdir("frontend"), "frontend directory does not exist")

    def test_package_json_exists(self):
        """Verify that package.json exists in the frontend directory."""
        self.assertTrue(os.path.exists("frontend/package.json"), "package.json not found in frontend directory")

if __name__ == '__main__':
    unittest.main()
