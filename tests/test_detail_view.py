import unittest
import os

class TestDetailView(unittest.TestCase):
    def test_page_has_detail_logic(self):
        """Verify that page.tsx contains logic to show conversation details."""
        with open("frontend/src/app/page.tsx", "r") as f:
            content = f.read()
            self.assertIn("selectedConversation", content, "page.tsx does not seem to have state for a selected conversation")
            self.assertIn("conversations/", content, "page.tsx does not seem to call the detail endpoint")

if __name__ == '__main__':
    unittest.main()
