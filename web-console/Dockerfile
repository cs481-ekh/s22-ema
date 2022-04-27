FROM python:3.8
ENV PYTHONUNBUFFERED 1
ENV TZ=America/Denver
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
RUN apt-get update && apt-get install -y tzdata
RUN echo "America/Denver" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata
COPY . /code/