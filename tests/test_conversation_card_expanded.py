import unittest
import os

class TestConversationCardExpanded(unittest.TestCase):
    def test_conversation_card_has_default_expanded_prop(self):
        """Verify that ConversationCard.tsx handles defaultExpanded prop."""
        with open("frontend/src/components/ConversationCard.tsx", "r") as f:
            content = f.read()
            self.assertIn("defaultExpanded", content, "ConversationCard does not seem to handle 'defaultExpanded' prop")

if __name__ == '__main__':
    unittest.main()
