- gsutil ls -r gs://mooieman-us-regional-standard/** > manvrouw.csv


- gsutil -m acl ch -r -u firebase-adminsdk-byq6j@mooie-man.iam.gserviceaccount.com:O gs://mooie-man.appspot.com
- gsutil -m acl ch -r -u firebase-adminsdk-byq6j@mooie-man.iam.gserviceaccount.com:O gs://mooie-man-vcm
- Generate this file /home/username/.config/gcloud/application_default_credentials.json
> `gcloud auth application-default login`