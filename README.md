# PROJECT UNO

## Firebase setup

The app uses Firebase Authentication (email/password) and Cloud Firestore. Vite reads Firebase settings from `src/.env.local`; copy `src/.env.example` to that filename, then fill in the web-app configuration values from Firebase Console. Do not commit `.env.local` files. Restart the Vite server after changing environment values.

In Firebase Console:

1. Create or select the Firebase project and add a Web app.
2. Under **Authentication → Sign-in method**, enable **Email/Password**.
3. Under **Authentication → Settings → Authorized domains**, ensure the development and production hostnames are listed (localhost is normally present for development).
4. Create a **Cloud Firestore** database.
5. Publish the rules in [`firestore.rules`](firestore.rules). They limit every read and write below `users/{uid}` to the authenticated user whose UID matches that path.

The app stores course subjects in `users/{uid}/subjects`, calculated course grades in `users/{uid}/gradeRecords`, GPA snapshots in `users/{uid}/gpaHistory`, and view preferences/migration choice in `users/{uid}/settings`. All Firestore operations use the signed-in UID.

### Existing browser data

The previous app stored subjects in browser localStorage. After signing in, if that legacy data is found, the app offers **Import a copy** or **Keep account separate**. Nothing is uploaded unless import is selected, existing cloud documents are never overwritten by an import, and the old localStorage entry is not deleted. The choice is remembered separately for each account.

### Account isolation test

1. Create account A, add a course, enter marks, calculate its grade, and calculate a GPA if all seven courses are complete. Sign out and sign back in; confirm the data and history remain.
2. Create/sign in as account B without importing the legacy browser data. Confirm the course list starts empty and account A’s marks and history are absent.
3. Sign back in as account A and confirm its records are still present. Also confirm that attempting to read another UID’s path is denied by the published Firestore rules.

