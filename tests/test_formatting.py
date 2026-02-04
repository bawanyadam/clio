import unittest
import io
import os
import sys
from unittest.mock import patch

sys.path.append(os.getcwd())
from search import display_results

class TestFormatting(unittest.TestCase):
    def test_display_results(self):
        """Test formatting and displaying search results."""
        sample_results = [
            {
                "uuid": "1",
                "name": "Test Conv",
                "summary": "This is a summary."
            }
        ]
        
        captured_output = io.StringIO()
        sys.stdout = captured_output
        try:
            display_results(sample_results)
        finally:
            sys.stdout = sys.__stdout__
            
        output = captured_output.getvalue()
        self.assertIn("Test Conv", output)
        self.assertIn("This is a summary.", output)
        self.assertIn("1", output)

    def test_display_no_results(self):
        """Test display when no results are found."""
        captured_output = io.StringIO()
        sys.stdout = captured_output
        try:
            display_results([])
        finally:
            sys.stdout = sys.__stdout__
            
        output = captured_output.getvalue()
        self.assertIn("No results found.", output)

if __name__ == '__main__':
    unittest.main()
