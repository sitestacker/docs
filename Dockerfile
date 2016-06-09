FROM ruby:2
MAINTAINER Calin Seciu

# Use libxml2, libxslt a packages from alpine for building nokogiri
RUN bundle config build.nokogiri --use-system-libraries

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY Gemfile* /usr/src/app/
RUN bundle install

VOLUME /usr/src/app

EXPOSE 4000

CMD ["bundle", "exec", "jekyll serve --host=0.0.0.0 --future --force_polling"]
