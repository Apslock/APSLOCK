import os
import sys
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ['https://www.googleapis.com/auth/calendar']

def main():
    print("Starting Google Auth Helper...", flush=True)
    credentials_path = 'google_credentials.json'
    if not os.path.exists(credentials_path):
        print(f"Error: {credentials_path} not found!", flush=True)
        sys.exit(1)

    flow = InstalledAppFlow.from_client_secrets_file(
        credentials_path, SCOPES
    )
    print("Starting local server on http://localhost:8085/...", flush=True)
    print("Please authorize the application in the browser window that opens.", flush=True)
    print("If the browser doesn't open automatically, use the link printed below.", flush=True)
    sys.stdout.flush()

    creds = flow.run_local_server(port=8085, open_browser=True)
    
    token_path = 'google_token.json'
    import pickle
    with open(token_path, 'wb') as token:
        pickle.dump(creds, token)
    print("Authorization successful! google_token.json has been created.", flush=True)

if __name__ == '__main__':
    main()
