from django.db import models

class header(models.Model):
    reported_by = models.CharField("Reported By", max_length=200)
    location = models.CharField("Location", max_length=200)
    date = models.DateTimeField("Date Recieved")
    senders_ip = models.CharField("Senders IP", max_length=200)
    link_ip = models.CharField("Link IP", max_length=200)
    email_message_id = models.CharField("Email Message ID", max_length=300)
    subject_line = models.CharField("Subject Line", max_length=300)
    attachment = models.CharField("Attachment", max_length=300)
    reason = models.CharField("Reason", max_length=400)
    notes = models.CharField("Notes", max_length=400)
    email_from = models.CharField("From", max_length=300)
    action_taken = models.CharField("Action Taken", max_length=400)