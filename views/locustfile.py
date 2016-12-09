from locust import HttpLocust, TaskSet, task

class UserBehavior(TaskSet):
    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        # self.signup()

    @task(2)
    def signup(self):
        self.client.post("/users", {
            "fullName":"Testerito", 
            "email":"testerito@santaphone.org",
            "phone": "5556505813",
            "countryCode": "+1",
            "notification": 0,
            "timeZone": "America/Los_Angeles", 
            "time":"2016-12-09T10:43:00.000-08:00"
        });

    @task(1)
    def index(self):
        self.client.get("/")

class CallFlow(TaskSet):
    def on_start(self):


class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 5000
    max_wait = 9000


# app.get('/users/new', users.showCreate);
# app.post('/users', users.create);
# app.get('/users/:id/verify', users.showVerify);
# app.post('/users/:id/verify', users.verify);
# app.post('/users/:id/resend', users.resend);
# app.get('/users/:id', users.showUser);
# app.use('/ivr', ivr);
# app.use('/recordings', recordings);