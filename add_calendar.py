from __future__ import print_function

import datetime as dt
import os.path
import pickle
import json

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from ko import assignments, launch, log_in,switchpage

# If modifying these scopes, delete the file token.pickle.
SCOPES = ["https://www.googleapis.com/auth/calendar"]


def main():
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open("token.pickle", "wb") as token:
            pickle.dump(creds, token)


    # get login info
    with open("./login.json") as f:
        info = json.loads(f.read())

    # get assignments by selenium
    driver = launch()
    username = info['login']['username']
    password = info['login']['password']
    log_in(driver, username, password)
    switchpage(driver,"BTN_HARU")
    kadai = assignments(driver)
    switchpage(driver,"BTN_AKI")
    kadai += assignments(driver)
    driver.quit()

    # Call the Calendar API
    service = build("calendar", "v3", credentials=creds)

    calendar_id = info['calendarId']

    now = dt.datetime.utcnow().isoformat() + "Z"  # 'Z' indicates UTC time

    results = (service.events().list(calendarId=calendar_id,
                                     timeMin=now,
                                     singleEvents=True).execute())
    lists = results.get("items", [])
    tasks = set()
    if lists:
        for event in lists:
            start = event["start"].get("dateTime", event["start"].get("date"))
            tasks.add((event["summary"], start))
    for title, due in kadai:
        start = (due - dt.timedelta(minutes=1)).isoformat()
        end = due.isoformat()
        if due > dt.datetime.now() and (title, start + "+09:00") not in tasks:
            task = {
                "summary": title,
                "description": "自動取得",
                "start": {
                    "dateTime": start,
                    "timeZone": "Japan"
                },
                "end": {
                    "dateTime": end,
                    "timeZone": "Japan"
                },
            }
            event = service.events().insert(calendarId=calendar_id,body=task).execute()
            print(event['summary'],event["id"])
    print("complete successfully:"+dt.datetime.now().isoformat())

if __name__ == "__main__":
    main()
