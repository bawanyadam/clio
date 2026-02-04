import unittest
import os

class TestDatePicker(unittest.TestCase):
    def test_page_has_date_inputs(self):
        """Verify that page.tsx contains date inputs or a date picker component."""
        with open("frontend/src/app/page.tsx", "r") as f:
            content = f.read().lower()
            self.assertIn("startdate", content, "page.tsx does not seem to have start date logic")
            self.assertIn("enddate", content, "page.tsx does not seem to have end date logic")

if __name__ == '__main__':
    unittest.main()