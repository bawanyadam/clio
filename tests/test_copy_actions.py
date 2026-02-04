import unittest
import os

class TestCopyActions(unittest.TestCase):
    def test_components_have_copy_logic(self):
        """Verify that components contain clipboard logic."""
        found = False
        for root, dirs, files in os.walk("frontend/src/components"):
            for file in files:
                if file.endswith(".tsx"):
                    with open(os.path.join(root, file), "r") as f:
                        if "navigator.clipboard.writeText" in f.read():
                            found = True
                            break
        self.assertTrue(found, "No clipboard copy logic found in components")

if __name__ == '__main__':
    unittest.main()
