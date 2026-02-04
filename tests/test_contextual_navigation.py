import unittest
import os

class TestContextualNavigation(unittest.TestCase):
    def test_detail_view_has_scrolling_logic(self):
        """Verify that ConversationDetail.tsx contains scrolling logic."""
        with open("frontend/src/components/ConversationDetail.tsx", "r") as f:
            content = f.read()
            self.assertIn("scrollIntoView", content, "ConversationDetail does not seem to have scrollIntoView logic")
            self.assertIn("ref", content, "ConversationDetail does not seem to use refs for messages")

if __name__ == '__main__':
    unittest.main()
