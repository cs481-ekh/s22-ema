import smtplib
from email.message import EmailMessage

mailServer = 'smtp.gmail.com'
portNumber = 465  # port 465: used for sending out mail


def emailProcessor(adminAddress, adminPassword, userAddress, subject, content):
    smtp = smtplib.SMTP_SSL(mailServer, portNumber)

    try:
        login = smtp.login(adminAddress, adminPassword)
        message = messageBuilder(adminAddress, userAddress, subject, content)
        smtp.send_message(message)

    except:
        print('Failed to Authenticate')


def messageBuilder(senderAddress, recieverAddress, subject, content):
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = senderAddress
    msg['To'] = recieverAddress
    msg.set_content(content)
    return msg
