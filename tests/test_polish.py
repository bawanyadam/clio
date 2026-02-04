import unittest
import os

class TestPolish(unittest.TestCase):
    def test_ui_has_rounded_elements(self):
        """Verify that the UI uses modern rounded corners (polish)."""
        found = False
        for root, dirs, files in os.walk("frontend/src"):
            for file in files:
                if file.endswith(".tsx"):
                    with open(os.path.join(root, file), "r") as f:
                        content = f.read()
                        if "rounded-2xl" in content or "rounded-3xl" in content:
                            found = True
                            break
        self.assertTrue(found, "No high-radius rounded corners found (rounded-2xl+)")

    def test_ui_has_animations(self):
        """Verify that the UI uses modern animations."""
        found = False
        for root, dirs, files in os.walk("frontend/src"):
            for file in files:
                if file.endswith(".tsx"):
                    with open(os.path.join(root, file), "r") as f:
                        if "animate-in" in f.read():
                            found = True
                            break
        self.assertTrue(found, "No animate-in found in components")

if __name__ == '__main__':
    unittest.main()
