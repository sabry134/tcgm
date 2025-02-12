import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from dotenv import load_dotenv
import requests
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
import coverage

# Start coverage tracking
cov = coverage.Coverage()
cov.start()

load_dotenv()

firefox_service = Service(GeckoDriverManager().install())

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

# Set the Firefox binary location explicitly
firefox_options.binary_location = '/usr/bin/firefox'  # Adjust path if needed

driver = webdriver.Firefox(service=firefox_service, options=firefox_options)
driver.get("https://sabry134.github.io/tcgm_tests.io/")

assert driver.title == "Home", "Page title is incorrect"
print("Page title is correct")

start_button = driver.find_element(By.XPATH, "//button[text()='Start new project']")
assert start_button.is_displayed(), "Start new project button is not visible"
assert start_button.is_enabled(), "Start new project button is not clickable"
print("Start new project button is visible and clickable")

recent_title = driver.find_element(By.CLASS_NAME, "recent-title")
assert recent_title.is_displayed(), "'Open recent' title is not visible"
print("'Open recent' title is visible")

recent_paths_section = driver.find_element(By.CLASS_NAME, "recent-paths")
assert recent_paths_section.is_displayed(), "Recent paths section is not visible"
print("Recent paths section is visible")

recent_paths = driver.find_elements(By.CLASS_NAME, "recent-path")
assert len(recent_paths) > 0, "Recent paths are not displayed"
assert recent_paths[0].text == "./Michael/zosia", "First recent path is incorrect"
print("First recent path is displayed correctly")
assert recent_paths[1].text == "./Documents/Projects", "Second recent path is incorrect"
print("Second recent path is displayed correctly")

logo_image = driver.find_element(By.XPATH, "//img[@alt='JCCE Logo']")
assert logo_image.is_displayed(), "Logo image is not visible"
print("Logo image is visible")

assert start_button.text == "Start new project", "Button text is incorrect"
print("Button text is correct")

recent_paths_div = driver.find_element(By.CLASS_NAME, "recent-paths")
assert recent_paths_div is not None, "Recent paths div is missing"
print("Recent paths div is present")

assert logo_image.get_attribute("alt") == "JCCE Logo", "Logo alt text is incorrect"
print("Logo alt text is correct")

header_container = driver.find_element(By.CLASS_NAME, "header-container")
assert header_container.is_displayed(), "Header container is not visible"
print("Header container is visible")

left_container = driver.find_element(By.CLASS_NAME, "left-container")
right_container = driver.find_element(By.CLASS_NAME, "right-container")
assert left_container.is_displayed(), "Left container is not visible"
assert right_container.is_displayed(), "Right container is visible"
print("Left and right containers are visible")

assert "Open recent" in recent_title.text, "'Open recent' title text is incorrect"
print("'Open recent' title text is correct")

start_button.click()
assert "component-selection" in driver.current_url, "Redirection URL is incorrect"
print("Redirection URL is correct")

assert driver.title == "TCGM", "Page title is incorrect on component-selection page"
print("Page title is correct on component-selection page")

left_sidebar = driver.find_element(By.CLASS_NAME, "left-sidebar")
assert left_sidebar.is_displayed(), "Left sidebar is not visible"
print("Left sidebar is visible")

main_content = driver.find_element(By.ID, "main-content")
assert main_content.is_displayed(), "Main content is not visible"
print("Main content is visible")

right_sidebar = driver.find_element(By.CLASS_NAME, "right-sidebar")
assert right_sidebar.is_displayed(), "Right sidebar is not visible"
print("Right sidebar is visible")

footer = driver.find_element(By.CLASS_NAME, "footer")
assert footer.is_displayed(), "Footer is not visible"
print("Footer is visible")

images = driver.find_elements(By.TAG_NAME, "img")
for image in images:
    assert image.get_attribute("naturalWidth") != "0", f"Broken image found: {image.get_attribute('src')}"
print("No broken images found")

links = driver.find_elements(By.TAG_NAME, "a")
for link in links:
    href = link.get_attribute("href")
    if href:
        try:
            response = requests.head(href)
            assert response.status_code == 200, f"Broken link found: {href}"
        except requests.exceptions.RequestException as e:
            print(f"Error with link {href}: {e}")
print("All links are working correctly")

driver.quit()

cov.stop()
cov.save()

cov.report()

cov.html_report(directory="htmlcov")
print("Coverage report saved in 'htmlcov' directory.")
