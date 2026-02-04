import unittest
import json
import os
import sys
from unittest.mock import patch, mock_open

sys.path.append(os.getcwd())
from search import load_conversations

class TestDataLoader(unittest.TestCase):
    def test_load_valid_json(self):
        """Test loading a valid JSON file."""
        mock_data = json.dumps([{"uuid": "123", "name": "Test Conversation"}])
        with patch("builtins.open", mock_open(read_data=mock_data)):
            with patch("os.path.exists", return_value=True):
                data = load_conversations("conversations.json")
                self.assertEqual(len(data), 1)
                self.assertEqual(data[0]["name"], "Test Conversation")

    def test_load_file_not_found(self):
        """Test handling of missing file."""
        with patch("os.path.exists", return_value=False):
            with self.assertRaises(FileNotFoundError):
                load_conversations("non_existent.json")

    def test_load_invalid_json(self):
        """Test handling of invalid JSON."""
        with patch("builtins.open", mock_open(read_data="invalid json")):
            with patch("os.path.exists", return_value=True):
                with self.assertRaises(json.JSONDecodeError):
                    load_conversations("conversations.json")

if __name__ == '__main__':
    unittest.main()
