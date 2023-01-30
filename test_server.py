import server
import unittest


class MyAppIntegrationTestCase(unittest.TestCase):
    """Integration tests: testing Flask server."""

    def test_index(self):
        client = server.app.test_client()
        result = client.get('/')
        self.assertIn(b'<h1>Welcome to</h1>', result.data)


if __name__ == '__main__':
    unittest.main()
