FROM ruby:2.2.2
MAINTAINER Calin Seciu

# Error: "Liquid Exception: invalid byte sequence in US-ASCII in _layouts/redirect.html"
# https://stackoverflow.com/questions/36262382/jekyll-says-liquid-exception-invalid-byte-sequence-in-us-ascii-in-documentation/38316690
RUN apt-get update \
  && apt-get install -y locales \
  && rm -rf /var/lib/apt/lists/* \
  && echo "en_US UTF-8" > /etc/locale.gen \
  && locale-gen en_US.UTF-8

ENV LC_CTYPE="en_US.UTF-8" LANG="en_US.UTF-8" LANGUAGE="en_US:en" LC_ALL="en_US.UTF-8"

# Use libxml2, libxslt a packages from alpine for building nokogiri
RUN bundle config build.nokogiri --use-system-libraries

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY Gemfile* /usr/src/app/
RUN bundle install

VOLUME /usr/src/app

EXPOSE 4000

CMD ["bundle", "exec", "jekyll serve --host=0.0.0.0 --future --force_polling"]
