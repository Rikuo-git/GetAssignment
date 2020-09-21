import time

import chromedriver_binary

from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


def log_in(driver, username, password):
    # timeoutの設定
    wait = WebDriverWait(driver, 10)

    # open page
    driver.get("https://www.edu.keio.jp")
    wait.until(EC.title_contains("keio.jp"))
    time.sleep(1)

    # login
    usr_name = driver.find_element_by_id("username")
    usr_name.send_keys(username)

    ps_word = driver.find_element_by_id("password")
    ps_word.send_keys(password)
    time.sleep(1)

    # submit
    login = driver.find_element_by_name("_eventId_proceed")
    login.click()
    wait.until(EC.title_contains("授業支援"))
    time.sleep(1)


def assignments(driver):
    tasks = list()
    for div in driver.find_elements_by_class_name("stdnews"):
        if div.find_element_by_tag_name("h4").text == "提出要レポート":
            for tr in div.find_elements_by_tag_name("tr"):
                divs = tr.find_elements_by_tag_name("div")
                if len(divs) > 1 and divs[1].text != "提出期限":
                    tasks.append((divs[0].text, divs[1].text))
    return tasks
def launch():
    # load driver
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # headlessモードを使用する
    options.add_argument("--disable-gpu")  # headlessモードで暫定的に必要なフラグ(そのうち不要になる)
    # すべての拡張機能を無効にする。ユーザースクリプトも無効にする
    options.add_argument("--disable-extensions")
    options.add_argument('--proxy-server="direct://"')  # Proxy経由ではなく直接接続する
    options.add_argument("--proxy-bypass-list=*")  # すべてのホスト名
    options.add_argument("--start-maximized")  # 起動時にウィンドウを最大化する
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(10)

    return driver

def main():
    driver = launch()
    # login
    username = "email@com"
    password = ""
    log_in(driver, username, password)
    # get assinment
    print(assignments(driver))

    driver.quit()


if __name__ == "__main__":
    main()
