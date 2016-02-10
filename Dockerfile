FROM ruby:2
MAINTAINER Calin Seciu <calin@wmtek.com>

# Use libxml2, libxslt a packages from alpine for building nokogiri
RUN bundle config build.nokogiri --use-system-libraries

# throw errors if Gemfile has been modified since Gemfile.lock
# RUN bundle config --global frozen 1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY Gemfile /usr/src/app/
RUN bundle install

VOLUME /usr/src/app

EXPOSE 4000

CMD bundle exec jekyll serve --host=0.0.0.0 --future --force_polling
