---
title: API
category: API
date: 2018-04-02 00:00:00
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

```http
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

```http
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

All data is sent and received as JSON.

All dates are returned in the ISO 8601 format, as UTC. Example: `2018-04-04T11:39:57+00:00`.

```
2004-02-12 15:19:21
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
    -H "Date: Tue, 06 Feb 2017 00:02:41 +0000" \
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

## Endpoints

For all available endpoints go to <https://sitestacker.com/api> or on your Site Stacker installation at DOMAIN/api.