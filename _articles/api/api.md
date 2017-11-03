---
title: API
category: API
date: 2017-08-21 00:00:00
---

## Overview

The API empowers developers to automate, extend and combine Site Stacker with other services.

### Authentication

See the [API Authentication](api-authentication) guide.

### Caching

TODO

### Clients

Clients must address requests to `<sitestacker-domain>/api/*` using HTTPS. Clients should specify the `Accept` header `Accept: application/json; version=1` and a `User-Agent` header to facilitate tracking and debugging.

### Current Version

By default, all requests receive the latest version of the API (at the time of this writing `version 1`). We encourage you to explicitly request the version via the `Accept` header.

### Errors

Failing responses will have an appropriate [status](#statuses) and a JSON body containing more details about a particular error. See [error responses](#error-responses) for more examples.

#### Error Attributes

Name | Type | Description | Example
--- | --- | --- | ---
`message` | string | end user message of error raised | "Your account reached the API limit. Please wait a few minutes before making new requests"
`url` | string | reference url with more information about the error | http://docs.sitestacker.com/articles/api#rate-limits
`errors` | array | validation errors | per field, e.g. `array('field' => array('error 1', 'error 2'), ...)`

Note that the `url` and `errors` are included only when relevant and may not be present in the response.

#### Error Response

```
HTTP/1.1 429 Too Many Requests
```

```json
{
  "message":  "Your account reached the API rate limit. Please wait a few minutes before making new requests",
  "url":      "http://docs.sitestacker.com/articles/api#rate-limits"
}
```

### HTTP Methods

Where possible, the API strives to use appropriate HTTP verbs for each action.

Verb | Description
--- | ---
`GET` | Used for retrieving lists or individual resources.
`POST` | Used for creating new resources.
`PATCH` | Used for updating existing resources with partial data.
`DELETE` | Used for deleting existing resources.

### Ranges

TODO

### Rate Limits

The API limits the number of requests each user can make per hour to protect against abuse and buggy code. You can make up to 5,000 authenticated requests per hour.

You can check the returned HTTP headers of any API request to see your current rate limit status:

```bash
$ curl -i https://<domain>/api/whatever
HTTP/1.1 200 OK
Date: Mon, 01 Jul 2013 17:27:06 GMT
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

The headers tell you everything you need to know about your current rate limit status:

Header Name | Description
--- | ---
`RateLimit-Limit` | The maximum number of requests that the consumer is permitted to make per hour.
`RateLimit-Remaining` | The number of requests remaining in the current rate limit window.
`RateLimit-Reset` | The time at which the current rate limit window resets in [UTC epoch seconds](http://en.wikipedia.org/wiki/Unix_time).

Once you go over the rate limit you will receive a `429 Too Many Requests` error.

### Schema

Currently all data is sent and received as JSON (as specified in the `Accept` header).

```
TODO
```

All timestamps are returned in ISO 8601 format: (TODO)

```
2004-02-12T15:19:21+00:00
```

### Search / Filtering

All API endpoints that return a list of records take an optional `search` query parameter to allow filtering the results.

The `search` parameter is a **url encoded json object** with conditions, similarly to the [CakePHP documentation](https://book.cakephp.org/2.0/en/models/retrieving-your-data.html#complex-find-conditions). Some important considerations:

- Fields should be specified as they appear in the result data (e.g. `name`, `campaign.goal_amount`).
- If not specified otherwise, only fields on the record root level and one level deep are acceptable (e.g. `item.name` is good but not `item.folder.name`).
- One level deep fields are specified by concatenating the path of the field with `.` (e.g. `campaign.goal_amount`).

#### Search Examples

Retrieve records with `fullname` equal to "John Doe":

```json
{
    "fullname": "John Doe"
}
```

Retrieve records with `gender` equal to any value in the given array:

```json
{
    "gender": ["m", "f"]
}
```

Retrieve records that were modified after 2007-11-12:

```json
{
    "address.modified >=": "2007-11-12"
}
```

Retrieve records with email ending in @gmail.com:

```json
{
    "email.email LIKE": "%@gmail.com"
}
```

Retrieve records that succeeded and the donor is Chris:

```json
{
    "success": true,
    "donor.firstname": "Chris"
}
```

#### Search Curl Example

Retrieve records with `external_id` equal to "R2D2" (un-encoded: `?search={"external_id":"R2D2"}`):

```bash
$ curl -n https://<domain>/api/people?search=%7B%22external_id%22%3A%20%22R2D2%22%7D \
    -H "Authorization: HMAC <id>:<signature>"
```

### Statuses

The result of responses can be determined by returned HTTP status.

#### Successful Responses

Status | Description
--- | ---
200 OK | Request succeeded
201 Created	| Resource created, for example as a result of a POST request
202 Accepted | Request accepted, but the processing has not been completed
206 Partial Content	| Request succeeded, but this is only a partial response, see [ranges](#ranges)

#### Error Responses

Error responses can be divided into two classes. Client errors result from malformed requests and should be addressed by the client. Site Stacker errors result from problems on the server side and must be addressed internally.

##### Client Error Responses

Status | Description
--- | ---
400 Bad Request |	Request invalid, validate usage and try again
401 Unauthorized | Request not authenticated, API token is missing, invalid or expired
403 Forbidden	| Request not authorized, provided credentials do not provide access to specified resource
403 Forbidden	| Request not authorized, account was suspended
404 Not Found	| Request failed, the specified resource does not exist
406 Not Acceptable | Request failed, set `Accept: application/vnd.sitestacker+json; version=1` header and try again
409 Conflict | Request failed, see response body for suggested resolution
410 Gone | Requested resource can no longer be found at this location
416 Requested Range Not Satisfiable | Request failed, validate `Content-Range` header and try again
422 Unprocessable Entity | Request failed, validate parameters try again
429 Too Many Requests | Request failed, wait for rate limits to reset and try again, see [rate limits](#rate-limits)

##### Site Stacker Error Responses

Status | Description
500 Internal Server Error	| Error occurred, we are notified, but contact support if the issue persists
503 Service Unavailable	| API is unavailable, check response body or contact support

## Campaigns

A campaign represents a contribution designation. It's a content item and can be tied to a certain person record.

### List campaigns

```
GET /campaigns
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/campaigns \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
Accept-Ranges: id
Content-Range: id 0..; max=100, total=11, order=asc
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

The data returned is similar to the [get a single campaign](#get-a-single-campaign) endpoint, but contains an array of records instead of a single record.

### Get a single campaign

```
GET /campaigns/:id
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/campaigns/1 \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

```json
{
    "id": "3",
    "goal_amount": "5000.00",
    "min_amount": "5.00",
    "max_amount": "1000.00",
    "start": null,
    "end": null,
    "item": {
        "id": "3",
        "alias": "project-with-min-max-amounts",
        "name": "Project With Min Max Amounts",
        "publish_datetime": "2015-05-05 05:05:05",
        "unpublish_datetime": null,
        "external_id": "P3",
        "created": "2015-05-05 05:05:05",
        "modified": "2015-05-05 05:05:05",
        "owner": null
    },
    "category": {
        "id": "1",
        "name": "Project",
        "campaign_label": null
    },
    "site": {
        "id": "1",
        "name": "Site 1",
        "require_authentication": false
    },
    "goals": [
        {
            "id": "2",
            "goal_amount": "50000.00",
            "interval": "1",
            "period": "month"
        },
        {
            "id": "1",
            "goal_amount": "7500.00",
            "interval": "3",
            "period": "week"
        }
    ],
    "fixed_amounts": [
        {
            "id": "1",
            "label": "$5.00",
            "amount": "5.00",
            "is_default": false
        },
        {
            "id": "2",
            "label": "$10.00",
            "amount": "10.00",
            "is_default": true
        },
        {
            "id": "3",
            "label": "$20.00",
            "amount": "20.00",
            "is_default": false
        }
    ]
}
```

## Contribution Batches

A contribution batch represents a payment action containing a donor, a payment method, at least one contribution and the payment processor transactions (e.g. authorize, capture).

### List contribution batches

```
GET /contribution-batches
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/contribution-batches \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
Accept-Ranges: id
Content-Range: id 0..; max=100, total=1, order=asc
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

The data returned is similar to the [get a single contribution batch](#get-a-single-contribution-batch) endpoint, but contains an array of records instead of a single record.

### Get a single contribution batch

```
GET /contribution-batches/:id
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/contribution-batches/1 \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

```json
{
    "id": "1",
    "amount": "5.00",
    "is_recurring": false,
    "is_online": true,
    "external_id": null,
    "success": "1",
    "transaction_code": "dummy",
    "is_testing": false,
    "offline_type": null,
    "offline_check_number": null,
    "received": "2015-01-01 00:00:00",
    "processed": null,
    "created": "2015-01-01 00:00:00",
    "modified": "2015-01-01 00:00:00",
    "site": {
        "id": "1",
        "name": "Site 1",
        "require_authentication": false
    },
    "site_channel": {
        "id": "1",
        "name": "Site Channel 1",
        "title": "Site Channel 1",
        "status": "0",
        "date_format": "m\/d\/Y",
        "time_format": "g:i A",
        "timezone": "",
        "force_primary_domain": false,
        "is_mobile": false,
        "session_timeout": "100",
        "session_timeout_browser_close": false,
        "captcha_after_logins": null,
        "permission_access": false,
        "robots": "",
        "is_offline": false,
        "offline_message": null,
        "force_https": false,
        "template_theme": "sitestacker"
    },
    "donor": {
        "id": "1",
        "title": "Mr.",
        "firstname": "John",
        "middlename": "S",
        "lastname": "Doe",
        "fullname": "John Doe",
        "suffix": "Jr.",
        "gender": "m",
        "birthday": "1987-05-05",
        "email": {
            "id": "1",
            "email": "john@test.com",
            "created": "2015-05-05 05:05:05",
            "modified": "2015-05-05 05:05:05"
        },
        "description": "Description",
        "is_group": false,
        "external_id": "P1",
        "created": "2015-04-04 12:12:12",
        "modified": "2015-04-05 13:13:13",
        "household": {
            "id": "1",
            "name": "John Doe's Family",
            "external_id": "H1",
            "head_person_id": "1"
        },
        "address": {
            "id": "1",
            "address1": "2429A Broadway",
            "address2": "",
            "city": "New York",
            "zip": "10024",
            "latitude": "40.790526",
            "longitude": "-73.974953",
            "external_id": "A1",
            "default": true,
            "created": "2015-05-05 05:05:05",
            "modified": "2015-05-05 05:05:05",
            "state": {
                "id": "1",
                "name": "New York",
                "code": "NY"
            },
            "country": {
                "id": "1",
                "name": "United States",
                "title": "The United States",
                "code": "US",
                "iso3": "USA",
                "iso_number": "840",
                "internet": "US",
                "nationality": "American",
                "currency": "US Dollar",
                "currency_code": "USD",
                "population": "278058881"
            }
        },
        "phone": {
            "id": "1",
            "number": "(123) 456-7890",
            "is_outside_us": false,
            "created": "2016-04-14 20:00:00",
            "modified": "2016-04-14 20:00:00"
        }
    },
    "affiliated_donor": null,
    "payment_method": {
        "id": "1",
        "archived": false,
        "deleted": null,
        "test_mode": false,
        "last_four": "1111",
        "expiration_date": "2020-01-31",
        "gateway": "Dummy",
        "currency": "USD",
        "external_id": "M1",
        "person_profile_code_override": null,
        "created": "2015-05-05 05:05:05",
        "modified": "2015-05-05 05:05:05",
        "card": {
            "id": "1",
            "gateway": "Dummy",
            "test_mode": false,
            "name_on_card": "John Doe",
            "card_type": "Visa",
            "card_number_last_four": "1111",
            "expiration_month": "1",
            "expiration_year": "2020",
            "profile_code": "dummy",
            "created": "2015-05-05 05:05:05",
            "modified": "2015-05-05 05:05:05"
        },
        "check": null,
        "paypal": null
    },
    "recurring": {
        "id": "3",
        "active": "1",
        "archived": null,
        "recurring_start_date": "2015-05-12",
        "recurring_end_date": null,
        "recurring_period": "month",
        "recurring_interval": "1",
        "recurring_day_of_month": "12",
        "prev_run_date": "2015-05-12",
        "next_run_date": "2015-06-12",
        "external_id": null,
        "currency": "USD",
        "source_codes": null,
        "processed_counter": "1",
        "created": "2015-05-12 10:42:00",
        "modified": "2015-06-12 23:58:00"
    },
    "contributions": [
        {
            "id": "1",
            "amount": "5.00",
            "is_recurring": false,
            "is_online": true,
            "is_anonymous": false,
            "paid_transaction_fee": false,
            "error": null,
            "notes": "First test contribution",
            "success": "1",
            "external_id": null,
            "extra_data": null,
            "source_codes": null,
            "pending": false,
            "created": "2015-01-01 00:00:00",
            "modified": "2015-01-01 00:00:00",
            "campaign": {
                "id": "1",
                "goal_amount": null,
                "min_amount": null,
                "max_amount": null,
                "start": null,
                "end": null,
                "item": {
                    "id": "1",
                    "alias": "default-project",
                    "name": "Default Project",
                    "publish_datetime": "2015-05-05 05:05:05",
                    "unpublish_datetime": null,
                    "external_id": "P1",
                    "created": "2015-05-05 05:05:05",
                    "modified": "2015-05-05 05:05:05",
                    "owner": {
                        "id": "1",
                        "title": "Mr.",
                        "firstname": "John",
                        "middlename": "S",
                        "lastname": "Doe",
                        "fullname": "John Doe",
                        "suffix": "Jr.",
                        "gender": "m",
                        "birthday": "1987-05-05",
                        "email": "john@test.com",
                        "description": "Description",
                        "is_group": false,
                        "external_id": "P1",
                        "created": "2015-04-04 12:12:12",
                        "modified": "2015-04-05 13:13:13"
                    }
                }
            }
        },
        {
            "id": "3",
            "amount": "3.00",
            "is_recurring": false,
            "is_online": true,
            "is_anonymous": false,
            "paid_transaction_fee": false,
            "error": null,
            "notes": "Second contribution in the batch",
            "success": "1",
            "external_id": null,
            "extra_data": null,
            "source_codes": null,
            "pending": false,
            "created": "2015-01-01 01:00:00",
            "modified": "2015-01-01 01:00:00",
            "campaign": {
                "id": "1",
                "goal_amount": null,
                "min_amount": null,
                "max_amount": null,
                "start": null,
                "end": null,
                "item": {
                    "id": "1",
                    "alias": "default-project",
                    "name": "Default Project",
                    "publish_datetime": "2015-05-05 05:05:05",
                    "unpublish_datetime": null,
                    "external_id": "P1",
                    "created": "2015-05-05 05:05:05",
                    "modified": "2015-05-05 05:05:05",
                    "owner": {
                        "id": "1",
                        "title": "Mr.",
                        "firstname": "John",
                        "middlename": "S",
                        "lastname": "Doe",
                        "fullname": "John Doe",
                        "suffix": "Jr.",
                        "gender": "m",
                        "birthday": "1987-05-05",
                        "email": "john@test.com",
                        "description": "Description",
                        "is_group": false,
                        "external_id": "P1",
                        "created": "2015-04-04 12:12:12",
                        "modified": "2015-04-05 13:13:13"
                    }
                }
            }
        }
    ],
    "transactions": [
        {
            "id": "1",
            "gateway": "Dummy",
            "transaction_code": "1234",
            "auth_code": "XXXX",
            "error_code": null,
            "error_message": null,
            "amount": "5.00",
            "success": true,
            "type": "authorizeAndCapture",
            "settled": "2015-05-05 05:05:05",
            "test_mode": false,
            "external_id": "",
            "currency": "USD",
            "pending": false,
            "created": "2015-05-05 05:05:05",
            "modified": "2015-05-05 05:05:05"
        }
    ]
}
```

## Contributions

A contribution represents a single transaction inside a contribution batch.

### List contributions

```
GET /contributions
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/contributions \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
Accept-Ranges: id
Content-Range: id 0..; max=100, total=1, order=asc
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

The data returned is similar to the [get a single contribution](#get-a-single-contribution) endpoint, but contains an array of records instead of a single record.

### Get a single contribution

```
GET /contributions/:id
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/contributions/1 \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

```json
{
    "id": "1",
    "amount": "5.00",
    "is_recurring": false,
    "is_online": true,
    "is_anonymous": false,
    "paid_transaction_fee": false,
    "error": null,
    "notes": "First test contribution",
    "success": "1",
    "external_id": null,
    "extra_data": null,
    "source_codes": null,
    "pending": false,
    "created": "2015-01-01 00:00:00",
    "modified": "2015-01-01 00:00:00",
    "batch": {
        "id": "1",
        "amount": "5.00",
        "is_recurring": false,
        "is_online": true,
        "external_id": null,
        "success": "1",
        "transaction_code": "dummy",
        "is_testing": false,
        "offline_type": null,
        "offline_check_number": null,
        "received": "2015-01-01 00:00:00",
        "processed": null,
        "created": "2015-01-01 00:00:00",
        "modified": "2015-01-01 00:00:00",
        "site": {
            "id": "1",
            "name": "Site 1",
            "require_authentication": false
        },
        "site_channel": {
            "id": "1",
            "name": "Site Channel 1",
            "title": "Site Channel 1",
            "status": "0",
            "date_format": "m\/d\/Y",
            "time_format": "g:i A",
            "timezone": "",
            "force_primary_domain": false,
            "is_mobile": false,
            "session_timeout": "100",
            "session_timeout_browser_close": false,
            "captcha_after_logins": null,
            "permission_access": false,
            "robots": "",
            "is_offline": false,
            "offline_message": null,
            "force_https": false,
            "template_theme": "sitestacker"
        },
        "payment_method": {
            "id": "1",
            "archived": false,
            "deleted": null,
            "test_mode": false,
            "last_four": "1111",
            "expiration_date": "2020-01-31",
            "gateway": "Dummy",
            "currency": "USD",
            "external_id": "M1",
            "person_profile_code_override": null,
            "created": "2015-05-05 05:05:05",
            "modified": "2015-05-05 05:05:05",
            "card": {
                "id": "1",
                "gateway": "Dummy",
                "test_mode": false,
                "name_on_card": "John Doe",
                "card_type": "Visa",
                "card_number_last_four": "1111",
                "expiration_month": "1",
                "expiration_year": "2020",
                "profile_code": "dummy",
                "created": "2015-05-05 05:05:05",
                "modified": "2015-05-05 05:05:05"
            },
            "check": null,
            "paypal": null
        },
        "recurring": null,
        "transactions": [
            {
                "id": "1",
                "gateway": "Dummy",
                "transaction_code": "1234",
                "auth_code": "XXXX",
                "error_code": null,
                "error_message": null,
                "amount": "5.00",
                "success": true,
                "type": "authorizeAndCapture",
                "settled": "2015-05-05 05:05:05",
                "test_mode": false,
                "external_id": "",
                "currency": "USD",
                "pending": false,
                "created": "2015-05-05 05:05:05",
                "modified": "2015-05-05 05:05:05"
            }
        ]
    },
    "campaign": {
        "id": "1",
        "goal_amount": null,
        "min_amount": null,
        "max_amount": null,
        "start": null,
        "end": null,
        "item": {
            "id": "1",
            "alias": "default-project",
            "name": "Default Project",
            "publish_datetime": "2015-05-05 05:05:05",
            "unpublish_datetime": null,
            "external_id": "P1",
            "created": "2015-05-05 05:05:05",
            "modified": "2015-05-05 05:05:05",
            "owner": {
                "id": "1",
                "title": "Mr.",
                "firstname": "John",
                "middlename": "S",
                "lastname": "Doe",
                "fullname": "John Doe",
                "suffix": "Jr.",
                "gender": "m",
                "birthday": "1987-05-05",
                "email": "john@test.com",
                "description": "Description",
                "is_group": false,
                "external_id": "P1",
                "created": "2015-04-04 12:12:12",
                "modified": "2015-04-05 13:13:13"
            }
        }
    },
    "recurring": null,
    "donor": {
        "id": "1",
        "title": "Mr.",
        "firstname": "John",
        "middlename": "S",
        "lastname": "Doe",
        "fullname": "John Doe",
        "suffix": "Jr.",
        "gender": "m",
        "birthday": "1987-05-05",
        "email": {
            "id": "1",
            "email": "john@test.com",
            "created": "2015-05-05 05:05:05",
            "modified": "2015-05-05 05:05:05"
        },
        "description": "Description",
        "is_group": false,
        "external_id": "P1",
        "created": "2015-04-04 12:12:12",
        "modified": "2015-04-05 13:13:13",
        "household": {
            "id": "1",
            "name": "John Doe's Family",
            "external_id": "H1",
            "head_person_id": "1"
        },
        "address": {
            "id": "1",
            "address1": "2429A Broadway",
            "address2": "",
            "city": "New York",
            "zip": "10024",
            "latitude": "40.790526",
            "longitude": "-73.974953",
            "external_id": "A1",
            "default": true,
            "created": "2015-05-05 05:05:05",
            "modified": "2015-05-05 05:05:05",
            "state": {
                "id": "1",
                "name": "New York",
                "code": "NY"
            },
            "country": {
                "id": "1",
                "name": "United States",
                "title": "The United States",
                "code": "US",
                "iso3": "USA",
                "iso_number": "840",
                "internet": "US",
                "nationality": "American",
                "currency": "US Dollar",
                "currency_code": "USD",
                "population": "278058881"
            }
        },
        "phone": {
            "id": "1",
            "number": "(123) 456-7890",
            "is_outside_us": false,
            "created": "2016-04-14 20:00:00",
            "modified": "2016-04-14 20:00:00"
        }
    },
    "affiliated_donor": null
}
```

## Historic Gifts

A historic gift represents an online or offline gift and acts as a static store for gifts.

### List historic gifts

```
GET /historic-gifts
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/historic-gifts \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
Accept-Ranges: id
Content-Range: id 0..; max=100, total=1, order=asc
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

The data returned is similar to the [get a single historic gift](#get-a-single-historic-gift) endpoint, but contains an array of records instead of a single record.

### Get a single historic gift

```
GET /historic-gifts/:id
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/historic-gifts/1 \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

```json
{
    "id": "1",
    "is_anonymous": false,
    "is_native": false,
    "is_imported": false,
    "donor_person_external_id": "1",
    "affiliated_person_external_id": null,
    "amount": "13.00",
    "currency": "usd",
    "received": "2015-01-01 00:00:00",
    "contribution_type": "One-Time",
    "fund_id": "",
    "fund_name": "",
    "firstname": "John",
    "affiliated_person_firstname": "",
    "lastname": "Doe",
    "affiliated_person_lastname": "",
    "fullname": "John Doe",
    "affiliated_person_fullname": "",
    "email": "john@test.com",
    "affiliated_person_email": "",
    "phone": "1-848-1234567",
    "latitude": null,
    "longitude": null,
    "address1": "2429A Broadway",
    "address2": "",
    "city": "New York",
    "zip": "10024",
    "state": "NY",
    "country": "United States",
    "created": "2014-12-01 00:00:00",
    "modified": "2015-02-03 00:00:00",
    "usd_amount": "13.00",
    "receiver": {
        "id": "1",
        "title": "Mr.",
        "firstname": "John",
        "middlename": "S",
        "lastname": "Doe",
        "fullname": "John Doe",
        "suffix": "Jr.",
        "gender": "m",
        "birthday": "1987-05-05",
        "email": "john@test.com",
        "description": "Description",
        "is_group": false,
        "external_id": "P1",
        "created": "2015-04-04 12:12:12",
        "modified": "2015-04-05 13:13:13"
    },
    "donor": {
        "id": "2",
        "title": null,
        "firstname": "",
        "middlename": "",
        "lastname": "",
        "fullname": "Company",
        "suffix": null,
        "gender": null,
        "birthday": null,
        "email": "company@test.com",
        "description": "Description",
        "is_group": true,
        "external_id": "G1",
        "created": "2015-04-04 12:12:12",
        "modified": "2015-04-05 13:13:13"
    },
    "affiliated_donor": null,
    "data": null,
    "contribution": null,
    "campaign": null,
    "site": null,
    "site_channel": null
}
```

### Create a historic gift

```
POST /historic-gifts
```

**Input data**

Name | Type | Description
--- | --- | ---
`receiver.id` | *int* | **Required** if `fund_id` is not set and you want the gift to be associated with a person. The receiving person id (Site Stacker id).
`fund_id` | *int* | **Required** if `receiver.id` is not set and you want the gift to be associated with a person. The fund id (or campaign external id). This field is mapped according to the Historic Giving component settings, set in admin.
`fund_name` | *string* | The fund name (or campaign name).
`donor.id` | *int* | **Required** if `donor.external_id` is not set. The donor person id (Site Stacker id).
`donor_person_external_id` | *int* | **Required** if `donor.id` is not set. The donor external id.
`amount` | *decimal* | **Required**. Two decimal number without currency sign.
`currency` | *string* | **Required**. The currency type. Supported values: `USD` or `CAD`.
`received` | *date* | **Required**. The gift received date (ISO 8601).
`notes` | *string* | Gift notes.
`contribution_type` | *string* | The donation type (e.g. "Recurring").
`firstname` | *string* | Donor first name. This will be populated if not set from `donor.id`.
`lastname` | *string* | Donor last name. This will be populated if not set from `donor.id`.
`fullname` | *string* | Donor or organization full name. This will be populated if not set from `donor.id`.
`email` | *string* | Donor email. This will be populated if not set from `donor.id`.
`phone` | *string* | Donor phone number (e.g. "(123) 123-1311").
`address1` | *string* | Donor address line 1.
`address2` | *string* | Donor address line 2.
`city` | *string* | Donor city name.
`zip` | *string* | Donor zip/postal code.
`state` | *string* | Donor state code (preferred 2 letter code, e.g. "FL").
`country` | *string* | Donor country code (preferred 2 letter code, e.g. "US").
`is_native` | *bool* | True if the gift originated on Site Stacker.
`is_imported` | *bool* | True if the gift was imported. Usually for internal purposes.
`is_anonymous` | *bool* | True if the gift is anonymous.
`contribution.id` | *int* | The Site Stacker contribution id. If the gift originated on Site Stacker.
`campaign.id` | *int* | The Site Stacker campaign id. If the gift originated on Site Stacker.
`affiliated_donor.id` | *int* | The affiliated donor id (Site Stacker id), if the donor is an organization. Set either this or `affiliated_person_external_id`.
`affiliated_person_external_id` | *int* | The affiliated donor external id, if the donor is an organization. Set either this or `affiliated_donor.id`.
`affiliated_person_firstname` | *int* | The affiliated donor first name, if the donor is an organization. This will be populated if not set from `affiliated_donor.id`.
`affiliated_person_lastname` | *int* | The affiliated donor last name, if the donor is an organization. This will be populated if not set from `affiliated_donor.id`.
`affiliated_person_fullname` | *int* | The affiliated donor full name, if the donor is an organization. This will be populated if not set from `affiliated_donor.id`.
`affiliated_person_email` | *int* | The affiliated donor email, if the donor is an organization. This will be populated if not set from `affiliated_donor.id`.
`site.id` | *int* | The Site Stacker site id. If the contribution was made on a Site Stacker site.
`site_channel.id` | *int* | The Site Stacker site channel id. If the contribution was made on a Site Stacker site channel.

**Curl Example**

```bash
$ curl -n -XPOST https://<domain>/api/historic-gifts \
  -d '{
  "donor": {"id": 1},
  "receiver": {"id": 2},
  "received": "2004-02-12T15:19:21+00:00",
  "amount": 11.00,
  "currency": "USD"
  }' \
  -H "Content-Type: application/json" \
  -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

On successful create, this endpoint will return the full item data, as in [get a single historic gift](#get-a-single-historic-gift), but the HTTP status code is `201`.

## Items

An item represents a content item of a certain [type](#types), with custom data, translations and versions.

### List Items

```
GET /types/:type_id_or_alias/items
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/types/Project/items \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
Accept-Ranges: id
Content-Range: id 0..; max=100, total=1, order=asc
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

The data returned is similar to the [get a single item](#get-a-single-item) endpoint, but contains an array of records instead of a single record.

### Get a single item

```
GET /types/:type_id_or_alias/items/:id
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/types/Project/items/1 \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

```json
{
    "id": "1",
    "alias": "default-project",
    "name": "Default Project",
    "publish_datetime": "2015-05-05 05:05:05",
    "unpublish_datetime": null,
    "external_id": "P1",
    "created": "2015-05-05 05:05:05",
    "modified": "2015-05-05 05:05:05",
    "campaign": {
        "id": "3",
        "goal_amount": null,
        "min_amount": "5.00",
        "max_amount": "1000.00",
        "start": null,
        "end": null
    },
    "folder": {
        "id": "1",
        "name": "Projects",
        "external_id": null
    },
    "languages": [
        "en"
    ],
    "type": {
        "id": "1",
        "alias": "Project",
        "name": "Project"
    },
    "owner": {
        "id": "1",
        "title": "Mr.",
        "firstname": "John",
        "middlename": "S",
        "lastname": "Doe",
        "fullname": "John Doe",
        "suffix": "Jr.",
        "gender": "m",
        "birthday": "1987-05-05",
        "email": "john@test.com",
        "description": "Description",
        "is_group": false,
        "external_id": "P1",
        "created": "2015-04-04 12:12:12",
        "modified": "2015-04-05 13:13:13"
    }
}
```

### Update item

```
PATCH /types/:type_id_or_alias/items/:id
```

**Input data**

Name | Type | Description
--- | --- | ---
`external_id` | *string* | The id of the integrated external service resource. This associates the item and the campaign with an external resource

**Curl Example**

```bash
$ curl -n -XPATCH https://<domain>/api/types/Project/items/1 \
  -d '{
  "external_id": "R2D2"
  }' \
  -H "Content-Type: application/json" \
  -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

On successful update, this endpoint will return the full item data, as in [get a single item](#get-a-single-item).

## Item Versions

An item version represents an item's custom data, associated to a language and version.

### List item versions

```
GET /types/:type_id_or_alias/items/:id/languages/:language/versions
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/types/Project/items/1/languages/en/versions \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
Accept-Ranges: id
Content-Range: id 0..; max=100, total=1, order=asc
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

The data returned is similar to the [get a single item version](#get-a-single-item-version) endpoint, but contains an array of records instead of a single record.

### Get a single item version

```
GET /types/:type_id_or_alias/items/:id/languages/:language/versions/live
GET /types/:type_id_or_alias/items/:id/languages/:language/versions/last
GET /types/:type_id_or_alias/items/:id/languages/:language/versions/:version
```

Note that the `:version` parameter is the version number, not the id.

> Important: It's recommended to use only `live` and `last`, since the version_number is only for advanced usages.

**Curl Example**

```bash
$ curl -n https://<domain>/api/types/Project/items/1/languages/en/versions/live \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

```json
{
    "id": "1",
    "data": {
        "title": "Default Project",
        "country": {
            "id": "1",
            "name": "United States",
            "code": "US",
            "iso3": "USA",
            "iso_number": "840",
            "internet": "US",
            "nationality": "American",
            "currency": "US Dollar",
            "currency_code": "USD",
            "population": "278058881",
            "title": "The United States",
            "deleted": false
        },
        "image": [
            "\/files\/document.pdf",
            "\/files\/Logos\/rokker.png"
        ],
        "status": [
            {
                "id": "1",
                "status": "Open",
                "deleted": false
            },
            {
                "id": "2",
                "status": "Close",
                "deleted": false
            }
        ],
        "yes_no": {
            "id": "1",
            "foreign_key": "1",
            "option": true,
            "explanation": "Second option selected"
        }
    },
    "item": {
        "id": "1",
        "alias": "default-project",
        "name": "Default Project",
        "publish_datetime": "2015-05-05 05:05:05",
        "unpublish_datetime": null,
        "external_id": "P1",
        "created": "2015-05-05 05:05:05",
        "modified": "2015-05-05 05:05:05",
        "folder": {
            "id": "1",
            "name": "Projects",
            "external_id": null
        },
        "type": {
            "id": "1",
            "alias": "Project",
            "name": "Project"
        },
        "owner": {
            "id": "1",
            "title": "Mr.",
            "firstname": "John",
            "middlename": "S",
            "lastname": "Doe",
            "fullname": "John Doe",
            "suffix": "Jr.",
            "gender": "m",
            "birthday": "1987-05-05",
            "email": "john@test.com",
            "description": "Description",
            "is_group": false,
            "external_id": "P1",
            "created": "2015-04-04 12:12:12",
            "modified": "2015-04-05 13:13:13"
        }
    },
    "language": "en",
    "version": {
        "id": "1",
        "version_number": "1",
        "is_live": true,
        "is_last": true
    },
    "campaign": {
        "id": "1",
        "goal_amount": null,
        "min_amount": null,
        "max_amount": null,
        "start": null,
        "end": null
    },
    "stage": {
        "id": "1",
        "name": "Default"
    }
}
```

## Person Types

Person types are simple records with a name (e.g. "Donor", "Field Team") that can be associated to a person record to categorize that person (e.g. donors).

### List person types

```
GET /person-types
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/person-types \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
Accept-Ranges: id, name
Content-Range: id 0..; max=100, total=1, order=asc
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

```json
[
    {
        "id": "1",
        "name": "Donor"
    }
]
```

### List person types for a person

```
GET /people/:id/person-types
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/people/1/person-types \
    -H "Authorization: HMAC <id>:<signature>"
```

The response is the same as above.

## People (Contacts)

People records represent contacts in CRM.

### List people

```
GET /people
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/people \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
Accept-Ranges: id
Content-Range: id 0..; max=100, total=1, order=asc
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

The data returned is similar to the [get a single person](#get-a-single-person) endpoint, but contains an array of records instead of a single record.

### List people of a certain type

```
GET /person-types/:type_id_or_alias/people
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/person-types/Donor/people \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

This endpoint returns people records, the same as the [list people](#list-people) endpoint.

### Get a single person

```
GET /people/:id
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/people/1 \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

```json
{
    "id": "3",
    "title": "Mr.",
    "firstname": "Full",
    "middlename": "S",
    "lastname": "Person",
    "fullname": "Full Person",
    "suffix": "Jr.",
    "gender": "m",
    "birthday": "1987-05-05",
    "email": {
        "id": "2",
        "email": "full.person@test.com",
        "created": "2015-05-05 05:05:05",
        "modified": "2015-05-05 05:05:05",
        "type": {
            "id": "1",
            "label": "Home",
            "quantity": "multiple"
        }
    },
    "description": "Description",
    "is_group": false,
    "external_id": "P3",
    "created": "2015-04-04 12:12:12",
    "modified": "2015-04-05 13:13:13",
    "household": {
        "id": "3",
        "name": "Full Person",
        "external_id": null,
        "head_person_id": "3"
    },
    "photo": {
        "id": "2",
        "path": "\/some\/path\/to\/other\/image.jpg",
        "created": "2016-04-04 10:12:12",
        "modified": "2016-02-04 20:12:12"
    },
    "address": {
        "id": "2",
        "address1": "2429A Broadway",
        "address2": "",
        "city": "New York",
        "zip": "10024",
        "latitude": "40.790526",
        "longitude": "-73.974953",
        "external_id": "A2",
        "default": true,
        "created": "2015-05-05 05:05:05",
        "modified": "2015-05-05 05:05:05",
        "state": {
            "id": "1",
            "name": "New York",
            "code": "NY"
        },
        "country": {
            "id": "1",
            "name": "United States",
            "title": "The United States",
            "code": "US",
            "iso3": "USA",
            "iso_number": "840",
            "internet": "US",
            "nationality": "American",
            "currency": "US Dollar",
            "currency_code": "USD",
            "population": "278058881"
        },
        "type": {
            "id": "1",
            "label": "Home",
            "quantity": "multiple"
        }
    },
    "phone": {
        "id": "2",
        "number": "() 123-4567",
        "is_outside_us": false,
        "created": "2016-04-14 20:00:00",
        "modified": "2016-04-14 20:00:00",
        "type": {
            "id": "1",
            "label": "Cell",
            "quantity": "multiple"
        }
    },
    "user": {
        "id": "7",
        "active": true,
        "verified": true,
        "api_id": "",
        "created": "2016-04-08 00:00:00",
        "modified": "2016-04-08 00:00:00"
    }
}
```

### Create a person

```
POST /people
```

**Input data**

Name | Type | Description
--- | --- | ---
`title` | *string* | Person title, e.g. "Mr.", "Ms.", ...
`firstname` | *string* | Person first name
`middlename` | *string* | Person middle name
`lastname` | *string* | Person last name
`fullname` | *string* | Optional if firstname and lastname are set. Concatenation of first, middle and last names; for groups, only this name is considered
`suffix` | *string* | Person suffix, e.g. "Jr."
`gender` | *string* | Person gender, one of: "m", "f"
`birthday` | *date* | Person birthday, in the format `Y-m-d`
`email` | *string* | Needs to be unique in the system
`description` | *string* | Person description
`is_group` | *bool* | False if this contact is an individual, true if it's a group (organization)
`external_id` | *string* | A reference to an external resource

The data needs to be sent in the body of the request, as a json object.

**Curl Example**

```bash
$ curl -n -XPOST https://<domain>/api/people \
  -d '{
  "title": "Mr.",
  "firstname": "John",
  "lastname": "Doe",
  "email": "johndoe@example.com"
  }' \
  -H "Content-Type: application/json" \
  -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

On successful create, this endpoint will return the full item data, as in [get a single person](#get-a-single-person), but the HTTP status code is `201`.

### Update a person

```
PATCH /people/:id
```

**Input data**

Name | Type | Description
--- | --- | ---
`external_id` | *string* | The id of the integrated external service resource
`household[external_id]` | *string* | The id of the integrated external service resource
`address[external_id]` | *string* | The id of the integrated external service resource

**Curl Example**

```bash
$ curl -n -XPATCH https://<domain>/api/people/1 \
  -d '{
  "external_id": "R2D2",
  "household": {
      "external_id": "FRODO"
  }
  }' \
  -H "Content-Type: application/json" \
  -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

On successful update, this endpoint will return the full item data, as in [get a single person](#get-a-single-person).

## Recurring Contributions

A recurring contribution represents a contribution that will be automatically processed at the set interval.

### List recurring contributions

```
GET /recurrings
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/recurrings \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
Accept-Ranges: id
Content-Range: id 0..; max=100, total=1, order=asc
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

The data returned is similar to the [get a single recurring contribution](#get-a-single-recurring-contribution) endpoint, but contains an array of records instead of a single record.

### Get a single recurring contribution

```
GET /recurrings/:id
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/recurrings/1 \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

```json
{
    "id": "1",
    "amount": "100.00",
    "notes": null,
    "is_anonymous": false,
    "extra_data": null,
    "external_id": null,
    "source_codes": null,
    "created": "2016-03-31 13:00:00",
    "modified": "2016-03-31 13:00:00",
    "recurring_batch": {
        "id": "1",
        "active": "1",
        "archived": null,
        "recurring_start_date": "2030-05-31",
        "recurring_end_date": null,
        "recurring_period": "month",
        "recurring_interval": "1",
        "recurring_day_of_month": "31",
        "prev_run_date": null,
        "next_run_date": "2030-05-31",
        "external_id": null,
        "currency": "USD",
        "source_codes": null,
        "processed_counter": "1",
        "created": "2016-03-31 13:00:00",
        "modified": "2016-03-31 13:00:00"
    },
    "campaign": {
        "id": "1",
        "goal_amount": null,
        "min_amount": null,
        "max_amount": null,
        "start": null,
        "end": null,
        "external_id": "P1",
        "item": {
            "id": "1",
            "alias": "default-project",
            "name": "Default Project",
            "publish_datetime": "2015-05-05 05:05:05",
            "unpublish_datetime": null,
            "external_id": "P1",
            "created": "2015-05-05 05:05:05",
            "modified": "2015-05-05 05:05:05",
            "owner": {
                "id": "1",
                "title": "Mr.",
                "firstname": "John",
                "middlename": "S",
                "lastname": "Doe",
                "fullname": "John Doe",
                "suffix": "Jr.",
                "gender": "m",
                "birthday": "1987-05-05",
                "email": "john@test.com",
                "description": "Description",
                "is_group": false,
                "external_id": "P1",
                "created": "2015-04-04 12:12:12",
                "modified": "2015-04-05 13:13:13"
            }
        }
    },
    "person": {
        "id": "1",
        "title": "Mr.",
        "firstname": "John",
        "middlename": "S",
        "lastname": "Doe",
        "fullname": "John Doe",
        "suffix": "Jr.",
        "gender": "m",
        "birthday": "1987-05-05",
        "email": {
            "id": "1",
            "email": "john@test.com",
            "created": "2015-05-05 05:05:05",
            "modified": "2015-05-05 05:05:05"
        },
        "description": "Description",
        "is_group": false,
        "external_id": "P1",
        "created": "2015-04-04 12:12:12",
        "modified": "2015-04-05 13:13:13",
        "household": {
            "id": "1",
            "name": "John Doe's Family",
            "external_id": "H1",
            "head_person_id": "1"
        },
        "address": {
            "id": "1",
            "address1": "2429A Broadway",
            "address2": "",
            "city": "New York",
            "zip": "10024",
            "latitude": "40.790526",
            "longitude": "-73.974953",
            "external_id": "A1",
            "default": true,
            "created": "2015-05-05 05:05:05",
            "modified": "2015-05-05 05:05:05",
            "state": {
                "id": "1",
                "name": "New York",
                "code": "NY"
            },
            "country": {
                "id": "1",
                "name": "United States",
                "title": "The United States",
                "code": "US",
                "iso3": "USA",
                "iso_number": "840",
                "internet": "US",
                "nationality": "American",
                "currency": "US Dollar",
                "currency_code": "USD",
                "population": "278058881"
            }
        },
        "phone": {
            "id": "1",
            "number": "(123) 456-7890",
            "is_outside_us": false,
            "created": "2016-04-14 20:00:00",
            "modified": "2016-04-14 20:00:00"
        }
    },
    "affiliated_person": {
        "id": "1",
        "title": "Mr.",
        "firstname": "John",
        "middlename": "S",
        "lastname": "Doe",
        "fullname": "John Doe",
        "suffix": "Jr.",
        "gender": "m",
        "birthday": "1987-05-05",
        "email": {
            "id": "1",
            "email": "john@test.com",
            "created": "2015-05-05 05:05:05",
            "modified": "2015-05-05 05:05:05"
        },
        "description": "Description",
        "is_group": false,
        "external_id": "P1",
        "created": "2015-04-04 12:12:12",
        "modified": "2015-04-05 13:13:13",
        "household": {
            "id": "1",
            "name": "John Doe's Family",
            "external_id": "H1",
            "head_person_id": "1"
        },
        "address": {
            "id": "1",
            "address1": "2429A Broadway",
            "address2": "",
            "city": "New York",
            "zip": "10024",
            "latitude": "40.790526",
            "longitude": "-73.974953",
            "external_id": "A1",
            "default": true,
            "created": "2015-05-05 05:05:05",
            "modified": "2015-05-05 05:05:05",
            "state": {
                "id": "1",
                "name": "New York",
                "code": "NY"
            },
            "country": {
                "id": "1",
                "name": "United States",
                "title": "The United States",
                "code": "US",
                "iso3": "USA",
                "iso_number": "840",
                "internet": "US",
                "nationality": "American",
                "currency": "US Dollar",
                "currency_code": "USD",
                "population": "278058881"
            }
        },
        "phone": {
            "id": "1",
            "number": "(123) 456-7890",
            "is_outside_us": false,
            "area_code": "123",
            "created": "2016-04-14 20:00:00",
            "modified": "2016-04-14 20:00:00"
        }
    }
}
```

## Types

A type represents a content type with dynamic fields.

### List Types

```
GET /types
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/types \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
Accept-Ranges: id, alias
Content-Range: id 0..; max=100, total=1, order=asc
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

```json
[
    {
        "id": "1",
        "alias": "Project",
        "name": "Project"
    }
]
```


## Webhooks

The Webhooks endpoints allow you to manage the hooks for a Site Stacker installation.

### List webhooks

```
GET /webhooks
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/webhooks \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
Accept-Ranges: id
Content-Range: id 0..; max=100, total=1, order=asc
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

The data returned is similar to the [get a single webhook](#get-a-single-webhook) endpoint, but contains an array of records instead of a single record.

### Get a single webhook

```
GET /webhooks/:id
```

**Curl Example**

```bash
$ curl -n https://<domain>/api/webhooks/1 \
    -H "Authorization: HMAC <id>:<signature>"
```

**Response Example**

```
HTTP/1.1 200 OK
RateLimit-Limit: 5000
RateLimit-Remaining: 4999
RateLimit-Reset: 1372700873
```

```json
{
    "id": "1",
    "url": "https://example.com",
    "active": true,
    "webhook_delivery_count": "2",
    "created": "2017-03-10 18:05:11",
    "modified": "2017-03-10 18:05:11",
    "events": [
        "*"
    ]
}
```
