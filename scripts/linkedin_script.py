

# scripts/linkedin_script.py

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os

# LinkedIn credentials (should be secured in practice)
username = ""
password = ""

# Path to your ChromeDriver
chrome_driver_path = '/opt/homebrew/bin/chromedriver'
  # Ensure this path is correct

# Initialize WebDriver using Service
service = Service(chrome_driver_path)
driver = webdriver.Chrome(service=service)

try:
    # Open LinkedIn login page
    driver.get('https://www.linkedin.com/login')

    # Log in to LinkedIn
    email_element = driver.find_element(By.ID, 'username')
    email_element.send_keys(username)

    password_element = driver.find_element(By.ID, 'password')
    password_element.send_keys(password)
    password_element.send_keys(Keys.RETURN)

    time.sleep(5)  # Wait for the login to complete

    # Navigate to Data Export page
    driver.get('https://www.linkedin.com/settings/data-export-page')

    time.sleep(5)  # Wait for the page to load

    # Wait for 'Connections' checkbox to appear and select it
    connections_checkbox = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "input[name='connections']"))
    )
    connections_checkbox.click()

    request_button = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "button[data-tracking-control-name='export_archive_submit']"))
    )
    request_button.click()

    time.sleep(5)  # Wait for the request to be processed

    # Move the downloaded file to the 'downloads' directory
    download_dir = os.path.join(os.getcwd(), 'downloads')
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)
    
    # Assuming the download completes and the file is named 'linkedin_data.zip'
    downloaded_file = '/path/to/default/download/directory/linkedin_data.zip'
    if os.path.exists(downloaded_file):
        os.rename(downloaded_file, os.path.join(download_dir, 'linkedin_data.zip'))

finally:
    driver.quit()
