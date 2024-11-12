import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from dotenv import load_dotenv
import requests

load_dotenv()

def update_test(key, percentage):
    url = "http://localhost:8081/server-health"
    data = {key: f"{percentage}%"}

    requests.post(url, json=data)

tester_password = os.getenv("TESTER_PASSWORD")
bad_tester_password = os.getenv("BAD_TESTER_PASSWORD")

update_test("dashboard", 0)
update_test("community", 0)


driver = webdriver.Firefox()
driver.get("http://localhost:8080/website_requests")

help_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(@class, 'MuiMenuItem-root') and text()='Help']")))
help_button.click()
time.sleep(2)
about_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(@class, 'MuiMenuItem-root') and text()='About']")))
about_button.click()
time.sleep(2)
mobile_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(@class, 'MuiMenuItem-root') and text()='Mobile']")))
mobile_button.click()
time.sleep(2)
home_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(@class, 'MuiMenuItem-root') and text()='Get Started']")))
home_button.click()
time.sleep(2)

driver.get("http://localhost:8080/website_requests/#/bot_entrance")
token_field = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//input[@id='bot-token-input']")))
token_field.send_keys(bad_tester_password)
token_field.send_keys(Keys.SPACE)
time.sleep(2)

driver.get("http://localhost:8080/website_requests/#/bot_entrance")
token_field = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//input[@id='bot-token-input']")))
token_field.send_keys(tester_password)
token_field.send_keys(Keys.SPACE)

time.sleep(2)
dashboard_li = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(., 'Dashboard')]")))
dashboard_li.click()
time.sleep(2)
community_li = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(., 'Community')]")))
community_li.click()
time.sleep(2)
newProject_li = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(., 'New Project')]")))
newProject_li.click()
time.sleep(2)
new_request_li = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(., 'New Request')]")))
new_request_li.click()
time.sleep(2)
followup_li = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(., 'Follow Up')]")))
followup_li.click()
time.sleep(2)
packages_li = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(., 'Packages')]")))
packages_li.click()
time.sleep(2)
alerts_li = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(., 'Alerts')]")))
alerts_li.click()
time.sleep(2)
maintenance_li = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(., 'Maintenance')]")))
maintenance_li.click()
time.sleep(2)
settings_li = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(., 'Settings')]")))
settings_li.click()
time.sleep(2)
community_li = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//li[contains(., 'Community')]")))
community_li.click()
add_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@aria-label, 'add')]")))

add_button.click()
time.sleep(2)
image_input = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//label[text()='Image Link']/following-sibling::div//input")))
image_input.send_keys("https://cdn-icons-png.flaticon.com/512/4712/4712010.png")
update_test("community", 10)
time.sleep(2)
description_input = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//label[text()='Post Description']/following-sibling::div//input")))
description_input.send_keys("Don't mind me, I'm just a tester")
time.sleep(2)
update_test("community", 20)
cancel_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Cancel']")))
cancel_button.click()
time.sleep(2)
update_test("community", 30)
add_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@aria-label, 'add')]")))

add_button.click()
time.sleep(2)
update_test("community", 40)
description_input = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//label[text()='Post Description']/following-sibling::div//input")))
description_input.send_keys("Don't mind me, I'm just a tester")
time.sleep(2)
update_test("community", 50)
submit_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'MuiButton-root') and contains(@class, 'MuiButton-text') and contains(@class, 'MuiButton-colorPrimary') and text()='Submit']")))
submit_button.click()
time.sleep(2)
update_test("community", 60)
add_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@aria-label, 'add')]")))

add_button.click()
time.sleep(2)
update_test("community", 70)
image_input = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//label[text()='Image Link']/following-sibling::div//input")))
image_input.send_keys("https://cdn-icons-png.flaticon.com/512/4712/4712010.png")
time.sleep(2)
update_test("community", 80)
description_input = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//label[text()='Post Description']/following-sibling::div//input")))
description_input.send_keys("Don't mind me, I'm just a tester")
time.sleep(2)
update_test("community", 90)
submit_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'MuiButton-root') and contains(@class, 'MuiButton-text') and contains(@class, 'MuiButton-colorPrimary') and text()='Submit']")))
submit_button.click()
time.sleep(10)
update_test("community", 100)

driver.close()