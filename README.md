# CS50W Project 3 - Mail

This project is part of the Harvard University's CS50W course on Web Programming with Python and JavaScript. It's an implementation of a single-page-app email client that uses JavaScript, HTML, and CSS. It's worth noting that the backend was provided to me.

Video Demo: https://www.youtube.com/watch?v=1kLS2lAlxGw

## Description

This web application serves users to send, receive, and manage emails. The main features of the web application include:

- Sending emails
- Loading user-specific mailboxes (Inbox, Sent, Archive)
- Viewing individual email contents
- Marking emails as read
- Archiving and unarchiving emails
- Replying to emails

For detailed project requirements, refer to the project specifications on the CS50W course website [here](https://cs50.harvard.edu/web/2020/projects/3/mail/).

## Getting Started

To run this project locally, you need Python and pip installed on your system. If you don't have Python and pip installed, visit the [official Python website](https://www.python.org/downloads/) and follow the instructions there.

A database is included in the repository for immediate use. If you wish to start with a fresh database, remember to make migrations after deleting the existing one.

1. **Install the dependencies**

```
pip install -r requirements.txt
```

2. **Run the migrations (if you deleted the existing database)**

```
python manage.py makemigrations auctions
python manage.py migrate
```

3. **Run the application**

```
python manage.py runserver
```

Then, open your browser and visit `http://localhost:8000` to see the application in action.

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Please make sure to update tests as appropriate.
