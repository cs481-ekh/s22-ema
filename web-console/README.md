# EMA - Web Deployment

EMA is an admin site that helps create projects, edit projects and delete projects that may or may not contain participants. It helps the admin to set notification (date/time) to be scheduled and executed in a timely manner which is sent to their android/IOS device.


<br />

> Features

- Create Project
- Edit Project
- Delete Project
- Update Participants (Add/Remove), survey links and descriptions
- Set notifications with date and time specified along with (Once, Daily and Weekly options)
- Dashboard Metrics (View participants in particular project, total participants, total projects and notifications details)
- Login
- Forget Password 
- Recover Account

<br />
> Note: Make sure your browser is uptodate
<br />


## ✨ Quick Start in `Docker`

> Get the code

```bash
$ git clone https://github.com/cs481-ekh/s22-ema.git
$ cd s22-ema
```
> Check out to remote webconsole branch 
```bash
$ cd webconsole
```


> Edit manage.py file and Transfer credentials 

- Uncomment line 33, 44, 48, 53, 57, 58 and 59 in manage.py
- Copy and paste the 2 files needed for credentials: 
- Ema-ramen-firebase-adminsdk-7lvc1-97d920871f.json
- google_email_creds.txt


> Start the app in Docker and create Django super user

```bash
$ docker-compose up --build 
```

> Inside another terminal (Create Django super user)
```bash
$ docker ps
```

> This will give the container id for wsgi. Note: Pick the container ID of  web-console_web_run 

```bash
$ docker exec -it [container_id] python manage.py createsuperuser
```
[Note: Enter the username, email, password (make sure it has atleast one uppercase, one lowercase and a number along with a special character) and remember to take a note on this)

<br />
Visit `http://0.0.0.0:8000/` in your browser [Link may also be displayed in the terminal]. The app should be up & running.
Enter the username and password that was entered above to be taken to Dashboard.
<br />

---
Built using: [Datta Able Django](https://appseed.us/admin-dashboards/django-datta-able) - Provided by **AppSeed [App Generator](https://appseed.us/app-generator)**.
<br />




