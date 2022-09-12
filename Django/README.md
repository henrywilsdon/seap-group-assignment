# Backend

## Django
[Django] (https://www.djangoproject.com/) framework used to create the backend.


## PostgreSQL
[PostgreSQL](https://www.postgresql.org/) was used to create the database for user information. The instructions on how to setup PostgreSQL can be found [here](https://www.postgresql.org/download/)

## Docker
[Docker] (https://docs.docker.com/) Docker compositions used to run services together

## Running Backend

There are two options for running docker

### Install

#### 1) Docker Desktop
https://docs.docker.com/get-docker/

#### 3) Visual Studio Code extensions

"Docker"
"Remote - Containers"

### Run

Run once: `docker-compose build`

Run to start backend: `docker-compose up -d`

### Shutdown

`docker-compose down`

### Make Migrations

`docker-compose run web python3 manage.py migrate`

`docker exec -it container_id python manage.py migrate`

### Enter container

`docker exec -t -i container_id bash`

### Running tests

`docker-compose run web python3 manage.py test`
