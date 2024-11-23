import unittest
import os
import requests
import coverage
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
from webdriver_manager.firefox import GeckoDriverManager

class TestSeleniumScript(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.firefox_service = Service(GeckoDriverManager().install())
        firefox_options = Options()
        options = [
            "--headless",
            "--window-size=1920,1200",
            "--ignore-certificate-errors",
            "--disable-extensions",
            "--no-sandbox",
            "--disable-dev-shm-usage"
        ]
        for option in options:
            firefox_options.add_argument(option)
        firefox_options.binary_location = '/usr/bin/firefox'
        cls.driver = webdriver.Firefox(service=cls.firefox_service, options=firefox_options)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_page_title(self):
        self.driver.get("https://sabry134.github.io/tcgm_tests.io/")
        self.assertEqual(self.driver.title, "Home", "Page title is incorrect")

    def test_start_button(self):
        start_button = self.driver.find_element(By.XPATH, "//button[text()='Start new project']")
        self.assertTrue(start_button.is_displayed(), "Start new project button is not visible")
        self.assertTrue(start_button.is_enabled(), "Start new project button is not clickable")
        self.assertEqual(start_button.text, "Start new project", "Button text is incorrect")
        start_button.click()
        self.assertIn("component-selection", self.driver.current_url, "Redirection URL is incorrect")

    def test_recent_paths(self):
        recent_paths = self.driver.find_elements(By.CLASS_NAME, "recent-path")
        self.assertGreater(len(recent_paths), 0, "Recent paths are not displayed")
        self.assertEqual(recent_paths[0].text, "./Michael/zosia", "First recent path is incorrect")
        self.assertEqual(recent_paths[1].text, "./Documents/Projects", "Second recent path is incorrect")

    def test_images_and_links(self):
        images = self.driver.find_elements(By.TAG_NAME, "img")
        for image in images:
            self.assertNotEqual(image.get_attribute("naturalWidth"), "0", f"Broken image found: {image.get_attribute('src')}")
        
        links = self.driver.find_elements(By.TAG_NAME, "a")
        for link in links:
            href = link.get_attribute("href")
            if href:
                response = requests.head(href)
                self.assertEqual(response.status_code, 200, f"Broken link found: {href}")

if __name__ == "__main__":
    cov = coverage.Coverage()
    cov.start()

    unittest.main()

    cov.stop()
    cov.save()
    cov.report()
    cov.html_report(directory="htmlcov")
    print("Coverage report saved in 'htmlcov' directory.")
