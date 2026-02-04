import unittest
import os
import sys
from datetime import datetime

sys.path.append(os.getcwd())
from search import filter_by_date

class TestDateFilter(unittest.TestCase):
    def setUp(self):
        self.sample_data = [
            {
                "uuid": "1",
                "name": "Old Conv",
                "created_at": "2026-01-01T12:00:00Z"
            },
            {
                "uuid": "2",
                "name": "New Conv",
                "created_at": "2026-02-01T12:00:00Z"
            },
            {
                "uuid": "3",
                "name": "Future Conv",
                "created_at": "2026-03-01T12:00:00Z"
            }
        ]

    def test_filter_start_date(self):
        """Test filtering with only a start date."""
        results = filter_by_date(self.sample_data, start_date="2026-02-01")
        self.assertEqual(len(results), 2)
        self.assertEqual(results[0]["uuid"], "2")
        self.assertEqual(results[1]["uuid"], "3")

    def test_filter_end_date(self):
        """Test filtering with only an end date."""
        results = filter_by_date(self.sample_data, end_date="2026-02-15")
        self.assertEqual(len(results), 2)
        self.assertEqual(results[0]["uuid"], "1")
        self.assertEqual(results[1]["uuid"], "2")

    def test_filter_date_range(self):
        """Test filtering with a start and end date."""
        results = filter_by_date(self.sample_data, start_date="2026-01-15", end_date="2026-02-15")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["uuid"], "2")

    def test_filter_exact_date(self):
        """Test filtering where date matches the boundary."""
        results = filter_by_date(self.sample_data, start_date="2026-02-01", end_date="2026-02-01")
        # Note: If we use YYYY-MM-DD, we should probably treat end_date as end of day.
        # But let's start with simple string comparison or date objects.
        pass

if __name__ == '__main__':
    unittest.main()
