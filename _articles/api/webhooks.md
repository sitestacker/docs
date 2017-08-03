---
title: Webhooks
category: API
date: 2017-07-06 00:00:00
---

Webhooks allow you to build or set up integrations which subscribe to certain events on a Site Stacker installation. When one of those events is triggered, we'll send a HTTP POST payload to the webhook's configured URL.

Webhooks can be installed in the **Webhooks** component in admin. Once installed, they will be triggered each time one or more subscribed events occur.

## Events

When configuring a webhook, you can choose which events you would like to receive payloads for. You can even [opt-in to all current and future events](#wildcard-event). Only subscribing to the specific events you plan on handling is useful for limiting the number of HTTP requests to your server. You can change the list of subscribed events through the Webhooks component anytime.

The available events are:

Name | Description
--- | ---
[*](#wildcard-event) | Any time any event is triggered ([Wildcard Event](#wildcard-event)).
[campaign_create](#campaign-create) | Any time a campaign is created.
[campaign_update](#campaign-update) | Any time a campaign is updated.
[campaign_delete](#campaign-delete) | Any time a campaign is deleted.
[contribution_batch_create](#contribution-batch-create) | Any time a contribution batch is created.
[contribution_create](#contribution-create) | Any time a contribution is created.
[contribution_update](#contribution-update) | Any time a contribution is updated.
[person_create](#person-create) | Any time a person is created.
[person_update](#person-update) | Any time a person is updated.
[person_delete](#person-delete) | Any time a person is deleted.
[person_type_assignment](#person-type-assignment) | Any time a person type is assigned to a person.

## Payloads

Each event type has a specific payload format with the relevant event information. All event payloads are sent as json.

### Delivery headers

HTTP requests made to your webhook's configured URL endpoint will contain these special headers:

Header | Description
--- | ---
`SiteStacker-Event` | Name of the [event](#events) that triggered this delivery.
`SiteStacker-Signature` | HMAC hex digest of the payload, using the hook's secret as the key (if configured).
`SiteStacker-Delivery` | Unique ID for this delivery.

Also, the `User-Agent` for the requests will be `SiteStacker`.

### Deliveries

For each configured webhook you'll be able to inspect the deliveries (request and response) in the Webhook component, by right clicking your webhook and hitting "Deliveries".

### Failed Deliveries

If the response [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) for a delivery is not `2xx`, the delivery is considered failure and it will be retried 10 times at 1 minute intervals.

## Wildcard Event

Webhooks support a wildcard (`*`) that will match all supported events. When you add the wildcard event, we'll replace any existing events you have configured with the wildcard event and send you payloads for all supported events. You'll also automatically get any new events we might add in the future.

## Ping Event

When you create a new webhook, we'll send you a simple `ping` event to let you know you've set up the webhook correctly. You'll see this event in [Deliveries](#deliveries).

### Ping Event Payload

Key | Value
--- | ---
`hook` | The [webhook configuration](api#get-a-single-webhook)

## Campaign create

When a contribution campaign is created in Site Stacker, we'll send a `campaign_create` event.

### `campaign_create` Payload

The payload is the same as what you get when retrieving a campaign using the [`GET /campaigns/:id`](api#get-a-single-campaign) endpoint.

## Campaign update

When a contribution campaign is updated in Site Stacker, we'll send a `campaign_update` event.

### `campaign_update` Payload

The payload is the same as what you get when retrieving a campaign using the [`GET /campaigns/:id`](api#get-a-single-campaign) endpoint.

## Campaign delete

When a contribution campaign is deleted in Site Stacker, we'll send a `campaign_delete` event.

### `campaign_delete` Payload

The payload is the same as what you get when retrieving a campaign using the [`GET /campaigns/:id`](api#get-a-single-campaign) endpoint.

## Contribution batch create

When a contribution batch is created in Site Stacker, we'll send a `contribution_batch_create` event.

### `contribution_batch_create` Payload

The payload is the same as what you get when retrieving a contribution batch using the [`GET /contribution-batches/:id`](api#get-a-single-contribution-batch) endpoint.

## Contribution create

When a contribution is created in Site Stacker, we'll send a `contribution_create` event. Usually, you'll want to use the [`contribution_batch_create`](#contribution-batch-create) event instead of this one, since a contribution is always created along with a contribution batch.

### `contribution_create` Payload

The payload is the same as what you get when retrieving a contribution using the [`GET /contributions/:id`](api#get-a-single-contribution) endpoint.

## Contribution update

When a contribution is updated in Site Stacker, we'll send a `contribution_update` event.

### `contribution_update` Payload

The payload is the same as what you get when retrieving a contribution using the [`GET /contributions/:id`](api#get-a-single-contribution) endpoint.

## Person create

When a person is created in Site Stacker, we'll send a `person_create` event.

### `person_create` Payload

The payload is the same as what you get when retrieving a person using the [`GET /people/:id`](api#get-a-single-person) endpoint.

## Person update

When a person is updated in Site Stacker, we'll send a `person_update` event.

### `person_update` Payload

The payload is the same as what you get when retrieving a person using the [`GET /people/:id`](api#get-a-single-person) endpoint.

## Person delete

When a person is deleted in Site Stacker, we'll send a `person_delete` event.

### `person_delete` Payload

The payload is the same as what you get when retrieving a person using the [`GET /people/:id`](api#get-a-single-person) endpoint.

## Person type assign

When a person type is assigned to a person record, we'll send a `person_type_assign` event. This event is useful if, for example, you want to be notified when a person becomes a donor.

### `person_type_assign` Payload

The payload contains the `person_type` record and the `person` record, which contains all the data sent by the [`GET /people/:id`](api#get-a-single-person) endpoint.

```json
{
    "person_type": {
        "id": "18",
        "name": "Donor"
    },
    "person": {
        "...": "[ all the data of the GET /people/:id endpoint ]"
    }
}
```
