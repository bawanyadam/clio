import unittest
import os

class TestResultCard(unittest.TestCase):
    def test_result_card_component_exists(self):
        """Verify that the ConversationCard component exists."""
        self.assertTrue(os.path.exists("frontend/src/components/ConversationCard.tsx"), "ConversationCard.tsx not found")

    def test_page_uses_result_cards(self):
        """Verify that page.tsx uses ConversationCard (eventually)."""
        # We'll check for the import
        with open("frontend/src/app/page.tsx", "r") as f:
            content = f.read()
            self.assertIn("ConversationCard", content, "page.tsx does not seem to use ConversationCard component")

if __name__ == '__main__':
    unittest.main()
