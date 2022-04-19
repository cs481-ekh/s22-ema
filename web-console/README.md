# EMA - Deployment

EMA is an admin site that helps create projects, edit projects and delete projects that may or may not contain participants. It helps the admin to set notification (date/time) to be scheduled and executed in timely manner which is sent to their andriod/IOS device.

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



> Edit Dockerfile and Transfer credentials 

- Uncomment line 17 and comment line 20 of the Docker File
- Copy and paste credentials (Firebase and gmail) inside webconsole folder

> Start the app in Docker and create Django super user

```bash
$ docker-compose up --build 
```

> Inside another terminal (Create Django super user)
```bash
$ docker ps
```

> This will give the container id for wsgi. Note: Don't pick the one that says nginx
```bash
$ docker exec -it [container_id] python manage.py createsuperuser
```
[Note: Enter the username, email, password (make sure it has atleast one uppercase, one lowercase and a number along with a special character) and remember to take a note on this)

<br />
Visit `http://localhost:85` in your browser. The app should be up & running.
Enter the username and password that was entered above to be taken to Dashboard.
<br />

---
Built using: [Datta Able Django](https://appseed.us/admin-dashboards/django-datta-able) - Provided by **AppSeed [App Generator](https://appseed.us/app-generator)**.
<br />




