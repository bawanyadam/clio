import unittest
import os
import sys
from unittest.mock import patch

sys.path.append(os.getcwd())
from search import parse_args

class TestCLI(unittest.TestCase):
    def test_parse_query(self):
        """Test parsing the query argument."""
        with patch('sys.argv', ['search.py', '--query', 'test']):
            args = parse_args()
            self.assertEqual(args.query, 'test')

    def test_parse_short_query(self):
        """Test parsing the short query argument."""
        with patch('sys.argv', ['search.py', '-q', 'test']):
            args = parse_args()
            self.assertEqual(args.query, 'test')

    def test_parse_dates(self):
        """Test parsing the start and end date arguments."""
        with patch('sys.argv', ['search.py', '--start', '2026-01-01', '--end', '2026-02-01']):
            args = parse_args()
            self.assertEqual(args.start, '2026-01-01')
            self.assertEqual(args.end, '2026-02-01')

    def test_parse_file(self):
        """Test parsing the file argument."""
        with patch('sys.argv', ['search.py', '--file', 'my_convs.json']):
            args = parse_args()
            self.assertEqual(args.file, 'my_convs.json')

if __name__ == '__main__':
    unittest.main()
