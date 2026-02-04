import unittest
import os

class TestDeepSearchCards(unittest.TestCase):
    def test_conversation_card_has_matches_logic(self):
        """Verify that ConversationCard.tsx handles matches."""
        with open("frontend/src/components/ConversationCard.tsx", "r") as f:
            content = f.read()
            self.assertIn("matches", content, "ConversationCard does not seem to handle 'matches' prop")
            self.assertIn("match", content.lower(), "ConversationCard does not seem to show match counts")

if __name__ == '__main__':
    unittest.main()
